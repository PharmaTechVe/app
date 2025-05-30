import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Button from '../components/Button';
import Alert from '../components/Alerts';
import { UserService } from '../services/user';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OrderDetailedResponse } from '@pharmatech/sdk';
import { truncateString } from '../utils/commons';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetailedResponse | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { addToCart, getItemQuantity, updateCartQuantity } = useCart();
  const router = useRouter();
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleReorder = () => {
    order?.details.forEach((detail) => {
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
    setShowSuccessAlert(true);
    router.push('/cart');
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await UserService.getOrder(id);

        if (order.success) {
          setOrder(order.data);

          setSubTotal(
            order.data.details.reduce(
              (acc, t) => acc + t.price * t.quantity,
              0,
            ),
          );
          setDiscount(
            order.data.details.reduce(
              (acc, t) => acc + ((t.price * t.discount) / 100) * t.quantity,
              0,
            ),
          );
          console.log(order);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage('Ocurrió un error');
        setShowErrorAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
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
        {showSuccessAlert && (
          <Alert
            type="success"
            title="Éxito"
            message="Pedido agregado al carrito"
            onClose={() => {
              setShowSuccessAlert(false);
            }}
            borderColor
          />
        )}
      </View>
      <View style={styles.orderHeader}>
        <PoppinsText style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}>
          Detalle del pedido
        </PoppinsText>
      </View>

      <View style={styles.orderInfo}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: Colors.gray_100,
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
        >
          <View>
            <PoppinsText>Número de pedido:</PoppinsText>
            <PoppinsText>
              #{order ? truncateString(order?.id, 8, '') : ''}
            </PoppinsText>
          </View>
          <Button
            title="Ver Tracking"
            size="small"
            style={{ paddingVertical: 0 }}
            onPress={() => router.push(`order/tracking/${order?.id}`)}
          />
        </View>
        <ScrollView style={{ height: 380 }}>
          {order?.details.map((detail, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', marginVertical: 10 }}
            >
              <View
                style={{
                  width: 100,
                  backgroundColor: Colors.gray_100,
                  marginRight: 5,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{
                    uri: detail.productPresentation.product.images[0].url,
                  }}
                  style={{ flex: 1 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PoppinsText>
                  {detail.productPresentation.product.name +
                    ' ' +
                    detail.productPresentation.presentation.name +
                    ' ' +
                    detail.productPresentation.presentation.quantity +
                    ' ' +
                    detail.productPresentation.presentation.measurementUnit}
                </PoppinsText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 10,
                  }}
                >
                  <PoppinsText>${formatPrice(detail.subtotal)}</PoppinsText>
                  <PoppinsText>Cantidad: {detail.quantity}</PoppinsText>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  {/* <StarIcon color={Colors.gray_100} /> */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push(
                        `products/${detail.productPresentation.product.id}/presentation/${detail.productPresentation.presentation.id}`,
                      )
                    }
                  >
                    <PoppinsText>Ir al producto</PoppinsText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: '#f1f5fd',
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>Subtotal</PoppinsText>
            <PoppinsText>${formatPrice(subTotal)}</PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText style={{ color: Colors.semanticSuccess }}>
              Descuentos
            </PoppinsText>
            <PoppinsText style={{ color: Colors.semanticSuccess }}>
              -${formatPrice(discount)}
            </PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {/* <PoppinsText>IVA</PoppinsText>
<PoppinsText>${order?.totalPrice}</PoppinsText> */}
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>Total</PoppinsText>
            <PoppinsText>${formatPrice(subTotal - discount)}</PoppinsText>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button title="Re Ordenar" onPress={handleReorder} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
    paddingTop: -20,
    paddingBottom: 0,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
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
  orderInfo: {
    marginBottom: 20,
  },
});

export default OrderDetailScreen;
