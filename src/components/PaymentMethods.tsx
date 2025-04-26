import React from 'react';
import { View, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';
import { PaymentMethod } from '@pharmatech/sdk';

type PaymentOptionValue =
  | 'punto_de_venta'
  | 'efectivo'
  | 'transferencia'
  | 'pago_movil';

interface PaymentMethodsProps {
  selectedOption: 'pickup' | 'delivery' | null;
  selectedPayment: PaymentOptionValue | null;
  setSelectedPayment: (value: PaymentOptionValue) => void;
}

const labelMap: Record<PaymentMethod, string> = {
  [PaymentMethod.CARD]: 'Punto de Venta',
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.BANK_TRANSFER]: 'Transferencia Bancaria',
  [PaymentMethod.MOBILE_PAYMENT]: 'Pago Móvil',
};

const valueMap: Record<PaymentMethod, PaymentOptionValue> = {
  [PaymentMethod.CARD]: 'punto_de_venta',
  [PaymentMethod.CASH]: 'efectivo',
  [PaymentMethod.BANK_TRANSFER]: 'transferencia',
  [PaymentMethod.MOBILE_PAYMENT]: 'pago_movil',
};

const ALL_METHODS: PaymentMethod[] = [
  PaymentMethod.CARD,
  PaymentMethod.CASH,
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.MOBILE_PAYMENT,
];

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedOption,
  selectedPayment,
  setSelectedPayment,
}) => {
  const filtered = ALL_METHODS.filter((m) => {
    if (selectedOption === 'pickup' && m === PaymentMethod.CASH) return false;
    if (selectedOption === 'delivery' && m === PaymentMethod.CARD) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.title}>
        Seleccione el método de pago
      </PoppinsText>
      <View style={styles.divider} />

      {filtered.map((m) => {
        const uiValue = valueMap[m];
        return (
          <View key={m} style={styles.optionSpacing}>
            <RadioButton
              label={labelMap[m]}
              value={uiValue}
              selectedValue={selectedPayment ?? ''}
              onValueChange={(value) =>
                setSelectedPayment(value as PaymentOptionValue)
              }
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  title: { color: Colors.gray_500 },
  divider: {
    height: 1,
    backgroundColor: Colors.gray_100,
    marginVertical: 20,
  },
  optionSpacing: { marginBottom: 10, paddingLeft: 20 },
});

export default PaymentMethods;
