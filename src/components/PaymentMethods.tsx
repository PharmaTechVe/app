import React from 'react';
import { View, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';

interface PaymentMethodsProps {
  selectedOption: 'pickup' | 'delivery' | null;
  selectedPayment:
    | 'punto_de_venta'
    | 'efectivo'
    | 'transferencia'
    | 'pago_movil'
    | null;
  setSelectedPayment: (
    value: 'punto_de_venta' | 'efectivo' | 'transferencia' | 'pago_movil',
  ) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedOption,
  selectedPayment,
  setSelectedPayment,
}) => {
  const paymentOptions = [
    { label: 'Punto de Venta', value: 'punto_de_venta' },
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Transferencia Bancaria', value: 'transferencia' },
    { label: 'Pago Móvil', value: 'pago_movil' },
  ];

  const filteredOptions = paymentOptions.filter((option) => {
    if (selectedOption === 'pickup' && option.value === 'efectivo') {
      return false;
    }
    if (selectedOption === 'delivery' && option.value === 'punto_de_venta') {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.title}>
        Seleccione el método de pago
      </PoppinsText>
      <View style={styles.divider} />
      <View>
        {filteredOptions.map((option) => (
          <View key={option.value} style={styles.optionSpacing}>
            <RadioButton
              label={option.label}
              value={option.value}
              selectedValue={selectedPayment}
              onValueChange={setSelectedPayment}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    color: Colors.gray_500,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray_100,
    marginVertical: 20,
  },
  optionSpacing: {
    marginBottom: 10,
    paddingLeft: 20,
  },
});

export default PaymentMethods;
