import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ShoppingBagIcon, TruckIcon } from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import RadioCard from '../components/RadioCard';
import OrderSummary from '../components/OrderSummary';

const CheckoutScreen = () => {
  const [selectedOption, setSelectedOption] = useState<
    'pickup' | 'delivery' | null
  >(null);

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
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => console.log('Continuar pressed')}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
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
  continueButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 20,
  },
  continueButtonText: {
    color: Colors.textWhite,
    fontSize: FontSizes.b1.size,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default CheckoutScreen;
