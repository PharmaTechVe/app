import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { NotificationService } from '../services/notifications';
import { NotificationResponse } from '@pharmatech/sdk';
import { ServiceResponse } from '../types/api';

// Define tu tipo interno
export type Notification = NotificationResponse & { isRead: boolean };

type NotificationsContextType = {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  refreshNotifications: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | null>(
  null,
);

export function NotificationsProvider(props: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = async () => {
    // Llamas al service
    const response: ServiceResponse<
      NotificationResponse | NotificationResponse[]
    > = await NotificationService.getNotifications();

    if (response.success && response.data) {
      // response.data puede ser un array o un solo objeto
      const raw = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const withReadFlag: Notification[] = raw.map((n) => ({
        ...n,
        isRead: false,
      }));
      setNotifications(withReadFlag);
    } else {
      // Solo logueamos whole response para debug
      console.error('Error cargando notificaciones:', response);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  return React.createElement(
    NotificationsContext.Provider,
    { value: { notifications, markAsRead, refreshNotifications } },
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
