import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PaymentStatusMessage from '../components/PaymentStatusMessage';
import PaymentInfoForm from '../components/PaymentInfoForm';
import OrderSummary from '../components/OrderSummary';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { useLocalSearchParams } from 'expo-router';
import { UserService } from '../services/user';
import Steps from '../components/Steps';
import Button from '../components/Button';
import { truncateString } from '../utils/commons';
import {
  OrderStatus,
  OrderDetailedResponse,
  PharmaTech,
} from '@pharmatech/sdk';
import * as SecureStore from 'expo-secure-store';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '../lib/socketUrl';
import Popup from '../components/Popup';
import { OrderService } from '../services/order';

// --- SOCKET MANAGEMENT ---
let socket: Socket | null = null;

export const initializeSocket = async (): Promise<Socket> => {
  if (socket) return socket;

  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) {
    console.error('Token de autenticación no encontrado');
    throw new Error('Token de autenticación no encontrado');
  }

  console.log('Inicializando WebSocket con URL:', SOCKET_URL);
  console.log('Enviando token JWT:', token);

  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['polling'],
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  });

  socket.on('connect', () => {
    console.log('WebSocket conectado exitosamente');
  });

  socket.on('connect_error', (error) => {
    console.error('Error de conexión al WebSocket:', error);
  });

  socket.on('disconnect', (reason) => {
    console.warn('WebSocket desconectado. Razón:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Desconectando WebSocket');
    socket.disconnect();
    socket = null;
  }
};
// --- END SOCKET MANAGEMENT ---

const stepsLabels = [
  'Opciones de Compra',
  'Visualización de datos',
  'Confirmación de orden',
];

