import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from './PoppinsText';
import Input from './Input';
import { FontSizes, Colors } from '../styles/theme';
import Dropdown from './Dropdown';
import { PharmaTech } from '@pharmatech/sdk';

interface Props {
  paymentMethod:
    | 'punto_de_venta'
    | 'efectivo'
    | 'transferencia'
    | 'pago_movil'
    | null;
  total: string;
  onValidationChange: (isValid: boolean) => void;
  onBankChange: (value: string) => void;
  onReferenceChange: (value: string) => void;
  onDocumentNumberChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

const PaymentInfoForm: React.FC<Props> = ({
  paymentMethod,
  total,
  onValidationChange,
  onBankChange,
  onReferenceChange,
  onDocumentNumberChange,
  onPhoneChange,
}) => {
  const [bank, setBank] = useState('');
  const [hasBankTouched, setHasBankTouched] = useState(false);
  const [reference, setReference] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [bankOptions, setBankOptions] = useState<string[]>([]);

  // Fetch bank options from SDK
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const sdk = PharmaTech.getInstance();
        const banks = sdk.bank.findAll();
        setBankOptions(banks);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };
    fetchBanks();
  }, []);

  // Memoized handlers
  const handleBankSelect = useCallback((val: string) => {
    setBank(val);
    setHasBankTouched(true);
  }, []);

  const handleReferenceChange = useCallback((val: string) => {
    setReference(val.replace(/\D/g, ''));
  }, []);

  const handleDocumentNumberChange = useCallback((val: string) => {
    setDocumentNumber(val.replace(/\D/g, '').slice(0, 8));
  }, []);

  const handlePhoneChange = useCallback((val: string) => {
    setPhone(val.replace(/\D/g, '').slice(0, 11));
  }, []);

  // Sync up with parent callbacks
  useEffect(() => {
    onBankChange(bank);
  }, [bank, onBankChange]);

  useEffect(() => {
    onReferenceChange(reference);
  }, [reference, onReferenceChange]);

  useEffect(() => {
    onDocumentNumberChange(documentNumber);
  }, [documentNumber, onDocumentNumberChange]);

  useEffect(() => {
    onPhoneChange(phone);
  }, [phone, onPhoneChange]);

  // Validation effect
  useEffect(() => {
    const isValid =
      paymentMethod !== null &&
      (paymentMethod === 'pago_movil' || paymentMethod === 'transferencia')
        ? bank.trim() !== '' &&
          /^\d{4,}$/.test(reference) &&
          reference.trim() !== '' &&
          !/^0+$/.test(reference) && // no solo ceros
          /^\d{7,8}$/.test(documentNumber) &&
          !/^0+$/.test(documentNumber) && // no solo ceros
          !/^0/.test(documentNumber) && // no inicia en 0
          /^\d{11}$/.test(phone)
        : true;

    onValidationChange(isValid);
  }, [
    bank,
    reference,
    documentNumber,
    phone,
    paymentMethod,
    onValidationChange,
  ]);

  if (!paymentMethod) {
    return null;
  }

  // Memoized props to avoid recreating objects
  const staticInputProps = useMemo(
    () => ({
      isEditable: false,
      backgroundColor: Colors.gray_100,
      border: 'default' as const,
    }),
    [],
  );

  const editableInputProps = useMemo(
    () => ({ backgroundColor: Colors.iconWhite }),
    [],
  );

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
              <Input label="RIF" value="J-008720001" {...staticInputProps} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.largeInput]}>
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
            <View style={[styles.inputWrapper, styles.smallInput]}>
              <Input label="Monto" value={total} {...staticInputProps} />
            </View>
          </View>

          <PoppinsText style={styles.label}>
            Ingrese los datos para validar el pago
          </PoppinsText>

          <Dropdown
            label="Banco"
            placeholder="Seleccione el Banco Emisor"
            options={bankOptions}
            onSelect={handleBankSelect}
            border="default"
            borderColor={
              hasBankTouched && bank === ''
                ? Colors.semanticDanger
                : Colors.gray_100
            }
          />
          {hasBankTouched && bank === '' && (
            <PoppinsText
              style={{
                color: Colors.semanticDanger,
                fontSize: FontSizes.label.size,
                marginTop: 4,
              }}
            >
              Debe seleccionar un banco
            </PoppinsText>
          )}

          <Input
            label="Referencia"
            value={reference}
            placeholder="Ingrese la referencia"
            getValue={handleReferenceChange}
            fieldType="number"
            errorText="Debe ser un número valido"
            validation={(val) =>
              /^\d{4,}$/.test(val) && val.trim() !== '' && !/^0+$/.test(val)
            }
            showIcon={reference.length > 0}
            useDefaultValidation={false}
            {...editableInputProps}
          />
          <Input
            label="Número de documento"
            placeholder="Ingrese el número de documento"
            value={documentNumber}
            getValue={handleDocumentNumberChange}
            fieldType="number"
            errorText="Debe ser un número de documento valido"
            validation={(val) =>
              /^\d{7,8}$/.test(val) &&
              val.trim() !== '' &&
              !/^0+$/.test(val) &&
              !/^0/.test(val)
            }
            showIcon={documentNumber.length > 0}
            useDefaultValidation={false}
            {...editableInputProps}
          />
          <Input
            label="Teléfono"
            placeholder="Ingrese el teléfono"
            value={phone}
            getValue={handlePhoneChange}
            fieldType="number"
            errorText="Debe tener exactamente 11 dígitos"
            validation={(val) => /^\d{11}$/.test(val) && !/^0+$/.test(val)}
            showIcon={phone.length > 0}
            useDefaultValidation={false}
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
  largeInput: {
    flex: 1.5,
  },
  smallInput: {
    flex: 1,
  },
});

export default React.memo(PaymentInfoForm);
