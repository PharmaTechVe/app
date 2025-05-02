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
import { StarIcon } from 'react-native-heroicons/solid';
import Alert from '../components/Alerts';
import { UserService } from '../services/user';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OrderDetailedResponse } from '@pharmatech/sdk';
import { truncateString } from '../utils/commons';

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetailedResponse | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await UserService.getOrder(id);

        if (order.success) {
          setOrder(order.data);
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
              {order ? truncateString(order?.id, 8) : ''}
            </PoppinsText>
          </View>
          <Button
            title="Re ordenar"
            size="small"
            style={{ paddingVertical: 0 }}
            onPress={() => setShowSuccessAlert(true)}
          />
        </View>
        <ScrollView style={{ height: 400 }}>
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
                  {detail.productPresentation.presentation.name}
                </PoppinsText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 10,
                  }}
                >
                  <PoppinsText>${detail.subtotal}</PoppinsText>
                  <PoppinsText>Cantidad: {detail.quantity}</PoppinsText>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  <StarIcon color={Colors.gray_100} />
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`products/${detail.productPresentation.id}`)
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
            <PoppinsText>${order?.totalPrice}</PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText style={{ color: Colors.semanticSuccess }}>
              Descuentos
            </PoppinsText>
            <PoppinsText style={{ color: Colors.semanticSuccess }}>
              -${order?.totalPrice}
            </PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>IVA</PoppinsText>
            <PoppinsText>${order?.totalPrice}</PoppinsText>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PoppinsText>Total</PoppinsText>
            <PoppinsText>${order?.totalPrice}</PoppinsText>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
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
    marginBottom: 20,
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

export default OrderDetailScreen;
