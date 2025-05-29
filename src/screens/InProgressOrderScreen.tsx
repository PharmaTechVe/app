import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
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
  PaymentConfirmation,
} from '@pharmatech/sdk';
import * as SecureStore from 'expo-secure-store';
import Popup from '../components/Popup';
import {
  initializeSocket,
  disconnectSocket,
} from '../lib/deliverySocket/deliverySocket';
import { Socket } from 'socket.io-client';
import Alert from '../components/Alerts';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { resetCheckout } from '../redux/slices/checkoutSlice';

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
  const [bank, setBank] = useState('');
  const [reference, setReference] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [backendResponse, setBackendResponse] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Extrae la lógica de obtención de la orden
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
        return;
      }
      setStep(3);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
    fetchOrder();
  }, [orderNumber]);

  // 1) socket-only: actualiza order.status
  useEffect(() => {
    let socket: Socket;
    const setupSocket = async () => {
      socket = await initializeSocket();
      socket.connect();
      socket.on('orderUpdated', (data: { orderId: string; status: string }) => {
        console.log('[Socket] orderUpdated received →', data);
        if (orderNumber && data.orderId === orderNumber) {
          setOrder((prev) =>
            prev ? { ...prev, status: data.status as OrderStatus } : prev,
          );
          setIsSubmittingPayment(false); // <-- Oculta el loader cuando llega el update
        }
      });
    };
    setupSocket();
    return () => {
      socket?.off('orderUpdated');
      disconnectSocket();
    };
  }, []); // solo al montar

  // 2) efecto separado: cada vez que 'order' cambia, recalcula el step
  useEffect(() => {
    if (!order) return;
    const normalized = order.status.toLowerCase();
    const pm = order.paymentMethod?.toLowerCase();
    if (
      normalized === 'approved' &&
      (pm === 'bank_transfer' || pm === 'mobile_payment')
    ) {
      setStep(2);
    } else {
      setStep(3);
    }
  }, [order]);

  const handleContinue = () => {
    // Limpiar el carrito al salir del flujo de checkout
    dispatch(clearCart());
    dispatch(resetCheckout());
    router.dismissAll();
    router.replace({
      pathname: '/(tabs)',
    });
  };

  // Handler para pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
  };

  return (
    <>
      {/* Alerta para mostrar la respuesta del backend */}
      {backendResponse && (
        <Alert
          title="Respuesta"
          message={backendResponse}
          type={
            backendResponse.includes('error') ||
            backendResponse.includes('Error')
              ? 'error'
              : 'success'
          }
          alertStyle="regular"
          borderColor={true}
          onClose={() => setBackendResponse(null)}
        />
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        <View style={styles.container}>
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
                  {isSubmittingPayment ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="large" color={Colors.primary} />
                      <PoppinsText style={{ marginTop: 16 }}>
                        Procesando pago...
                      </PoppinsText>
                    </View>
                  ) : (
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
                      onBankChange={setBank}
                      onReferenceChange={setReference}
                      onDocumentNumberChange={setDocumentNumber}
                      onPhoneChange={setPhoneNumber}
                    />
                  )}
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
                      onPress={async () => {
                        if (!paymentFormValid) {
                          setShowValidationPopup(true);
                          return;
                        }
                        setIsSubmittingPayment(true); // <-- Muestra loader
                        try {
                          const sdk = PharmaTech.getInstance();
                          const jwt =
                            await SecureStore.getItemAsync('auth_token');
                          if (!jwt) {
                            setBackendResponse('No JWT found en SecureStore');
                            setIsSubmittingPayment(false);
                            return;
                          }
                          const paymentConfirmation: PaymentConfirmation = {
                            bank,
                            reference,
                            documentId: documentNumber,
                            phoneNumber,
                            orderId: order.id,
                          };
                          const response = await sdk.paymentConfirmation.create(
                            paymentConfirmation,
                            jwt,
                          );
                          setBackendResponse(
                            response && response.id
                              ? '¡Pago enviado correctamente!'
                              : 'Respuesta recibida del servidor.',
                          );
                          // NO cambies el step aquí, espera al socket
                        } catch (error: unknown) {
                          let errorMessage =
                            'Error enviando confirmación de pago. Intenta nuevamente.';
                          function hasMessage(
                            e: unknown,
                          ): e is { message: string } {
                            return (
                              typeof e === 'object' &&
                              e !== null &&
                              'message' in e &&
                              typeof (e as { message?: unknown }).message ===
                                'string'
                            );
                          }
                          if (hasMessage(error)) {
                            errorMessage = error.message;
                          }
                          setBackendResponse(errorMessage);
                          setIsSubmittingPayment(false); // Oculta loader si hay error
                        }
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
              {/* Botón Volver al Home en un View con padding 20 */}
              <View style={{ padding: 20 }}>
                <Button
                  title="Volver al Home"
                  size="medium"
                  style={[styles.checkoutButton]}
                  variant="secondaryLight"
                  textStyle={{ color: Colors.textMain }}
                  onPress={handleContinue}
                />
              </View>
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
    justifyContent: 'flex-start', // Fuerza el contenido arriba SIEMPRE
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  steps: {
    marginTop: 30,
    padding: 20,
    // No uses flex ni justifyContent aquí
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
  checkoutButton: {
    marginTop: 24,
    width: '100%',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});

export default InProgressOrderScreen;
