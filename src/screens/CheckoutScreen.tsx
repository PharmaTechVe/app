import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ShoppingBagIcon, TruckIcon } from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import RadioCard from '../components/RadioCard';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';

const CheckoutScreen = () => {
  const [selectedOption, setSelectedOption] = useState<
    'pickup' | 'delivery' | null
  >(null);
  const { cartItems } = useCart();

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

  return (
    <View style={styles.container}>
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
      <OrderSummary />
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </View>
      <Button title="Continuar" size="medium" style={styles.checkoutButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.bgColor,
  },
  radioContainer: {
    width: '100%',
    marginBottom: 20,
  },
  radioItem: {
    marginBottom: 24,
  },
  totalContainer: {
    width: '110%',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
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
  continueButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  continueButtonText: {
    color: Colors.textWhite,
    fontSize: FontSizes.b1.size,
    fontFamily: 'Poppins_600SemiBold',
  },
  checkoutButton: {
    marginBottom: 16,
    width: '100%',
    height: 50,
  },
});

export default CheckoutScreen;
