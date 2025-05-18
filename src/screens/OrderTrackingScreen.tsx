import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useLocalSearchParams } from 'expo-router';
import Alert from '../components/Alerts';
import { OrderDetailedResponse } from '@pharmatech/sdk';
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
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../lib/socketUrl';

const OrderTrackingScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetailedResponse | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

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

    if (id) {
      fetchOrder();

      const socket = io(SOCKET_URL, {
        transportOptions: {
          polling: {
            extraHeaders: {
              authorization: `Bearer ${SecureStore.getItemAsync('auth_token')}`,
            },
          },
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      function onConnect() {
        setIsConnected(true);
        console.log('[WS] Conectado con ID:', socket.id);
        console.log('Connected to socket: ', isConnected);
        setTransport(socket.io.engine.transport.name);

        socket.on('order', (order) => {
          console.log(order);
        });
      }

      function onDisconnect() {
        setIsConnected(false);
        console.log(transport);
        setTransport('N/A');
      }

      socket.on('connect_error', (err) =>
        console.log('[WS] Error en handshake:', err.message),
      );

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      return () => {
        //socket.off('connect', onConnect);
        //socket.off('disconnect', onDisconnect);
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
                    order?.orderDeliveries[0].estimatedTime,
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
                  {new Date(
                    order?.orderDeliveries[0].estimatedTime,
                  ).toLocaleString('es-ES', {
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
          <View style={{ marginVertical: 20 }}>
            <View>
              <PoppinsText>Orden Confirmada</PoppinsText>
              <PoppinsText
                style={{
                  color: Colors.secondaryGray,
                  fontSize: FontSizes.c3.size,
                }}
              >
                {new Date(order.orderDeliveries[0].createdAt).toLocaleString(
                  'es-ES',
                  {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  },
                )}
              </PoppinsText>
            </View>
            <View style={{ marginVertical: 15 }}>
              <PoppinsText>
                {order.type === 'delivery'
                  ? 'Repartidor en camino'
                  : 'En preparación'}
              </PoppinsText>
              <PoppinsText
                style={{
                  color: Colors.secondaryGray,
                  fontSize: FontSizes.c3.size,
                }}
              >
                {new Date(order.orderDeliveries[0].createdAt).toLocaleString(
                  'es-ES',
                  {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  },
                )}
              </PoppinsText>
            </View>
            <View>
              <PoppinsText>
                {order.type === 'delivery'
                  ? 'Pedido entregado'
                  : 'Listo para recoger'}
              </PoppinsText>
              <PoppinsText
                style={{
                  color: Colors.secondaryGray,
                  fontSize: FontSizes.c3.size,
                }}
              >
                {new Date(order.orderDeliveries[0].createdAt).toLocaleString(
                  'es-ES',
                  {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  },
                )}
              </PoppinsText>
            </View>
          </View>
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
                    <View>
                      <PoppinsText style={{ marginBottom: 10 }}>
                        Dirección de Entrega:
                      </PoppinsText>
                      <PoppinsText>{order?.branch?.address}.</PoppinsText>
                      <PoppinsText>{order?.branch?.city.name}</PoppinsText>
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
                        {'+' + order?.orderDeliveries[0].employee?.phoneNumber}
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

export default OrderTrackingScreen;
