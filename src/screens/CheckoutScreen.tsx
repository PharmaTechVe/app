import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ShoppingBagIcon, TruckIcon } from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import RadioCard from '../components/RadioCard';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';
import Steps from '../components/Steps';
import PaymentMethods from '../components/PaymentMethods';
import PoppinsText from '../components/PoppinsText';
import Coupon from '../components/Coupon';
import LocationSelector from '../components/LocationSelector';

const CheckoutScreen = () => {
  const [selectedOption, setSelectedOption] = useState<
    'pickup' | 'delivery' | null
  >('pickup');
  const [selectedPayment, setSelectedPayment] = useState<
    'punto_de_venta' | 'efectivo' | 'transferencia' | 'pago_movil' | null
  >(null);
  const { cartItems } = useCart();

  const isSimplifiedSteps =
    (selectedOption === 'pickup' && selectedPayment === 'punto_de_venta') ||
    (selectedOption === 'delivery' && selectedPayment === 'efectivo');

  const stepsLabels = isSimplifiedSteps
    ? ['Opciones de Compra', 'Confirmación de orden']
    : ['Opciones de Compra', 'Visualización de datos', 'Confirmación de orden'];

  const currentStep = 1;

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
        <PoppinsText style={styles.purchaseOptionsTitle}>
          Opciones de Compra
        </PoppinsText>
        <View style={styles.radioContainer}>
          <View style={styles.radioItem}>
            <RadioCard
              label="Retiro en Sucursal"
              icon={<ShoppingBagIcon color={Colors.textMain} />}
              selected={selectedOption === 'pickup'}
              onPress={() => setSelectedOption('pickup')}
            />
          </View>
          <View>
            <RadioCard
              label="Delivery"
              icon={<TruckIcon color={Colors.textMain} />}
              selected={selectedOption === 'delivery'}
              onPress={() => setSelectedOption('delivery')}
            />
          </View>
        </View>
        <LocationSelector
          selectedOption={selectedOption}
          onSelect={(val) => console.log('Seleccionado:', val)}
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
        <View style={styles.whiteBackgroundContainer}>
          <Coupon
            onApplyCoupon={(code) => console.log('Cupon aplicado:', code)}
          />
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
            title="Continuar"
            size="medium"
            style={styles.checkoutButton}
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

  radioContainer: {
    width: '100%',
    padding: 20,
    marginTop: -30,
  },
  radioItem: {
    marginBottom: 24,
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
  footerMessage: {
    fontSize: FontSizes.c1.size,
    color: Colors.textLowContrast,
    marginBottom: -20,
    padding: 20,
    marginTop: -20,
  },
  checkoutButton: {
    marginBottom: 16,
    width: '100%',
    height: 50,
    marginTop: 15,
  },
  purchaseOptionsTitle: {
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    marginBottom: 24,
    alignSelf: 'flex-start',
    padding: 20,
  },
  whiteBackgroundContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20,
    padding: 20,
  },
  paymentMethods: {
    padding: 20,
  },
  steps: {
    marginTop: 40,
  },
  spacer: {
    height: 20,
  },
});

export default CheckoutScreen;
