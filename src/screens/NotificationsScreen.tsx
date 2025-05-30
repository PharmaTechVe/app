// src/screens/NotificationsScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
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
import { SvgProps } from 'react-native-svg';

// Importa tus SVG como componentes React
import CompletedSvg from '../assets/images/notifications/f.svg';
import InProgressSvg from '../assets/images/notifications/r.svg';
import ApprovedSvg from '../assets/images/notifications/image.svg';
import CanceledSvg from '../assets/images/notifications/w.svg';
import ReadyForPickupSvg from '../assets/images/notifications/e.svg';
import DeliverySvg from '../assets/images/notifications/m.svg';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  orderId: string;
  status: string;
};

type NotificationResponse = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  order?: {
    id: string;
    status: string;
  };
};

// Mapeo de status → componente SVG
const notificationIcons: Record<string, React.FC<SvgProps>> = {
  completed: CompletedSvg,
  in_progress: InProgressSvg,
  approved: ApprovedSvg,
  canceled: CanceledSvg,
  ready_for_pickup: ReadyForPickupSvg,
  delivery: DeliverySvg,
};

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
        const res = await NotificationService.getNotifications();
        if (!res.success || !Array.isArray(res.data)) {
          const errorMsg =
            !res.success && 'error' in res && res.error
              ? res.error
              : 'Respuesta inesperada del servidor';
          throw new Error(errorMsg);
        }

        const items = res.data.map((nt: NotificationResponse) => {
          const order = nt.order || { id: '', status: '' };
          return {
            id: nt.id,
            title: nt.title,
            message: nt.message.trim(),
            createdAt: nt.createdAt,
            isRead: !!nt.isRead,
            orderId: order.id,
            status: order.status,
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

  // Marca todas como leídas al entrar o salir de la pantalla
  useFocusEffect(
    useCallback(() => {
      const markAllRead = async () => {
        try {
          const toMark = notificationsList.filter((n) => !n.isRead);
          if (toMark.length === 0) return;

          await Promise.all(
            toMark.map((n) => NotificationService.markAsRead(n.orderId)),
          );
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

  const renderNotification = (nt: NotificationItem) => {
    const Icon = notificationIcons[nt.status];
    return (
      <View
        key={nt.id}
        style={[styles.item, !nt.isRead && styles.unreadBackground]}
      >
        <Icon width={32} height={32} />
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
    );
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
          {notificationsList.map(renderNotification)}
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
  textContainer: {
    flex: 1,
    marginLeft: 12,
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
    flexWrap: 'wrap',
  },
});
