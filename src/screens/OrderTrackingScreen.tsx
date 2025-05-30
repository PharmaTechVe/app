import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useLocalSearchParams } from 'expo-router';
import Alert from '../components/Alerts';
import {
  OrderDeliveryDetailedResponse,
  OrderDetailedResponse,
  OrderStatus,
} from '@pharmatech/sdk';
import { UserService } from '../services/user';
import { formatDate, truncateString } from '../utils/commons';
import {
  CubeIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';
import VerticalStepper from '../components/VerticalStepper';
import { DeliveryService } from '../services/delivery';
import Button from '../components/Button';
import DeliveryMap from '../components/DeliveryMap';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  initializeSocket,
  disconnectSocket,
} from '../lib/deliverySocket/deliverySocket';
import { Socket } from 'socket.io-client';

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
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  // Estado para la ubicación del repartidor
  const [deliveryLocation, setDeliveryLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
      console.error('Error al obtener la orden:', error);
      setErrorMessage('Ocurrió un error');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let socket: Socket;

    const setupSocket = async () => {
      try {
        socket = await initializeSocket();
        socket.connect();

        socket.on('connect', () => {
          console.log('WebSocket conectado en OrderTrackingScreen');
        });

        socket.on(
          'coordinatesUpdated',
          (data: { latitude: number; longitude: number }) => {
            setDeliveryLocation({
              latitude: data.latitude,
              longitude: data.longitude,
            });
          },
        );

        socket.on('connect_error', (error) => {
          console.error(
            'Error de conexión al WebSocket en OrderTrackingScreen:',
            error,
          );
        });

        socket.on('disconnect', (reason) => {
          console.warn(
            'WebSocket desconectado en OrderTrackingScreen. Razón:',
            reason,
          );
        });
      } catch (error) {
        console.error(
          'Error configurando el WebSocket en OrderTrackingScreen:',
          error,
        );
      }
    };

    setupSocket();

    return () => {
      if (socket) {
        socket.off('coordinatesUpdated');
        disconnectSocket();
      }
    };
  }, [id]);
  // --- FIN INTEGRACIÓN WEBSOCKET ---

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

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
          {/* Botón para abrir el mapa ampliado */}
          {order?.type !== 'pickup' && (
            <Button
              title="Ver mapa ampliado"
              onPress={() => setIsMapModalVisible(true)}
              variant={'primary'}
              style={{ marginBottom: 12 }}
            />
          )}
          {/* Modal para el mapa ampliado */}
          <Modal
            visible={isMapModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsMapModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  backgroundColor: Colors.textWhite,
                  padding: 8,
                  borderRadius: 16,
                }}
                onPress={() => setIsMapModalVisible(false)}
              >
                <XMarkIcon size={24} color={Colors.textMain} />
              </TouchableOpacity>
              <DeliveryMap
                deliveryState={deliveryState}
                branchLocation={
                  order?.branch as { latitude: number; longitude: number }
                }
                customerLocation={
                  delivery?.address as { latitude: number; longitude: number }
                }
                deliveryLocation={deliveryLocation}
                style={{ flex: 1 }}
              />
            </View>
          </Modal>
          {/* Información de contacto y otros datos... */}
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
      <View style={styles.height} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
  },
  height: {
    height: 64,
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
