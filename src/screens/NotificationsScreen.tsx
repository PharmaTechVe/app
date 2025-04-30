// src/screens/NotificationsScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  formatDistanceToNow,
  parseISO,
  differenceInDays,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';

import TopBar from '../components/TopBar';
import Return from '../components/Return';
import PoppinsText from '../components/PoppinsText';
import Alert from '../components/Alerts';
// Importamos y casteamos explicitamente el ícono por defecto
import NotificationIconAsset from '../assets/images/favicon.png';
import { Colors, FontSizes } from '../styles/theme';
import { NotificationService } from '../services/notifications';
import { getUserIdFromSecureStore } from '../helper/jwtHelper';

import completedImg from '../assets/images/notifications/f.jpg';
import inProgressImg from '../assets/images/notifications/r.jpg';
import approvedImg from '../assets/images/notifications/image.jpg';
import canceledImg from '../assets/images/notifications/w.jpg';
import readyForPickupImg from '../assets/images/notifications/e.jpg';
import deliveryImg from '../assets/images/notifications/m.jpg';

// Mapeo de iconos por estado
const notificationIcons: Record<string, ImageSourcePropType> = {
  completed: completedImg as unknown as ImageSourcePropType,
  in_progress: inProgressImg as unknown as ImageSourcePropType,
  approved: approvedImg as unknown as ImageSourcePropType,
  canceled: canceledImg as unknown as ImageSourcePropType,
  ready_for_pickup: readyForPickupImg as unknown as ImageSourcePropType,
  delivery: deliveryImg as unknown as ImageSourcePropType,
};

// Ícono por defecto, casteado a ImageSourcePropType
const NotificationIcon =
  NotificationIconAsset as unknown as ImageSourcePropType;

