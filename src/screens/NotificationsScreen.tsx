import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Alert from '../components/Alerts';
import TopBar from '../components/TopBar';
import Return from '../components/Return';
import { useNavigation } from '@react-navigation/native';
import {
  formatDistanceToNow,
  parseISO,
  differenceInDays,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';
import NotificationIcon from '../assets/images/favicon.png'; // Import the image

export default function NotificationsScreen() {
  const [notificationsList, setNotificationsList] = useState([
    {
      title: 'Notificación 1',
      message: 'Mensaje de la notificación 1',
      date: '2025-04-29',
    },
    {
      title: 'Notificación 2',
      message: 'Mensaje de la notificación 2',
      date: '2025-03-02',
    },
    {
      title: 'Notificación 3',
      message: 'Mensaje de la notificación 3',
      date: '2023-10-03',
    },
  ]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    setNotificationsList([
      {
        title: 'Notificación 1',
        message: 'Mensaje de la notificación 1',
        date: '2025-04-29',
      },
      {
        title: 'Notificación 2',
        message: 'Mensaje de la notificación 2',
        date: '2025-03-02',
      },
      {
        title: 'Notificación 3',
        message: 'Mensaje de la notificación 3',
        date: '2023-10-03',
      },
    ]);
  }, []);

  const formatRelativeDate = (dateString: string) => {
    const date = parseISO(dateString);
    const daysDifference = differenceInDays(new Date(), date);

    if (daysDifference <= 7) {
      return formatDistanceToNow(date, { locale: es, addSuffix: true });
    } else {
      return format(date, 'yyyy-MM-dd', { locale: es });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar />
      <View style={styles.alertContainer}>
        {showErrorAlert && (
          <Alert
            type="error"
            title="Error"
            message={errorMessage}
            onClose={() => setShowErrorAlert(false)}
            borderColor
          />
        )}
      </View>
      <View style={styles.orderHeader}>
        <View
          style={[
            styles.headerContent,
            { justifyContent: 'flex-start', marginLeft: 20 },
          ]}
        >
          <Return onClose={() => navigation.goBack()} />
          <PoppinsText
            style={{
              fontSize: FontSizes.s1.size,
              marginLeft: 50,
              color: Colors.textMain,
            }}
          >
            Notificaciones
          </PoppinsText>
        </View>
      </View>
      <View style={styles.orderInfo}>
        <ScrollView
          style={styles.notificationsScroll}
          contentContainerStyle={styles.notificationsContainer}
        >
          {notificationsList &&
            notificationsList.length > 0 &&
            notificationsList.map((nt, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  marginVertical: 5,
                }}
              >
                <Image
                  source={NotificationIcon} // Use the imported image
                  style={{ width: 32, height: 32, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <PoppinsText>{nt.title}</PoppinsText>
                    <PoppinsText
                      style={{
                        color: Colors.textLowContrast,
                        fontSize: FontSizes.c1.size,
                      }}
                    >
                      {formatRelativeDate(nt.date)}
                    </PoppinsText>
                  </View>
                  <PoppinsText
                    style={{
                      color: Colors.textLowContrast,
                      fontSize: FontSizes.c1.size,
                    }}
                  >
                    {nt.message}
                  </PoppinsText>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
  },
  alertContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -162,
    top: 20,
    right: 0,
    zIndex: 1000,
  },
  orderHeader: {
    marginTop: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.primary,
  },
  orderInfo: {
    marginVertical: 5,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  bottomEditButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
    width: '50%',
    alignItems: 'center',
  },
  notificationsScroll: {
    maxHeight: 400,
  },
  notificationsContainer: {
    paddingBottom: 20,
  },
});
