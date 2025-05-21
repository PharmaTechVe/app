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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  formatDistanceToNow,
  parseISO,
  differenceInDays,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import TopBar from '../components/TopBar';
import PoppinsText from '../components/PoppinsText';
import Alert from '../components/Alerts';
import { Colors, FontSizes } from '../styles/theme';
import { NotificationService } from '../services/notifications';
import { getUserIdFromSecureStore } from '../helper/jwtHelper';

import completedImg from '../assets/images/notifications/f.jpg';
import inProgressImg from '../assets/images/notifications/r.jpg';
import approvedImg from '../assets/images/notifications/image.jpg';
import canceledImg from '../assets/images/notifications/w.jpg';
import readyForPickupImg from '../assets/images/notifications/e.jpg';
import deliveryImg from '../assets/images/notifications/m.jpg';
import defaultIcon from '../assets/images/favicon.png';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  orderId: string;
  status: string;
};

const notificationIcons: Record<string, ImageSourcePropType> = {
  completed: completedImg as ImageSourcePropType,
  in_progress: inProgressImg as ImageSourcePropType,
  approved: approvedImg as ImageSourcePropType,
  canceled: canceledImg as ImageSourcePropType,
  ready_for_pickup: readyForPickupImg as ImageSourcePropType,
  delivery: deliveryImg as ImageSourcePropType,
};

const defaultIconSource = defaultIcon as ImageSourcePropType;

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notificationsList, setNotificationsList] = useState<
    NotificationItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Carga inicial de notificaciones
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setShowErrorAlert(false);
      try {
        const token = await getUserIdFromSecureStore();
        if (!token) throw new Error('No se pudo obtener el token de usuario.');

        const res = await NotificationService.getNotifications();
        if (!res.success || !Array.isArray(res.data)) {
          const errorMsg =
            !res.success && 'error' in res && res.error
              ? res.error
              : 'Respuesta inesperada del servidor';
          throw new Error(errorMsg);
        }

        const items = res.data.map((nt: Record<string, unknown>) => {
          const order = (nt.order || {}) as Record<string, unknown>;
          return {
            id: nt.id as string,
            title: nt.title as string,
            message: (nt.message as string).trim(),
            createdAt: nt.createdAt as string,
            isRead: !!nt.isRead,
            orderId: order.id as string,
            status: order.status as string,
          };
        });

        setNotificationsList(items);
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

  // Marca todas como leídas al enfocar o desenfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      const markAllRead = async () => {
        try {
          const token = await getUserIdFromSecureStore();
          if (!token) return;

          // Filtrar solo las no leídas
          const toMark = notificationsList.filter((n) => !n.isRead);
          if (toMark.length === 0) return;

          // Llamar al servicio en paralelo
          await Promise.all(
            toMark.map((n) => NotificationService.markAsRead(n.orderId, token)),
          );

          // Actualizar estado local
          setNotificationsList((prev) =>
            prev.map((n) => ({ ...n, isRead: true })),
          );
        } catch (e) {
          console.warn(
            'Error al marcar todas las notificaciones como leídas:',
            e,
          );
        }
      };

      markAllRead();
      // no necesitamos cleanup
    }, [notificationsList]),
  );

  const formatRelativeDate = (dateString: string) => {
    const date = parseISO(dateString);
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff <= 7) {
      return formatDistanceToNow(date, { locale: es }).replace(
        'alrededor de ',
        'Hace ',
      );
    }
    return format(date, 'yyyy-MM-dd', { locale: es });
  };

  const getNotificationIcon = (status: string): ImageSourcePropType => {
    return notificationIcons[status] || defaultIconSource;
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <ChevronLeftIcon
          width={20}
          height={20}
          color={Colors.primary}
          style={{ marginRight: 4 }}
        />
        <PoppinsText weight="medium" style={styles.backText}>
          Volver
        </PoppinsText>
      </TouchableOpacity>

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
            <View
              key={nt.id}
              style={[styles.item, !nt.isRead && styles.unreadBackground]}
            >
              <Image
                source={getNotificationIcon(nt.status)}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <View style={styles.itemHeader}>
                  <PoppinsText weight="semibold">{nt.title}</PoppinsText>
                  <PoppinsText style={styles.date}>
                    {formatRelativeDate(nt.createdAt)}
                  </PoppinsText>
                </View>
                <PoppinsText style={styles.message}>{nt.message}</PoppinsText>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 8,
    marginBottom: -4,
  },
  backText: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.primary,
  },
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
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FontSizes.s1.size,
    color: Colors.primary,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 10,
  },
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
