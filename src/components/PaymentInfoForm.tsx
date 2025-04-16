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

  const staticInputProps = {
    isEditable: false,
    backgroundColor: Colors.gray_100,
    border: 'default' as const,
  };

  const editableInputProps = {
    backgroundColor: Colors.iconWhite,
  };

  return (
    <View style={styles.container}>
      {(paymentMethod === 'pago_movil' ||
        paymentMethod === 'transferencia') && (
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
                {...staticInputProps}
              />
            </View>
            <View style={styles.inputWrapper}>
              {paymentMethod === 'pago_movil' ? (
                <Input
                  label="Teléfono"
                  value="0414-1234567"
                  {...staticInputProps}
                />
              ) : (
                <Input
                  label="Cuenta"
                  value="0134-2452-30-2536432346"
                  {...staticInputProps}
                />
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Input label="RIF" value="J-008720001" {...staticInputProps} />
            </View>
            <View style={styles.inputWrapper}>
              <Input label="Monto" value={total} {...staticInputProps} />
            </View>
          </View>

          <PoppinsText style={styles.label}>
            Ingrese los datos para validar el pago
          </PoppinsText>
          <Input
            label="Banco"
            placeholder="Ingrese el banco"
            {...editableInputProps}
          />
          <Input
            label="Referencia"
            placeholder="Ingrese la referencia"
            {...editableInputProps}
          />
          <Input
            label="Número de documento"
            placeholder="Ingrese su número de documento"
            {...editableInputProps}
          />
          <Input
            label="Teléfono"
            placeholder="Ingrese su número de teléfono"
            {...editableInputProps}
          />
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
