import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { NotificationService } from '../services/notifications';
import { NotificationResponse } from '@pharmatech/sdk';
import { ServiceResponse } from '../types/api';
import { getUserIdFromSecureStore } from '../helper/jwtHelper';
import EventSource from 'react-native-sse';
import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';

export type Notification = NotificationResponse & { isRead: boolean };

export type NotificationsContextType = {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
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
      if (!token) throw new Error('No se pudo obtener el token.');

      const response: ServiceResponse<
        NotificationResponse | NotificationResponse[]
      > = await NotificationService.getNotifications();

      if (response.success && response.data) {
        const rawArray = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const mapped = rawArray.map((n) => ({
          ...n,
          isRead: Boolean(n.isRead),
        }));
        console.log('Notificaciones recibidas:', mapped);
        setNotifications(mapped);
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
      if (!token) throw new Error('No se pudo obtener el token.');
      await NotificationService.markAsRead(notificationId, token);
      // optimismo: actualizamos localmente
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
    // si tu API no ofrece un endpoint "unread", lo simulamos localmente
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n)),
    );
  }, []);

  // Conteos derivados
  const totalCount = notifications.length;
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  useEffect(() => {
    let es: EventSource | null = null;

    async function setupSSE() {
      // 1) carga inicial
      await refreshNotifications();

      // 2) stream SSE
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;

      const axiosClient = api.client['client'];
      const baseURL: string | undefined = axiosClient.getUri
        ? axiosClient.getUri({ url: '' })
        : axiosClient.defaults.baseURL;
      if (!baseURL) return;

      const url = `${baseURL.replace(/\/$/, '')}/notification/stream`;

      es = new EventSource(url, {
        headers: { Authorization: `Bearer ${token}` },
        lineEndingCharacter: '\n',
      });

      // Cada vez que llegue un mensaje, recargamos TODO el listado:
      es.addEventListener('message', () => {
        console.log('[SSE] mensaje recibido → refrescando notificaciones');
        void refreshNotifications();
      });

      es.addEventListener('error', (err) => {
        console.error('[SSE] error:', err);
      });
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
      value: {
        notifications,
        totalCount,
        unreadCount,
        markAsRead,
        markAsUnread,
        refreshNotifications,
      },
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
