import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Alert from '../components/Alerts';
import { NotificationService } from '../services/notifications';
import { NotificationResponse } from '@pharmatech/sdk';

export default function NotificationsScreen() {
  const [notificationsList, setNotificationsList] = useState<
    Partial<NotificationResponse>[] | undefined
  >([
    {
      title: 'Notificacion',
      message: 'Esta es una notificacion',
      date: 'pepe',
    },
  ]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const notifications = await NotificationService.getNotifications();
        if (notifications.success) {
          if (notifications.data.results.length > 0) {
            setNotificationsList(notifications.data.results);
          }
        }
      } catch (error) {
        console.log(error);
        setErrorMessage('Ha ocurrido un error');
        setShowErrorAlert(true);
      }
    };

    fetchOrders();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <PoppinsText style={{ fontSize: FontSizes.s1.size }}>
          Notificaciones
        </PoppinsText>
      </View>
      <View style={styles.orderInfo}>
        {notificationsList &&
          notificationsList.length > 0 &&
          notificationsList.map((nt, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginVertical: 5,
              }}
            >
              <View></View>
              <View style={{ paddingVertical: 10, flex: 1 }}>
                <View>
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
                      {nt.date}
                    </PoppinsText>
                  </View>
                  <View>
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
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
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
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
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
});