// Función auxiliar para extraer orderId del mensaje
const extractOrderIdFromMessage = (message: string): string | null => {
  const match = message.match(/The order (\S+) has been updated to/i);
  return match ? match[1] : null;
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notificationsList, setNotificationsList] = useState<
    Array<{
      id: string;
      title: string;
      message: string;
      createdAt: string;
      isRead: boolean;
      orderId: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setShowErrorAlert(false);
      try {
        const token = await getUserIdFromSecureStore();
        if (!token) throw new Error('No se pudo obtener el token de usuario.');

        const res = await NotificationService.getNotifications();
        if (res.success && Array.isArray(res.data)) {
          console.log('Raw notifications payload:', res.data);

          setNotificationsList(
            res.data.map((nt) => {
              const rawOrderId =
                nt.orderId ||
                (nt as { order_id?: string }).order_id || // Specify type for `order_id`
                (nt.data &&
                  ((nt.data as { orderId?: string }).orderId || // Specify type for `data.orderId`
                    (nt.data as { order_id?: string }).order_id)) || // Specify type for `data.order_id`
                extractOrderIdFromMessage(nt.message) ||
                '';

              return {
                id: nt.id,
                title: nt.title,
                message: nt.message,
                createdAt: nt.createdAt,
                isRead: !!nt.isRead,
                orderId: rawOrderId,
              };
            }),
          );
        } else if (!res.success) {
          throw new Error(res.error || 'Respuesta inesperada del servidor');
        }
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Error desconocido',
        );
        setShowErrorAlert(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handlePressNotification = useCallback(
    async (nt: (typeof notificationsList)[0]) => {
      console.log(`order ID: ${nt.orderId}`, nt);

      if (nt.isRead) return;

      try {
        const token = await getUserIdFromSecureStore();
        if (!token) throw new Error('No se pudo obtener el token de usuario.');
        if (nt.orderId) {
          await NotificationService.markAsRead(nt.orderId, token);
          setNotificationsList((prev) =>
            prev.map((n) => (n.id === nt.id ? { ...n, isRead: true } : n)),
          );
        } else {
          throw new Error('ID de notificación no válido.');
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Error desconocido al marcar la notificación como leída.';
        console.error(`Error marcando notificación ${nt.id}:`, msg);
        setErrorMessage(msg);
        setShowErrorAlert(true);
      }
    },
    [],
  );

  const formatRelativeDate = (dateString: string) => {
    const date = parseISO(dateString);
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff <= 7) {
      return formatDistanceToNow(date, { locale: es, addSuffix: true });
    }
    return format(date, 'yyyy-MM-dd', { locale: es });
  };

  const extractStatusKey = (message: string): string | null => {
    const match = message.match(
      /The order \S+ has been updated to ([\w_]+)\.?/i,
    );
    return match ? match[1].toLowerCase() : null;
  };

  const translateMessage = (message: string) => {
    const match = message.match(
      /The order (\S+) has been updated to ([\w_]+)\.?/i,
    );
    if (!match) return message;
    const [, orderId, rawStatus] = match;
    const key = rawStatus.replace(/_/g, ' ').toLowerCase();
    const map: Record<string, string> = {
      completed: 'completada',
      'in progress': 'en progreso',
      approved: 'aprobada',
      canceled: 'cancelada',
      'ready for pickup': 'lista para recoger',
      delivery: 'en entrega',
    };
    return `La orden ${orderId} ha sido actualizada a ${map[key] || key}`;
  };

  const getTranslatedTitle = (nt: { title: string; message: string }) => {
    const key = extractStatusKey(nt.message);
    if (!key) return nt.title;
    const map: Record<string, string> = {
      completed: 'Pedido Completado',
      in_progress: 'Pedido en Progreso',
      approved: 'Orden Aprobada',
      canceled: 'Orden Cancelada',
      ready_for_pickup: 'Pedido Listo para Recoger',
      delivery: 'Pedido en Entrega',
    };
    return map[key] || nt.title;
  };

  const getNotificationIcon = (message: string): ImageSourcePropType => {
    const key = extractStatusKey(message);
    return (key && notificationIcons[key]) || NotificationIcon;
  };

  return (
    <View style={styles.container}>
      <TopBar />

      {showErrorAlert && (
        <View style={styles.alertContainer}>
          <Alert
            type="error"
            title="Error"
            message={errorMessage}
            onClose={() => setShowErrorAlert(false)}
            borderColor
          />
        </View>
      )}

      <View style={styles.header}>
        <Return onClose={() => navigation.goBack()} />
        <PoppinsText style={styles.title}>Notificaciones</PoppinsText>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      ) : notificationsList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PoppinsText>No tienes notificaciones pendientes.</PoppinsText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {notificationsList.map((nt) => (
            <TouchableOpacity
              key={nt.id}
              onPress={() => handlePressNotification(nt)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.item, !nt.isRead && styles.unreadBackground]}
              >
                <Image
                  source={getNotificationIcon(nt.message)}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <View style={styles.itemHeader}>
                    <PoppinsText weight="semibold">
                      {getTranslatedTitle(nt)}
                    </PoppinsText>
                    <PoppinsText style={styles.date}>
                      {formatRelativeDate(nt.createdAt)}
                    </PoppinsText>
                  </View>
                  <PoppinsText style={styles.message}>
                    {translateMessage(nt.message)}
                  </PoppinsText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgColor },
  alertContainer: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -162 }],
    width: 326,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  title: {
    fontSize: FontSizes.s1.size,
    marginLeft: 40,
    color: Colors.textMain,
  },
  loader: { marginTop: 40 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: { paddingVertical: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgColor,
    backgroundColor: Colors.bgColor,
  },
  unreadBackground: {
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
    marginTop: 4,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  date: {
    color: Colors.textLowContrast,
    fontSize: FontSizes.c1.size,
  },
  message: {
    color: Colors.textLowContrast,
    fontSize: FontSizes.c1.size,
    marginRight: 80,
    flexWrap: 'wrap',
  },
});
