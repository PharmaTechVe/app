import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useRouter } from 'expo-router';
import Alert from '../components/Alerts';
import Button from '../components/Button';
import { OrderResponse } from '@pharmatech/sdk';
import { UserService } from '../services/user';
import { truncateString } from '../utils/commons';
import OrderBadge from '../components/OrderBadge';
import { useCart } from '../hooks/useCart';

const OrdersScreen = () => {
  const [ordersList, setOrdersList] = useState<OrderResponse[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { addToCart, getItemQuantity, updateCartQuantity } = useCart();
  const router = useRouter();

  const handleReorder = async (id: string) => {
    const orderData = await UserService.getOrder(id);

    if (orderData.success) {
      orderData.data.details.forEach((detail) => {
        const existingQuantity = getItemQuantity(detail.productPresentation.id);
        if (existingQuantity > 0) {
          updateCartQuantity(
            detail.productPresentation.id,
            existingQuantity + detail.quantity,
          );
        } else {
          addToCart({
            id: detail.productPresentation.id,
            quantity: detail.quantity,
            price: detail.subtotal,
            name: detail.productPresentation.product.name,
            image: detail.productPresentation.product.images[0].url,
          });
        }
      });
      router.push('/cart');
    }
    setShowSuccessAlert(true);
  };

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
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
        {showSuccessAlert && (
          <Alert
            type="success"
            title="Éxito"
            message="Pedido agregado al carrito"
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
                    <PoppinsText>
                      #{order ? truncateString(order?.id, 8) : ''}
                    </PoppinsText>
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
                  <OrderBadge status={order.status} />
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
                    onPress={() => handleReorder(order.id)}
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
    left: '56%',
    marginLeft: -162,
    top: 40,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
});

export default OrdersScreen;
