import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  BackHandler,
  RefreshControl,
} from 'react-native';
import { ShoppingBagIcon, TruckIcon } from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import RadioCard from '../components/RadioCard';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';
import Steps from '../components/Steps';
import PaymentMethods from '../components/PaymentMethods';
import PoppinsText from '../components/PoppinsText';
import LocationSelector from '../components/LocationSelector';
import Coupon from '../components/Coupon';
import { useRouter } from 'expo-router';
import { OrderService } from '../services/order';
import BranchMapModal from '../components/BranchMapModal';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { useFocusEffect } from '@react-navigation/native';
import Popup from '../components/Popup';
import EmailVerificationModal from './tab/EmailVerificationModal';
import { RootState, AppDispatch } from '../redux/store';
import {
  setOption,
  setPayment,
  setLocationId,
  setCouponDiscount,
  setCouponApplied,
} from '../redux/slices/checkoutSlice';

import {
  OrderType,
  CreateOrder,
  CreateOrderDetail,
  PaymentMethod,
} from '@pharmatech/sdk';
import { formatPrice } from '../utils/formatPrice';

const CheckoutScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { step, option, payment, locationId, couponDiscount, couponApplied } =
    useSelector((state: RootState) => state.checkout);

  const router = useRouter();
  const { cartItems } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //const [userName, setUserName] = useState<string | null>('Usuario');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  // const [orderNumber, setOrderNumber] = useState<string | null>(null); // commented: unused
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessages, setPopupMessages] = useState<string[]>([]);
  const [validationPopupVisible, setValidationPopupVisible] = useState(false);
  const [emailVerificationModalVisible, setEmailVerificationModalVisible] =
    useState(false); // Track modal visibility
  // const [orderStatus, setOrderStatus] = useState<string | null>(null); // commented: unused
  // Suscribe al socket usando el hook; solo se conecta cuando orderNumber no es null

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

  // Solo mostrar el paso 1
  const stepsLabels = ['Opciones de Compra'];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Calcula el descuento total de los productos (igual que OrderSummary)
  const totalDiscount = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity * ((item.discount ?? 0) / 100),
    0,
  );

  // Subtotal después de descuentos de productos
  const subtotalAfterDiscount = subtotal - totalDiscount;

  // Aplica el cupón sobre el subtotal ya descontado
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

  // const isValidUUID = (value: string | null): boolean => {
  //   const uuidRegex =
  //     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  //   return value !== null && uuidRegex.test(value);
  // };

  const handleContinue = async () => {
    const missingFields: string[] = [];

    // Validación solo para el paso 1
    if (step === 1) {
      if (!option) missingFields.push('Seleccionar una opción de compra.');
      if (!locationId)
        missingFields.push('Seleccionar una opción de locación.');
      if (!payment) missingFields.push('Seleccionar un método de pago.');

      if (missingFields.length > 0) {
        setPopupMessages(missingFields);
        setPopupVisible(true);
        return;
      }

      // Validar los productos del carrito
      const products: CreateOrderDetail[] = cartItems
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          productPresentationId: item.id,
          quantity: item.quantity,
        }));

      setErrorMessage(null);

      let sdkPaymentMethod: PaymentMethod;
      switch (payment) {
        case 'efectivo':
          sdkPaymentMethod = PaymentMethod.CASH;
          break;
        case 'punto_de_venta':
          sdkPaymentMethod = PaymentMethod.CARD;
          break;
        case 'transferencia':
          sdkPaymentMethod = PaymentMethod.BANK_TRANSFER;
          break;
        case 'pago_movil':
          sdkPaymentMethod = PaymentMethod.MOBILE_PAYMENT;
          break;
        default:
          sdkPaymentMethod = PaymentMethod.CASH;
      }

      // Construir el payload de la orden usando el método seleccionado
      const orderPayload: CreateOrder = {
        type: option === 'pickup' ? OrderType.PICKUP : OrderType.DELIVERY,
        branchId: option === 'pickup' ? locationId || undefined : undefined,
        userAddressId:
          option === 'delivery' ? locationId || undefined : undefined,
        products,
        paymentMethod: sdkPaymentMethod,
        ...(couponApplied && {
          couponCode:
            typeof couponDiscount === 'number' && couponDiscount > 0
              ? 'COUPON'
              : undefined,
        }),
      };

      try {
        // Enviar la orden al backend
        const orderResponse = await OrderService.create(orderPayload);

        if (!orderResponse?.id) {
          setErrorMessage(
            'No pudimos procesar tu orden. Inténtalo nuevamente.',
          );
        }

        // Redirigir a la pantalla de orden en progreso (step 2 y 3)
        router.push({
          pathname: '/in-progress-order',
          params: {
            orderNumber: orderResponse.id,
          },
        });
      } catch (error) {
        console.error('Error al procesar la orden:', error);
        setErrorMessage('Ocurrió un error inesperado. Inténtalo nuevamente.');
      }
      return;
    }
  };

  //const handleOpenMapModal = () => {
  //if (selectedBranch) {
  //  setModalVisible(true); // Open the modal only if a branch is selected
  // } else {
  //  console.error('No branch selected to display on the map.');
  //}
  // };

  // const renderConfirmationContent = (status: OrderStatus | null) => {
  //   if (status === 'approved' && option === 'pickup') {
  //     return <PoppinsText>Tu pedido está listo para recoger.</PoppinsText>;
  //   }
  //   if (status === 'approved' && option === 'delivery') {
  //     return <PoppinsText>Tu pedido está en camino.</PoppinsText>;
  //   }
  //   return null;
  // };

  const handleApplyCoupon = (discountAmount: number) => {
    dispatch(setCouponDiscount(discountAmount));
    dispatch(setCouponApplied(true));
  };

  const [refreshing, setRefreshing] = useState(false); // <-- Agregado

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Aquí puedes recargar datos del carrito, usuario, etc.
    // Simulación de recarga:
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          {/* Solo mostrar el step 1 */}
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
          {/* Solo el paso 1 */}
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
          <View style={styles.whiteBackgroundContainer}>
            <Coupon
              onApplyCoupon={handleApplyCoupon}
              onCouponApplied={() => dispatch(setCouponApplied(true))}
            />
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
                  ${formatPrice(total)}
                </PoppinsText>
              </View>
            </View>
            <Button
              title="Realizar Pago"
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
