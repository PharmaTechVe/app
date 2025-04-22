import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useRouter } from 'expo-router';
import Alert from '../components/Alerts';
import Button from '../components/Button';
import { OrderResponse } from '@pharmatech/sdk'; // Usar el tipo del SDK
import { UserService } from '../services/user';

const OrdersScreen = () => {
  const [ordersList, setOrdersList] = useState<OrderResponse[] | undefined>(
    undefined,
  );
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const order = await UserService.getUserOrders();
        if (order.success) {
          if (order.data.results.length > 0) {
            setOrdersList(order.data.results);
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
        {showInfoAlert && (
          <Alert
            type="info"
            title="No tiene pedidos"
            message="No tiene pedidos"
            onClose={() => {
              setShowInfoAlert(false);
            }}
            borderColor
          />
        )}
      </View>
      <View style={styles.orderHeader}>
        <PoppinsText style={{ fontSize: FontSizes.s1.size }}>
          Mis Pedidos
        </PoppinsText>
      </View>
      <View style={styles.orderInfo}>
        {ordersList &&
          ordersList.length > 0 &&
          ordersList.map((order, index) => (
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
                    <PoppinsText>{order.id}</PoppinsText>
                    <PoppinsText style={{ color: Colors.textLowContrast }}>
                      {new Date(order.createdAt).toLocaleDateString()}{' '}
                      {/* Formatear fecha */}
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
                      backgroundColor: Colors.semanticDanger,
                      borderRadius: 5,
                      width: 80,
                      textAlign: 'center',
                      color: Colors.textWhite,
                      fontSize: FontSizes.c1.size,
                    }}
                  >
                    {order.status}
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

export default OrdersScreen;
