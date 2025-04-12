// CheckoutScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  ShoppingBagIcon,
  TruckIcon,
  MapPinIcon,
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
import PurchaseStatusMessage from '../components/PurchaseStatusMessage';
import { useRouter } from 'expo-router';

const CheckoutScreen = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    'pickup' | 'delivery' | null
  >('pickup');
  const [selectedPayment, setSelectedPayment] = useState<
    'punto_de_venta' | 'efectivo' | 'transferencia' | 'pago_movil' | null
  >(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [status] = useState<'approved' | 'rejected'>('approved'); // Remove setStatus
  const { cartItems } = useCart();

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
  const iva = (subtotal - totalDiscount) * 0.12;
  const total = subtotal - totalDiscount + iva;

  const renderFooterMessage = () => {
    if (selectedOption === 'pickup' && selectedPayment === 'punto_de_venta') {
      return 'Por favor dirigirse a su sucursal más cercana y pagar en el sitio. La orden estará en proceso de pago hasta que pague en el sitio.';
    }
    if (selectedOption === 'delivery' && selectedPayment === 'efectivo') {
      return 'Debe pagar al personal del delivery la cantidad exacta de su pedido. La orden estará en proceso de pago hasta que pague en el sitio.';
    }
    return null;
  };

  const handleContinue = () => {
    if (currentStep < stepsLabels.length) {
      setCurrentStep(currentStep + 1);
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

  const isStep2Complete = isSimplifiedSteps || selectedPayment !== null;

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
        <View style={styles.steps}>
          <Steps
            totalSteps={stepsLabels.length}
            currentStep={currentStep}
            labels={stepsLabels}
          />
        </View>

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
              />
            </View>
          </>
        )}

        {currentStep === stepsLabels.length && (
          <>
            <PoppinsText style={styles.purchaseOptionsTitle}>
              Confirmación de Orden
            </PoppinsText>
            <PurchaseStatusMessage
              status={status}
              orderNumber="12345"
              userName="Cliente1"
            />
            <View style={styles.confirmationContainer}>
              {renderConfirmationContent(status)}
            </View>
          </>
        )}

        <View style={styles.whiteBackgroundContainer}>
          {currentStep !== stepsLabels.length && currentStep !== 2 && (
            <Coupon
              onApplyCoupon={(code) => console.log('Cupon aplicado:', code)}
            />
          )}
          <View style={styles.spacer} />
          <OrderSummary />
          <View style={styles.totalContainer}>
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
  steps: {
    marginTop: 40,
  },
  purchaseOptionsTitle: {
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    marginBottom: 24,
    alignSelf: 'flex-start',
    padding: 20,
  },
  radioContainer: {
    width: '100%',
    padding: 20,
    marginTop: -30,
  },
  radioItem: {
    marginBottom: 24,
  },
  paymentMethods: {
    padding: 20,
  },
  footerMessage: {
    fontSize: FontSizes.c1.size,
    color: Colors.textLowContrast,
    marginBottom: -20,
    padding: 20,
    marginTop: -20,
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
    marginTop: 20,
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
    color: Colors.textMain,
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
    padding: 20,
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
});

export default CheckoutScreen;
