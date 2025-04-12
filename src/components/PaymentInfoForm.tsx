// components/PaymentInfoForm.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from './PoppinsText';
import Input from './Input';
import { FontSizes, Colors } from '../styles/theme';

const PaymentInfoForm = ({
  paymentMethod,
  total,
}: {
  paymentMethod:
    | 'punto_de_venta'
    | 'efectivo'
    | 'transferencia'
    | 'pago_movil'
    | null;
  total: string;
}) => {
  if (!paymentMethod) {
    return null;
  }
  return (
    <View style={styles.container}>
      {paymentMethod === 'pago_movil' && (
        <>
          <PoppinsText style={styles.label}>
            Realiza el pago en la siguiente cuenta de Pharmatech
          </PoppinsText>
          <PoppinsText style={styles.label1}>
            Debes hacer el pago del monto exacto, de lo contrario no se creará
            la orden
          </PoppinsText>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Input
                label="Banco Asociado"
                value="Banco Venezuela"
                isEditable={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Input label="Teléfono" value="0414-1234567" isEditable={false} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Input label="RIF" value="J-008720001" isEditable={false} />
            </View>
            <View style={styles.inputWrapper}>
              <Input label="Monto" value={total} isEditable={false} />
            </View>
          </View>

          <PoppinsText style={styles.label}>
            Ingrese los datos para validar el pago
          </PoppinsText>
          <Input label="Banco" placeholder="Ingrese el banco" />
          <Input label="Referencia" placeholder="Ingrese la referencia" />
          <Input
            label="Número de documento"
            placeholder="Ingrese su número de documento"
          />
          <Input label="Teléfono" placeholder="Ingrese su número de teléfono" />
        </>
      )}

      {paymentMethod === 'transferencia' && (
        <>
          <PoppinsText style={styles.label}>
            Realiza el pago en la siguiente cuenta de Pharmatech
          </PoppinsText>
          <PoppinsText style={styles.label1}>
            Debes hacer el pago del monto exacto, de lo contrario no se creará
            la orden
          </PoppinsText>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Input
                label="Banco Asociado"
                value="Banco Venezuela"
                isEditable={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Input
                label="Cuenta"
                value="0134-2452-30-2536432346"
                isEditable={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Input label="RIF" value="J-008720001" isEditable={false} />
            </View>
            <View style={styles.inputWrapper}>
              <Input label="Monto" value={total} isEditable={false} />
            </View>
          </View>

          <PoppinsText style={styles.label}>
            Ingrese los datos para validar el pago
          </PoppinsText>
          <Input label="Banco" placeholder="Ingrese el banco" />
          <Input label="Referencia" placeholder="Ingrese la referencia" />
          <Input
            label="Número de documento"
            placeholder="Ingrese su número de documento"
          />
          <Input label="Teléfono" placeholder="Ingrese su número de teléfono" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: FontSizes.b2.size,
    color: Colors.textMain,
    marginBottom: 10,
  },
  label1: {
    fontSize: FontSizes.b3.size,
    color: Colors.gray_500,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  inputWrapper: {
    flex: 1,
  },
});

export default PaymentInfoForm;
