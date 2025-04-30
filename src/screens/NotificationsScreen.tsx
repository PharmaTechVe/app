import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
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
import NotificationIcon from '../assets/images/favicon.png';
import { Colors, FontSizes } from '../styles/theme';
import { NotificationService } from '../services/notifications';
import { getUserIdFromSecureStore } from '../helper/jwtHelper';

export default function NotificationsScreen() {
  const navigation = useNavigation();

  const [notificationsList, setNotificationsList] = useState<
    Array<{
      id: string;
      title: string;
      message: string;
      createdAt: string;
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
        if (res.success && res.data && Array.isArray(res.data)) {
          setNotificationsList(
            res.data.map((nt) => ({
              id: nt.id,
              title: nt.title,
              message: nt.message,
              createdAt: nt.createdAt,
            })),
          );
        } else {
          throw new Error('Respuesta inesperada del servidor');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Ocurrió un error desconocido.');
        }
        setShowErrorAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatRelativeDate = (dateString: string) => {
    const date = parseISO(dateString);
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff <= 7) {
      return formatDistanceToNow(date, { locale: es, addSuffix: true });
    }
    return format(date, 'yyyy-MM-dd', { locale: es });
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
              style={styles.item}
              onPress={() => {
                /* TODO: navegar a detalle o marcar como leído */
              }}
            >
              <Image source={NotificationIcon} style={styles.icon} />
              <View style={styles.textContainer}>
                <View style={styles.itemHeader}>
                  <PoppinsText weight="semibold">{nt.title}</PoppinsText>
                  <PoppinsText style={styles.date}>
                    {formatRelativeDate(nt.createdAt)}
                  </PoppinsText>
                </View>
                <PoppinsText style={styles.message}>{nt.message}</PoppinsText>
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
    marginLeft: 20,
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
  },
  icon: { width: 32, height: 32, marginRight: 12, marginTop: 4 },
  textContainer: { flex: 1 },
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
  },
});