const InProgressOrderScreen = () => {
  const { orderNumber } = useLocalSearchParams();

  // Siempre inicia en step 3
  const [step, setStep] = useState(3);
  const [userName, setUserName] = useState<string | null>('Usuario');
  const [order, setOrder] = useState<OrderDetailedResponse | null>(null);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [paymentFormValid, setPaymentFormValid] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      const response = await UserService.getProfile();
      if (response.success && response.data) {
        setUserName(response.data.firstName);
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;
      try {
        const sdk = PharmaTech.getInstance();
        const jwt = await SecureStore.getItemAsync('auth_token');
        if (!jwt) {
          console.error('No JWT found in SecureStore');
          return;
        }
        const orderData = await sdk.order.getById(orderNumber as string, jwt);
        setOrder(orderData);

        // Solo cambia a step 2 si status es 'approved' y paymentMethod es BANK_TRANSFER o MOBILE_PAYMENT
        if (
          orderData &&
          orderData.status &&
          orderData.status.toLowerCase() === 'approved' &&
          orderData.paymentMethod &&
          ['BANK_TRANSFER', 'MOBILE_PAYMENT'].includes(
            orderData.paymentMethod.toUpperCase(),
          )
        ) {
          setStep(2);
          return; // Salir para evitar setStep(3) abajo
        }
        setStep(3);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  useEffect(() => {
    if (!orderNumber) return;
    let isMounted = true;
    let localSocket: Socket | null = null;

    (async () => {
      try {
        localSocket = await initializeSocket();

        localSocket.on('connect', () => {
          console.log('[WS] conectado');
          localSocket?.emit('joinOrder', orderNumber);
          localSocket?.emit('getOrder', orderNumber);
        });

        localSocket.on('order', (data: OrderDetailedResponse) => {
          if (!isMounted || data.id !== orderNumber) return;
          setOrder(data);
        });

        // Escuchar el evento orderUpdated para actualizar el estado de la orden
        localSocket.on(
          'orderUpdated',
          async (payload: { orderId: string; status: OrderStatus }) => {
            if (!isMounted || payload.orderId !== orderNumber) return;
            try {
              const onOrderUpdated = await OrderService.getById(payload.status);
              setOrder(onOrderUpdated);
            } catch (e) {
              console.error('Error refrescando orden:', e);
            }
          },
        );

        localSocket.connect();
      } catch (err) {
        console.error('Error inicializando socket:', err);
      }
    })();

    return () => {
      isMounted = false;
      if (localSocket) {
        localSocket.off('order');
        localSocket.off('orderUpdated');
      }
      disconnectSocket();
    };
  }, [orderNumber]);

  return (
    <>
      <ScrollView
        contentContainerStyle={
          step === 3
            ? { flexGrow: 1, justifyContent: 'flex-end' }
            : styles.scrollContainer
        }
      >
        <View
          style={[
            styles.container,
            step === 3 && { flex: 1, justifyContent: 'flex-end' },
          ]}
        >
          <View style={styles.steps}>
            <Steps
              totalSteps={stepsLabels.length}
              currentStep={step}
              labels={stepsLabels}
            />
          </View>
          {step === 1 && (
            <>
              <PoppinsText style={styles.purchaseOptionsTitle}>
                Opciones de Compra
              </PoppinsText>
            </>
          )}
          {/* Ocultar step 2 si el método de pago es CARD o CASH */}
          {step === 2 &&
            order &&
            order.paymentMethod &&
            !['CARD', 'CASH'].includes(order.paymentMethod.toUpperCase()) && (
              <>
                <PoppinsText style={styles.purchaseOptionsTitle}>
                  Visualización de datos
                </PoppinsText>
                <View style={styles.paymentInfoFormContainer}>
                  <PaymentInfoForm
                    paymentMethod={
                      order.paymentMethod
                        ? (order.paymentMethod.toUpperCase() as
                            | 'CARD'
                            | 'CASH'
                            | 'BANK_TRANSFER'
                            | 'MOBILE_PAYMENT'
                            | null)
                        : null
                    }
                    total={order.totalPrice ? String(order.totalPrice) : ''}
                    onValidationChange={setPaymentFormValid}
                    onBankChange={() => {}}
                    onReferenceChange={() => {}}
                    onDocumentNumberChange={() => {}}
                    onPhoneChange={() => {}}
                  />
                </View>
                <View style={styles.whiteBackgroundContainer}>
                  <OrderSummary />
                  <View style={styles.totalContainer}>
                    <View style={styles.totalRow}>
                      <PoppinsText style={styles.totalLabel}>
                        Total:
                      </PoppinsText>
                      <PoppinsText style={styles.totalAmount}>
                        ${order.totalPrice ? order.totalPrice : ''}
                      </PoppinsText>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Confirmar Orden"
                      size="medium"
                      style={styles.nextButton}
                      variant="primary"
                      onPress={() => {
                        if (!paymentFormValid) {
                          setShowValidationPopup(true);
                          return;
                        }
                        setStep(3);
                      }}
                    />
                  </View>
                </View>
              </>
            )}
          {step === 3 && order && (
            <>
              <PoppinsText style={styles.purchaseOptionsTitle}>
                Confirmacion de la orden
              </PoppinsText>
              <PaymentStatusMessage
                orderStatus={order.status as OrderStatus}
                orderNumber={truncateString(order.id as string, 8, '')}
                userName={userName || ''}
              />
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={styles.whiteBackgroundContainer}>
                  <OrderSummary />
                  <View style={styles.totalContainer}>
                    <View style={styles.totalRow}>
                      <PoppinsText style={styles.totalLabel}>
                        Total:
                      </PoppinsText>
                      <PoppinsText style={styles.totalAmount}>
                        ${order.totalPrice ? order.totalPrice : ''}
                      </PoppinsText>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <Popup
        visible={showValidationPopup}
        headerText="Campos requeridos"
        bodyText="Por favor completa y valida todos los campos requeridos antes de continuar."
        primaryButton={{
          text: 'Aceptar',
          onPress: () => setShowValidationPopup(false),
        }}
        onClose={() => setShowValidationPopup(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  steps: {
    marginTop: 30,
    padding: 20,
  },
  stepLabel: {
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  purchaseOptionsTitle: {
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    alignSelf: 'flex-start',
    padding: 20,
  },
  confirmationContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  nextButton: {
    color: Colors.primary,
    fontSize: FontSizes.h5.size,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
    height: 50,
    marginTop: 15,
    marginBottom: 16,
  },
  whiteBackgroundContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20,
  },
  paymentInfoFormContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  totalContainer: {
    width: '100%',
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  totalLabel: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
  },
  totalAmount: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.primary,
  },
});

export default InProgressOrderScreen;
