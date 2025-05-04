import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useRouter } from 'expo-router';
import Alert from '../components/Alerts';
import Button from '../components/Button';
import { OrderResponse } from '@pharmatech/sdk';
import { UserService } from '../services/user';
import { truncateString } from '../utils/commons';

const STATUS_LABELS: Record<string, string> = {
  requested: 'Pendiente',
  ready_for_pickup: 'A Enviar',
  in_progress: 'En Proceso',
  approved: 'Aprobado',
};

const STATUS_COLORS: Record<string, string> = {
  requested: Colors.semanticDanger,
  ready_for_pickup: Colors.semanticInfo,
  in_progress: Colors.secondaryGray,
  approved: Colors.secondary,
};

const ActiveOrdersScreen = () => {
  const [activeOrdersList, setActiveOrdersList] = useState<
    OrderResponse[] | undefined
  >(undefined);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const order = await UserService.getUserOrders();
        if (order.success) {
          const activeOrders = order.data.results.filter(
            (o) =>
              o.status === 'requested' ||
              o.status === 'approved' ||
              o.status === 'ready_for_pickup' ||
              o.status === 'in_progress',
          );
          if (activeOrders.length > 0) {
            setActiveOrdersList(activeOrders);
          } else {
            setShowInfoAlert(true);
          }
        }
      } catch (error) {
        console.log(error);
        setErrorMessage('Ha ocurrido un error');
        setShowErrorAlert(true);
      }
    };

    fetchActiveOrders();
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
        {showInfoAlert && (
          <Alert
            type="info"
            title="No tiene pedidos activos"
            message="No tiene pedidos activos"
            onClose={() => {
              setShowInfoAlert(false);
            }}
            borderColor
          />
        )}
      </View>
      <View style={styles.orderHeader}>
        <PoppinsText style={{ fontSize: FontSizes.s1.size }}>
          Pedidos Activos
        </PoppinsText>
      </View>
      <View style={styles.orderInfo}>
        {activeOrdersList &&
          activeOrdersList.length > 0 &&
          activeOrdersList.map((order, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: Colors.gray_100,
                marginVertical: 5,
                backgroundColor: Colors.textWhite,
                borderRadius: 10,
              }}
            >
              <View style={{ paddingVertical: 10, flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <PoppinsText>
                      {order ? truncateString(order?.id, 8) : ''}
                    </PoppinsText>
                    <PoppinsText style={{ color: Colors.textLowContrast }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </PoppinsText>
                  </View>
                  <PoppinsText>${order.totalPrice.toFixed(2)}</PoppinsText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 5,
                  }}
                >
                  <PoppinsText
                    style={{
                      padding: 5,
                      backgroundColor:
                        STATUS_COLORS[order.status] || Colors.semanticDanger,
                      borderRadius: 5,
                      width: 80,
                      color: Colors.textWhite,
                      fontSize: FontSizes.c1.size,
                      textAlign: 'center',
                    }}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </PoppinsText>
                  <TouchableOpacity
                    onPress={() => router.push(`order/${order.id}`)}
                  >
                    <PoppinsText style={{ fontSize: FontSizes.c1.size }}>
                      Ver detalles
                    </PoppinsText>
                  </TouchableOpacity>
                  <Button
                    title="Re ordenar"
                    size="small"
                    style={{ paddingVertical: 0 }}
                  />
                </View>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

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
  orderInfo: {
    marginVertical: 5,
  },
});

export default ActiveOrdersScreen;
