// src/context/NotificationsContext.ts

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
            isRead: Boolean(n.isRead), // Explicitly use the type from NotificationResponse
          })),
        );
      } else {
        console.error('Error cargando notificaciones:', response);
      }
    } catch (err) {
      console.error('Excepción cargando notificaciones:', err);
    }
  }, []);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

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
      // Si la API soporta 'unread', aquí iría la llamada a NotificationService.markAsUnread(...)
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
