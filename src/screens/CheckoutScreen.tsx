import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  ShoppingBagIcon,
  TruckIcon,
  MapPinIcon,
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
import { OrderType } from '../types/api.d';

const CheckoutScreen = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const [selectedOption, setSelectedOption] = useState<
    'pickup' | 'delivery' | null
  >('pickup');
  const [selectedPayment, setSelectedPayment] = useState<
    'punto_de_venta' | 'efectivo' | 'transferencia' | 'pago_movil' | null
  >(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<'approved' | 'rejected'>('approved');
  const [isPaymentInfoValid, setIsPaymentInfoValid] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSimplifiedSteps =
    (selectedOption === 'pickup' && selectedPayment === 'punto_de_venta') ||
    (selectedOption === 'delivery' && selectedPayment === 'efectivo');

  const stepsLabels = isSimplifiedSteps
    ? ['Opciones de Compra', 'Confirmación de orden']
    : ['Opciones de Compra', 'Visualización de datos', 'Confirmación de orden'];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity * 0.1),
    0,
  );
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const subtotalAfterCoupon = isCouponApplied
    ? subtotalAfterDiscount - couponDiscount
    : subtotalAfterDiscount;
  const iva = subtotalAfterCoupon * 0.16;
  const total = subtotalAfterCoupon + iva;

  const renderFooterMessage = () => {
    if (selectedOption === 'pickup' && selectedPayment === 'punto_de_venta') {
      return 'Por favor dirigirse a su sucursal más cercana y pagar en el sitio. La orden estará en proceso de pago hasta que pague en el sitio.';
    }
    if (selectedOption === 'delivery' && selectedPayment === 'efectivo') {
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
    if (currentStep < stepsLabels.length) {
      if (currentStep === stepsLabels.length - 1) {
        try {
          if (selectedOption === 'pickup' && !isValidUUID(selectedLocation)) {
            setErrorMessage('La sucursal seleccionada no es válida.');
            setStatus('rejected');
            setCurrentStep(stepsLabels.length);
            return;
          }

          if (!selectedOption) {
            setErrorMessage('Debe seleccionar una opción de compra.');
            setStatus('rejected');
            setCurrentStep(stepsLabels.length);
            return;
          }

          setErrorMessage(null);

          const orderPayload = {
            type:
              selectedOption === 'pickup'
                ? OrderType.PICKUP
                : OrderType.DELIVERY,
            branchId:
              selectedOption === 'pickup'
                ? selectedLocation || undefined
                : undefined,
            userAddressId:
              selectedOption === 'delivery'
                ? selectedLocation || undefined
                : undefined,
            products: cartItems.map((item) => ({
              productPresentationId: item.id,
              quantity: Math.max(1, item.quantity),
            })),
          };

          const orderResponse = await OrderService.create(orderPayload);

          if (!orderResponse.success || !orderResponse.data?.id) {
            setErrorMessage(
              'No pudimos procesar tu orden. Inténtalo nuevamente.',
            );
            setStatus('rejected');
            setCurrentStep(stepsLabels.length);
            return;
          }

          setStatus('approved');
          setCurrentStep(stepsLabels.length);
        } catch {
          setErrorMessage('Ocurrió un error inesperado. Inténtalo nuevamente.');
          setStatus('rejected');
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleGoBack = () => {
    if (currentStep === 1) {
      router.back();
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoToHome = () => {
    router.replace({
      pathname: '/(tabs)',
    });
  };

  const isStep1Complete =
    selectedOption !== null &&
    selectedPayment !== null &&
    selectedLocation !== null;
  const isStep2Complete =
    isSimplifiedSteps || (selectedPayment !== null && isPaymentInfoValid);

  const isButtonEnabled =
    currentStep === 1
      ? isStep1Complete
      : currentStep === 2
        ? isStep2Complete
        : true;

  const renderConfirmationContent = (status: 'approved' | 'rejected') => {
    if (selectedOption === 'pickup' && status === 'approved') {
      return (
        <>
          <PoppinsText style={styles.confirmationMessage}>
            Tu pedido ya está listo para que pases por él en la sucursal
            indicada. En el mapa adjunto podrás ver la ubicación exacta para que
            llegues sin problemas.
          </PoppinsText>
          <PoppinsText style={styles.sucursalText}>
            Sucursal de retiro: [Nombre de la sucursal]
          </PoppinsText>
          <Button
            title="Ver Ubicación en el Mapa"
            size="small"
            style={styles.secondaryButton}
            variant="secondary"
            icon={<MapPinIcon width={16} height={16} color={Colors.textMain} />}
            onPress={() => console.log('Ver ubicación en el mapa')}
          />
        </>
      );
    }

    if (selectedOption === 'delivery' && status === 'approved') {
      return (
        <>
          <PoppinsText style={styles.confirmationMessage}>
            Estamos preparando tu pedido para enviarlo a la dirección indicada.
          </PoppinsText>
          <PoppinsText style={styles.confirmationMessage}>
            Recibirás notificaciones cuando tu pedido esté en camino. En breve,
            un motorizado tomará tu orden.
          </PoppinsText>
          <Button
            title="Información del repartidor"
            size="small"
            style={styles.secondaryButton}
            variant="secondary"
            onPress={() => console.log('Información del repartidor')}
          />
        </>
      );
    }

    if (status === 'rejected') {
      return (
        <>
          <PoppinsText style={styles.confirmationMessage}>
            Lamentamos informarte que hubo un problema al generar tu pedido.
          </PoppinsText>
          <Button
            title="Volver a Intentar"
            size="medium"
            style={styles.primaryButton}
            variant="primary"
            onPress={() => console.log('Volver a Intentar')}
          />
        </>
      );
    }

    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ChevronLeftIcon width={24} height={24} color={Colors.textMain} />
        </TouchableOpacity>

        <View style={styles.steps}>
          <Steps
            totalSteps={stepsLabels.length}
            currentStep={currentStep}
            labels={stepsLabels}
          />
        </View>

        {errorMessage && (
          <PoppinsText style={styles.errorMessage}>{errorMessage}</PoppinsText>
        )}

        {currentStep === 1 && (
          <>
            <PoppinsText style={styles.purchaseOptionsTitle}>
              Opciones de Compra
            </PoppinsText>
            <View style={styles.radioContainer}>
              <View style={styles.radioItem}>
                <RadioCard
                  label="Retiro en Sucursal"
                  icon={<ShoppingBagIcon color={Colors.textMain} />}
                  selected={selectedOption === 'pickup'}
                  onPress={() => {
                    setSelectedOption('pickup');
                    setSelectedLocation(null);
                  }}
                />
              </View>
              <View>
                <RadioCard
                  label="Delivery"
                  icon={<TruckIcon color={Colors.textMain} />}
                  selected={selectedOption === 'delivery'}
                  onPress={() => {
                    setSelectedOption('delivery');
                    setSelectedLocation(null);
                  }}
                />
              </View>
            </View>
            <LocationSelector
              selectedOption={selectedOption}
              onSelect={(val) => setSelectedLocation(val)}
            />
            <View style={styles.paymentMethods}>
              <PaymentMethods
                selectedOption={selectedOption}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
              />
            </View>
            {renderFooterMessage() && (
              <PoppinsText style={styles.footerMessage}>
                {renderFooterMessage()}
              </PoppinsText>
            )}
          </>
        )}

        {currentStep === 2 && !isSimplifiedSteps && (
          <>
            <PoppinsText
              style={[styles.purchaseOptionsTitle, styles.step2Title]}
            >
              Visualización de datos
            </PoppinsText>
            <View style={styles.paymentInfoFormContainer}>
              <PaymentInfoForm
                paymentMethod={selectedPayment}
                total={total.toFixed(2)}
                onValidationChange={setIsPaymentInfoValid}
                onBankChange={(value) => console.log('Bank changed:', value)}
                onReferenceChange={(value) =>
                  console.log('Reference changed:', value)
                }
                onDocumentNumberChange={(value) =>
                  console.log('Document number changed:', value)
                }
                onPhoneChange={(value) => console.log('Phone changed:', value)}
              />
            </View>
          </>
        )}

        {currentStep === stepsLabels.length && (
          <>
            <PoppinsText style={styles.purchaseOptionsTitle}>
              Confirmación de Orden
            </PoppinsText>
            <PaymentStatusMessage
              status={status}
              orderNumber={'N/A'}
              userName={'Usuario'}
            />
            <View style={styles.confirmationContainer}>
              {renderConfirmationContent(status)}
            </View>
          </>
        )}

        <View style={styles.whiteBackgroundContainer}>
          {currentStep !== 2 && currentStep < stepsLabels.length && (
            <Coupon
              onApplyCoupon={(discountAmount) => {
                setCouponDiscount(discountAmount);
                setIsCouponApplied(true);
              }}
              onCouponApplied={() => setIsCouponApplied(true)}
            />
          )}
          <OrderSummary />
          <View style={styles.totalContainer}>
            {isCouponApplied && (
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
            <View style={styles.totalRow}>
              <PoppinsText style={styles.descuentoLabel}>IVA:</PoppinsText>
              <PoppinsText style={styles.descuentoAmount}>
                +${iva.toFixed(2)}
              </PoppinsText>
            </View>
            <View style={styles.totalRow}>
              <PoppinsText style={styles.totalLabel}>Total:</PoppinsText>
              <PoppinsText style={styles.totalAmount}>
                ${total.toFixed(2)}
              </PoppinsText>
            </View>
          </View>
          <Button
            title={
              currentStep === 2 && !isSimplifiedSteps
                ? 'Confirmar Pago'
                : currentStep < stepsLabels.length
                  ? 'Continuar'
                  : 'Volver al Home'
            }
            size="medium"
            style={styles.checkoutButton}
            variant={isButtonEnabled ? 'primary' : 'disabled'}
            onPress={
              currentStep < stepsLabels.length
                ? isButtonEnabled
                  ? handleContinue
                  : undefined
                : handleGoToHome
            }
          />
        </View>
      </View>
    </ScrollView>
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
    padding: 8,
  },
  steps: {
    marginTop: 60,
  },
  purchaseOptionsTitle: {
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    marginBottom: 24,
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
    textAlign: 'center',
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
