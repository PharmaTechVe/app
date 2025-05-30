import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useLocalSearchParams } from 'expo-router';
import Alert from '../components/Alerts';
import {
  OrderDeliveryDetailedResponse,
  OrderDeliveryStatus,
  OrderDetailedResponse,
  OrderStatus,
} from '@pharmatech/sdk';
import { UserService } from '../services/user';
import { formatDate, truncateString } from '../utils/commons';
import * as SecureStore from 'expo-secure-store';
import {
  CubeIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
} from 'react-native-heroicons/solid';
import io from 'socket.io-client';
import { SOCKET_URL } from '../lib/socketUrl';
import VerticalStepper from '../components/VerticalStepper';
import { DeliveryService } from '../services/delivery';
import Button from '../components/Button';
import DeliveryMap from '../components/DeliveryMap';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const OrderTrackingScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetailedResponse | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState('');
  const [delivery, setDelivery] = useState<
    OrderDeliveryDetailedResponse | undefined
  >();
  const [showMap, setShowMap] = useState(false);

  const deliveryState = useSelector(
    (state: RootState) => state.delivery.deliveryState[id as string] || 0,
  );

  const changeTrackingStatus = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.REQUESTED:
      case OrderStatus.CANCELED:
        setStep(0);
        break;
      case OrderStatus.APPROVED:
        setStep(1);
        break;
      case OrderStatus.IN_PROGRESS:
      case OrderStatus.READY_FOR_PICKUP:
        setStep(2);
        break;
      case OrderStatus.COMPLETED:
        setStep(3);
        break;
      default:
        setStep(0);
        break;
    }
  };

  const fetchOrder = async () => {
    try {
      const order = await UserService.getOrder(id);
      console.log(order);
      if (order.success) {
        if (
          order.data.orderDeliveries &&
          order.data.orderDeliveries.length > 0
        ) {
          const delivery = await DeliveryService.getOrderDetails(
            order.data.orderDeliveries[0].id,
          );
          setDelivery(delivery);
          setUserAddress(
            delivery.address.adress + '. \n' + delivery.address.referencePoint,
          );
        }
        setOrder(order.data);
        changeTrackingStatus(order.data.status);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Ocurrió un error');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();

      const socket = io(SOCKET_URL, {
        autoConnect: false,
        transports: ['polling'],
        transportOptions: {
          polling: {
            extraHeaders: {
              authorization: `Bearer ${SecureStore.getItemAsync('auth_token')}`,
            },
          },
        },
      });

      function onOrderUpdated(order: { orderId: string; status: OrderStatus }) {
        if (order.orderId === id) {
          changeTrackingStatus(order.status);
        }
      }

      socket.connect();
      socket.on('orderUpdated', onOrderUpdated);

      socket.on('connect_error', (err) =>
        console.log('[WS] Error en handshake:', err.message),
      );

      socket.on('connect', () =>
        console.log('[WS] Conectado con ID:', socket.id),
      );
      socket.on('disconnect', (reason) =>
        console.log('[WS] Desconectado por:', reason),
      );

      return () => {
        socket.off('orderUpdated', onOrderUpdated);
        socket.disconnect();
      };
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
  };

  const dateFormat: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const steps = [
    {
      title: 'Orden Confirmada',
      description: order?.orderDeliveries
        ? new Date(order?.updatedAt).toLocaleString('es-ES', dateFormat)
        : '',
    },
    {
      title:
        order?.type === 'delivery' ? 'Repartidor en camino' : 'En preparación',
      description: order?.orderDeliveries
        ? new Date(order?.updatedAt).toLocaleString('es-ES', dateFormat)
        : '',
    },
    {
      title:
        order?.type === 'delivery' ? 'Pedido entregado' : 'Listo para recoger',
      description: order?.orderDeliveries
        ? new Date(order?.updatedAt).toLocaleString('es-ES', dateFormat)
        : '',
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
        />
      }
    >
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
        <PoppinsText style={{ fontSize: FontSizes.s1.size }}>
          Seguimiento del Pedido
        </PoppinsText>
      </View>
      {order && order.orderDeliveries && (
        <View style={styles.orderInfo}>
          <View>
            <PoppinsText weight="medium">
              Orden ID: #{truncateString(order?.id, 8, '')}
            </PoppinsText>
            <PoppinsText>
              Fecha del pedido: {formatDate(order?.createdAt)}
            </PoppinsText>
          </View>
          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              paddingVertical: 5,
            }}
          >
            {order?.type === 'delivery' ? (
              <>
                <TruckIcon color={Colors.semanticSuccess} />
                <PoppinsText style={{ color: Colors.semanticSuccess }}>
                  Entrega estimada:{' '}
                  {new Date(
                    order?.orderDeliveries[0]?.estimatedTime,
                  ).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </PoppinsText>
              </>
            ) : (
              <>
                <CubeIcon color={Colors.semanticSuccess} />
                <PoppinsText style={{ color: Colors.semanticSuccess }}>
                  Pickup:{' '}
                  {new Date(order?.updatedAt).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </PoppinsText>
              </>
            )}
          </View>
          <View style={{ marginVertical: 10 }}>
            <VerticalStepper steps={steps} currentStep={step} />
          </View>
          {order?.type != 'pickup' &&
            !showMap &&
            order.status === OrderStatus.READY_FOR_PICKUP &&
            order.orderDeliveries[0].deliveryStatus ===
              OrderDeliveryStatus.ASSIGNED && (
              <View style={{ marginVertical: 15 }}>
                <Button
                  title="Ver Mapa"
                  onPress={() => setShowMap(true)}
                  variant={'primary'}
                />
              </View>
            )}
          {showMap && (
            <View style={{ flex: 1, height: 300 }}>
              <DeliveryMap
                deliveryState={deliveryState}
                branchLocation={
                  order?.branch as { latitude: number; longitude: number }
                }
                customerLocation={
                  delivery?.address as { latitude: number; longitude: number }
                }
                deliveryLocation={null}
                style={{ height: 300, marginBottom: 16 }}
              />
            </View>
          )}
          <View>
            <View
              style={{
                backgroundColor: Colors.textWhite,
                borderWidth: 1,
                borderColor: Colors.gray_100,
                borderRadius: 5,
              }}
            >
              {order?.type === 'pickup' ? (
                <View style={{ flexDirection: 'row', padding: 20 }}>
                  <View style={{ marginRight: 10 }}>
                    <BuildingStorefrontIcon color={Colors.primary} />
                  </View>
                  <View>
                    <PoppinsText>Dirección de Sucursal:</PoppinsText>
                    <PoppinsText style={{ marginVertical: 10 }}>
                      {order?.branch?.name}
                    </PoppinsText>
                    <PoppinsText>{order?.branch?.address}.</PoppinsText>
                    <PoppinsText>{order?.branch?.city.name}</PoppinsText>
                  </View>
                </View>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', padding: 20 }}>
                    <View style={{ marginRight: 10 }}>
                      <MapPinIcon color={Colors.primary} />
                    </View>
                    <View style={{ padding: 1 }}>
                      <PoppinsText style={{ marginBottom: 10 }}>
                        Dirección de Entrega:
                      </PoppinsText>
                      <PoppinsText>{userAddress}</PoppinsText>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: Colors.gray_100,
                      padding: 20,
                    }}
                  >
                    <View style={{ marginRight: 10 }}>
                      <UserIcon color={Colors.primary} />
                    </View>
                    <View>
                      <PoppinsText style={{ marginBottom: 10 }}>
                        Nombre del Repartidor:
                      </PoppinsText>
                      <PoppinsText>
                        {order?.orderDeliveries[0].employee?.firstName}{' '}
                        {order?.orderDeliveries[0].employee?.lastName}
                      </PoppinsText>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', padding: 20 }}>
                    <View style={{ marginRight: 10 }}>
                      <PhoneIcon color={Colors.primary} />
                    </View>
                    <View>
                      <PoppinsText style={{ marginBottom: 10 }}>
                        Teléfono de Contacto:
                      </PoppinsText>
                      <PoppinsText>
                        {order?.orderDeliveries[0].employee?.phoneNumber}
                      </PoppinsText>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      )}
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

export default OrderTrackingScreen;
