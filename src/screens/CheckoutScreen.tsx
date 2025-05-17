import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  BackHandler,
} from 'react-native';
import {
  ShoppingBagIcon,
  TruckIcon,
  ChevronLeftIcon,
} from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import RadioCard from '../components/RadioCard';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';
import Steps from '../components/Steps';
import PaymentMethods from '../components/PaymentMethods';
import PoppinsText from '../components/PoppinsText';
import LocationSelector from '../components/LocationSelector';
import PaymentInfoForm from '../components/PaymentInfoForm';
import Coupon from '../components/Coupon';
import PaymentStatusMessage from '../components/PaymentStatusMessage';
import { useRouter } from 'expo-router';
import { OrderService } from '../services/order';
import { UserService } from '../services/user';
import { OrderType, CreateOrder, CreateOrderDetail } from '../types/api.d';
import BranchMapModal from '../components/BranchMapModal';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { useFocusEffect } from '@react-navigation/native';
import Popup from '../components/Popup';
import EmailVerificationModal from './tab/EmailVerificationModal';
import { RootState, AppDispatch } from '../redux/store';
import {
  setStep,
  setOption,
  setPayment,
  setLocationId,
  setPaymentInfoValid,
  resetCheckout,
  setCouponDiscount,
  setCouponApplied,
} from '../redux/slices/checkoutSlice';
import {
  useOrderSocket,
  OrderStatus,
  Order as OrderSocketType,
} from '../hooks/useOrderSocket';

const CheckoutScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    step,
    option,
    payment,
    locationId,
    paymentInfoValid,
    couponDiscount,
    couponApplied,
  } = useSelector((state: RootState) => state.checkout);

  const router = useRouter();
  const { cartItems } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>('Usuario');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessages, setPopupMessages] = useState<string[]>([]);
  const [validationPopupVisible, setValidationPopupVisible] = useState(false);
  const [emailVerificationModalVisible, setEmailVerificationModalVisible] =
    useState(false); // Track modal visibility
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  // Suscribe al socket usando el hook; solo se conecta cuando orderNumber no es null
  useOrderSocket(orderNumber, (updatedOrder: OrderSocketType) => {
    setOrderStatus(updatedOrder.status);
  });

  useEffect(() => {
    const fetchUserName = async () => {
      const response = await UserService.getProfile();
      if (response.success && response.data) {
        const { firstName, isValidated } = response.data;
        setUserName(firstName);
        if (!isValidated) {
          setValidationPopupVisible(true);
        }
      } else if (!response.success) {
        console.error(
          'Error al obtener el nombre del usuario:',
          response.error,
        );
      }
    };

    fetchUserName();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (step === stepsLabels.length) {
          // Limpiar el carrito si el usuario está en el último paso
          dispatch(clearCart());
        }
        return false; // Permitir el comportamiento predeterminado del retroceso
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [step]),
  );

  const isSimplifiedSteps =
    (option === 'pickup' && payment === 'punto_de_venta') ||
    (option === 'delivery' && payment === 'efectivo');

  const stepsLabels = isSimplifiedSteps
    ? ['Opciones de Compra', 'Confirmación de orden']
    : ['Opciones de Compra', 'Visualización de datos', 'Confirmación de orden'];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  {
    /** const totalDiscount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity * 0.1),
    0,
  );*/
  }
  const subtotalAfterDiscount = subtotal; // - totalDiscount;
  const subtotalAfterCoupon = couponApplied
    ? subtotalAfterDiscount * (1 - couponDiscount / 100)
    : subtotalAfterDiscount;
  const total = subtotalAfterCoupon;

  const renderFooterMessage = () => {
    if (option === 'pickup' && payment === 'punto_de_venta') {
      return 'Por favor dirigirse a su sucursal más cercana y pagar en el sitio. La orden estará en proceso de pago hasta que pague en el sitio.';
    }
    if (option === 'delivery' && payment === 'efectivo') {
      return 'Debe pagar al personal del delivery la cantidad exacta de su pedido. La orden estará en proceso de pago hasta que pague en el sitio.';
    }
    return null;
  };

  const isValidUUID = (value: string | null): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return value !== null && uuidRegex.test(value);
  };

  const handleContinue = async () => {
    const missingFields: string[] = [];

    if (step < stepsLabels.length - 1) {
      // Validation for steps before the confirmation step
      if (step === 1) {
        if (!option) missingFields.push('Seleccionar una opción de compra.');
        if (!locationId)
          missingFields.push('Seleccionar una opción de locación.');
        if (!payment) missingFields.push('Seleccionar un método de pago.');
      } else if (step === 2 && !isSimplifiedSteps && !paymentInfoValid) {
        missingFields.push('Completar la información de pago.');
      }

      if (missingFields.length > 0) {
        setPopupMessages(missingFields);
        setPopupVisible(true);
        return;
      }

      dispatch(setStep(step + 1));
    } else if (step === stepsLabels.length - 1) {
      // Ensure payment form is valid before creating the order
      if (!isSimplifiedSteps && !paymentInfoValid) {
        setPopupMessages(['Completar la información de pago correctamente.']);
        setPopupVisible(true);
        return;
      }

      // Create the order on the penultimate step
      try {
        if (option === 'pickup' && !isValidUUID(locationId)) {
          setErrorMessage('La sucursal seleccionada no es válida.');
          setOrderStatus(null);
          return;
        }

        if (option === 'delivery' && !isValidUUID(locationId)) {
          setErrorMessage('La dirección seleccionada no es válida.');
          setOrderStatus(null);
          return;
        }

        if (!option) {
          setErrorMessage('Debe seleccionar una opción de compra.');
          setOrderStatus(null);
          return;
        }

        setErrorMessage(null);

        // Validar los productos del carrito
        const products: CreateOrderDetail[] = cartItems
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            productPresentationId: item.id,
            quantity: item.quantity, // Solo incluir los campos esperados
          }));

        if (products.length === 0) {
          setErrorMessage('No hay productos válidos en el carrito.');
          setOrderStatus(null);
          return;
        }

        // Log del carrito y los productos seleccionados
        console.log('Productos en el carrito:', cartItems);
        console.log('Productos seleccionados para la orden:', products);

        // Construir el payload de la orden
        const orderPayload: CreateOrder = {
          type: option === 'pickup' ? OrderType.PICKUP : OrderType.DELIVERY,
          branchId: option === 'pickup' ? locationId || undefined : undefined,
          userAddressId:
            option === 'delivery' ? locationId || undefined : undefined,
          products,
        };

        // Log del payload que se enviará al backend
        console.log('Payload enviado al backend:', orderPayload);

        // Enviar la orden al backend
        const orderResponse = await OrderService.create(orderPayload);

        // Log de la respuesta del backend
        console.log('Respuesta del backend:', orderResponse);

        // Validar la respuesta
        if (!orderResponse?.id) {
          setErrorMessage(
            'No pudimos procesar tu orden. Inténtalo nuevamente.',
          );

          setOrderStatus(null);
          return;
        }

        // Guardar el número de orden generado y el status inicial
        setOrderNumber(orderResponse.id);
        setOrderStatus(orderResponse.status);

        console.log('Orden creada exitosamente:', orderResponse);

        dispatch(setStep(step + 1)); // Move to the confirmation step
      } catch (error) {
        console.error('Error al procesar la orden:', error);
        setErrorMessage('Ocurrió un error inesperado. Inténtalo nuevamente.');

        setOrderStatus(null);
      }
    } else if (step === stepsLabels.length) {
      // Limpiar el carrito al salir del flujo de checkout
      dispatch(clearCart());
      dispatch(resetCheckout());
      router.dismissAll();
      router.replace({
        pathname: '/(tabs)',
      });
    }
  };

  const handleGoBack = () => {
    if (step === stepsLabels.length) {
      // Si estamos en el último paso, no permitir retroceder
      return;
    }

    if (step === 1) {
      router.back();
    } else if (step > 1) {
      dispatch(setStep(step - 1));
    }
  };

  //const handleOpenMapModal = () => {
  //if (selectedBranch) {
  //  setModalVisible(true); // Open the modal only if a branch is selected
  // } else {
  //  console.error('No branch selected to display on the map.');
  //}
  // };

  const renderConfirmationContent = (status: OrderStatus | null) => {
    if (status === 'approved' && option === 'pickup') {
      return <PoppinsText>Tu pedido está listo para recoger.</PoppinsText>;
    }
    if (status === 'approved' && option === 'delivery') {
      return <PoppinsText>Tu pedido está en camino.</PoppinsText>;
    }
    return null;
  };

  const handleApplyCoupon = (discountAmount: number) => {
    dispatch(setCouponDiscount(discountAmount));
    dispatch(setCouponApplied(true));
  };

  return (
    <>
      <Popup
        visible={validationPopupVisible}
        type="center"
        headerText="Validación Requerida"
        bodyText="Debe validar su usuario para continuar con el proceso de compra."
        primaryButton={{
          text: 'Validar Usuario',
          onPress: () => {
            setValidationPopupVisible(false);
            setEmailVerificationModalVisible(true);
          },
        }}
        onClose={() => {
          setValidationPopupVisible(false);
          router.replace({
            pathname: '/(tabs)',
          });
        }}
      />
      <EmailVerificationModal
        visible={emailVerificationModalVisible}
        onClose={() => setEmailVerificationModalVisible(false)} // Close the modal
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {step < stepsLabels.length && (
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <ChevronLeftIcon width={24} height={24} color={Colors.textMain} />
            </TouchableOpacity>
          )}

          <View style={styles.steps}>
            <Animated.View style={{ opacity: 1 }}>
              <Steps
                totalSteps={stepsLabels.length}
                currentStep={step}
                labels={stepsLabels}
              />
            </Animated.View>
          </View>

          {errorMessage && (
            <PoppinsText style={styles.errorMessage}>
              {errorMessage}
            </PoppinsText>
          )}

          {step === 1 && (
            <>
              <PoppinsText style={styles.purchaseOptionsTitle}>
                Opciones de Compra
              </PoppinsText>
              <View style={styles.radioContainer}>
                <View style={styles.radioItem}>
                  <RadioCard
                    label="Retiro en Sucursal"
                    icon={<ShoppingBagIcon color={Colors.textMain} />}
                    selected={option === 'pickup'}
                    onPress={() => {
                      dispatch(setOption('pickup'));
                      dispatch(setLocationId(null));
                    }}
                  />
                </View>
                <View>
                  <RadioCard
                    label="Delivery"
                    icon={<TruckIcon color={Colors.textMain} />}
                    selected={option === 'delivery'}
                    onPress={() => {
                      dispatch(setOption('delivery'));
                      dispatch(setLocationId(null));
                    }}
                  />
                </View>
              </View>
              <LocationSelector
                selectedOption={option || 'pickup'}
                onSelect={(val) => dispatch(setLocationId(val))}
                setSelectedBranch={setSelectedBranch}
              />
              {/*               <Button
                title="Ver Ubicación en el Mapa"
                size="small"
                style={styles.secondaryButton}
                variant="secondary"
                icon={<MapPinIcon width={16} height={16} color={Colors.textMain} />}
                onPress={handleOpenMapModal}
              /> */}

              <View style={styles.paymentMethods}>
                <PaymentMethods
                  selectedOption={option}
                  selectedPayment={payment}
                  setSelectedPayment={(val) => dispatch(setPayment(val))}
                />
              </View>
              {renderFooterMessage() && (
                <PoppinsText style={styles.footerMessage}>
                  {renderFooterMessage()}
                </PoppinsText>
              )}
            </>
          )}

          {step === 2 && !isSimplifiedSteps && (
            <>
              <PoppinsText
                style={[styles.purchaseOptionsTitle, styles.step2Title]}
              >
                Visualización de datos
              </PoppinsText>
              <View style={styles.paymentInfoFormContainer}>
                <PaymentInfoForm
                  paymentMethod={payment}
                  total={total.toFixed(2)}
                  onValidationChange={(isValid) =>
                    dispatch(setPaymentInfoValid(isValid))
                  }
                  onBankChange={(value) => console.log('Bank changed:', value)}
                  onReferenceChange={(value) =>
                    console.log('Reference changed:', value)
                  }
                  onDocumentNumberChange={(value) =>
                    console.log('Document number changed:', value)
                  }
                  onPhoneChange={(value) =>
                    console.log('Phone changed:', value)
                  }
                />
              </View>
            </>
          )}

          {step === stepsLabels.length && (
            <>
              <PoppinsText style={styles.purchaseOptionsTitle}>
                Confirmación de Orden
              </PoppinsText>
              {orderStatus ? (
                <PaymentStatusMessage
                  orderNumber={orderNumber ? orderNumber.split('-')[0] : 'N/A'}
                  userName={userName || 'Usuario'}
                  orderStatus={orderStatus as OrderStatus}
                />
              ) : null}
              <View style={styles.confirmationContainer}>
                {renderConfirmationContent(orderStatus as OrderStatus | null)}
              </View>
            </>
          )}

          <View style={styles.whiteBackgroundContainer}>
            {step !== 2 && step < stepsLabels.length && (
              <Coupon
                onApplyCoupon={handleApplyCoupon}
                onCouponApplied={() => dispatch(setCouponApplied(true))}
              />
            )}
            <OrderSummary />
            <View style={styles.totalContainer}>
              {couponApplied && (
                <>
                  <View style={styles.totalRow}>
                    <PoppinsText style={styles.descuentoLabel}>
                      Subtotal después del Cupón:
                    </PoppinsText>
                    <PoppinsText style={styles.descuentoAmount}>
                      ${subtotalAfterCoupon.toFixed(2)}
                    </PoppinsText>
                  </View>
                </>
              )}
              <View style={styles.totalRow}></View>
              <View style={styles.totalRow}>
                <PoppinsText style={styles.totalLabel}>Total:</PoppinsText>
                <PoppinsText style={styles.totalAmount}>
                  ${total.toFixed(2)}
                </PoppinsText>
              </View>
            </View>
            <Button
              title={
                step === 2 && !isSimplifiedSteps
                  ? 'Confirmar Pago'
                  : step < stepsLabels.length
                    ? 'Continuar'
                    : 'Volver al Home'
              }
              size="medium"
              style={styles.checkoutButton}
              variant={'primary'}
              onPress={handleContinue}
            />
          </View>
          <BranchMapModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            branchName={selectedBranch?.name || null}
            branchCoordinates={
              selectedBranch
                ? {
                    latitude: selectedBranch.latitude,
                    longitude: selectedBranch.longitude,
                  }
                : null
            }
          />
        </View>
      </ScrollView>
      <Popup
        visible={popupVisible}
        type="center"
        headerText="Datos Incompletos"
        bodyText={popupMessages
          .map((msg, index) => `${index + 1}. ${msg}`)
          .join('\n')}
        primaryButton={{
          text: 'Aceptar',
          onPress: () => setPopupVisible(false), // Close popup
        }}
        onClose={() => setPopupVisible(false)}
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 12,
    marginLeft: -12,
    marginTop: -8,
  },
  steps: {
    marginTop: 60,
  },
  purchaseOptionsTitle: {
    paddingVertical: 16,
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    marginBottom: 30,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  radioContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: -30,
  },
  radioItem: {
    marginBottom: 24,
  },
  paymentMethods: {
    paddingHorizontal: 20,
  },
  footerMessage: {
    fontSize: FontSizes.c1.size,
    color: Colors.textLowContrast,
    marginBottom: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  whiteBackgroundContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20,
    padding: 20,
  },
  spacer: {
    height: 20,
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
  descuentoLabel: {
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
  },
  descuentoAmount: {
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
  },
  totalAmount: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
  },
  strikethroughAmount: {
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textLowContrast,
    textDecorationLine: 'line-through',
  },
  checkoutButton: {
    marginBottom: 16,
    width: '100%',
    height: 50,
    marginTop: 15,
  },
  step2Title: {
    marginBottom: -20,
  },
  paymentInfoFormContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  confirmationContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  confirmationMessage: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
    textAlign: 'left',
    marginBottom: 10,
  },
  sucursalText: {
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.b2.lineHeight,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginBottom: 20,
  },
  secondaryButton: {
    marginBottom: 10,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primaryButton: {
    marginTop: 10,
    width: '100%',
  },
  errorMessage: {
    color: Colors.semanticDanger,
    fontSize: FontSizes.b2.size,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CheckoutScreen;
