import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { NotificationService } from '../services/notifications';
import { NotificationResponse } from '@pharmatech/sdk';
import { ServiceResponse } from '../types/api';
import { getUserIdFromSecureStore } from '../helper/jwtHelper';
import EventSource, { EventSourceListener } from 'react-native-sse';
import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';

export type Notification = NotificationResponse & { isRead: boolean };

export type NotificationsContextType = {
  notifications: Notification[];
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | null>(
  null,
);

export function NotificationsProvider(props: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = useCallback(async (): Promise<void> => {
    try {
      const token = await getUserIdFromSecureStore();
      if (!token)
        throw new Error('No se pudo obtener el token de autenticación.');

      const response: ServiceResponse<
        NotificationResponse | NotificationResponse[]
      > = await NotificationService.getNotifications();

      if (response.success && response.data) {
        const rawArray = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setNotifications(
          rawArray.map((n: NotificationResponse) => ({
            ...n,
            isRead: Boolean(n.isRead),
          })),
        );
      } else {
        console.error('Error cargando notificaciones:', response);
      }
    } catch (err) {
      console.error('Excepción cargando notificaciones:', err);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const token = await getUserIdFromSecureStore();
      if (!token)
        throw new Error('No se pudo obtener el token de autenticación.');

      await NotificationService.markAsRead(notificationId, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(
        `Error marcando notificación ${notificationId} como leída:`,
        err,
      );
    }
  }, []);

  const markAsUnread = useCallback(async (notificationId: string) => {
    try {
      // Si la API soporta 'unread', aquí iría NotificationService.markAsUnread(...)
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: false } : n,
        ),
      );
    } catch (err) {
      console.error(
        `Error marcando notificación ${notificationId} como no leída:`,
        err,
      );
    }
  }, []);

  // SSE: Real-time notifications
  useEffect(() => {
    let es: EventSource | null = null;

    async function setupSSE() {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        if (!token) return;

        // Usa el api de sdkConfig para obtener el cliente y baseURL
        const axiosClient = api.client['client'];
        const baseURL: string | undefined = axiosClient?.getUri
          ? axiosClient.getUri({ url: '' })
          : axiosClient?.defaults?.baseURL;
        if (!baseURL) return;

        const url = `${baseURL.replace(/\/$/, '')}/notification/stream`;

        es = new EventSource(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          lineEndingCharacter: '\n',
        });

        const listener: EventSourceListener = (event) => {
          console.log('Evento SSE recibido:', event.type);
          if (event.type === 'open') {
            console.log('Conexión SSE abierta');
          } else if (event.type === 'message') {
            console.log('[SSE] Tipo: message');
            console.log('[SSE] Event object:', event);
            console.log('[SSE] Raw data:', event.data);
            if (typeof event.data === 'string') {
              const notif = JSON.parse(event.data) as NotificationResponse;
              console.log('[SSE] Parsed notification:', notif);
              setNotifications((prev) => {
                void refreshNotifications();
                if (prev.some((n) => n.id === notif.id)) return prev;
                return [{ ...notif, isRead: Boolean(notif.isRead) }, ...prev];
              });
            }
          } else if (event.type === 'error') {
            console.error('Error SSE:', event);
          }
        };

        es.addEventListener('open', listener);
        es.addEventListener('message', listener);
        es.addEventListener('error', listener);
      } catch (err) {
        console.error('Error inicializando SSE para notificaciones:', err);
      }
    }

    setupSSE();

    return () => {
      if (es) {
        es.removeAllEventListeners();
        es.close();
      }
    };
  }, [refreshNotifications]);

  return React.createElement(
    NotificationsContext.Provider,
    {
      value: { notifications, markAsRead, markAsUnread, refreshNotifications },
    },
    props.children,
  );
}

export function useNotifications(): NotificationsContextType {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      'useNotifications debe usarse dentro de NotificationsProvider',
    );
  }
  return ctx;
}
