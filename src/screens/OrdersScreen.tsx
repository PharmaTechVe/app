import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Return from '../components/Return';
import { Link, useRouter } from 'expo-router';
import Alert from '../components/Alerts';
import Button from '../components/Button';

type order = {
  id: string;
  date: string;
  status: string;
  total: number;
};

const OrdersScreen = () => {
  const [ordersList, setOrdersList] = useState<order[] | undefined>(undefined);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        /* const order = await UserService.getUserOrders();

        if (order.success) {
          if (order.data.length > 0) {
            setOrdersList(order.data);
          } else {
            setShowInfoAlert(true);
          }
        } */
        setOrdersList([
          {
            id: '#R353453',
            date: '43534543',
            status: 'Pagado',
            total: 12.45,
          },
          {
            id: '#R353453',
            date: '43534543',
            status: 'Pagado',
            total: 12.45,
          },
        ]);
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
      <Return onClose={() => router.push('/')} />
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
                      {order.date}
                    </PoppinsText>
                  </View>
                  <PoppinsText>${order.total}</PoppinsText>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Link href={`orders/${order.id}`}>Ver detalles</Link>
                    <Button
                      title="Re ordenar"
                      size="small"
                      style={{ marginLeft: 20, paddingVertical: 0 }}
                    />
                  </View>
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

export default OrdersScreen;
