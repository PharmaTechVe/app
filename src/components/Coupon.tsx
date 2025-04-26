import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from './Input';
import Button from './Button';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';
import { CouponService } from '../services/coupon';

interface CouponProps {
  onApplyCoupon: (discount: number) => void;
  onCouponApplied: () => void;
  isLoading?: boolean;
}

const Coupon: React.FC<CouponProps> = ({
  onApplyCoupon,
  onCouponApplied,
  isLoading = false,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (couponCode.trim().length > 0) {
      setLoading(true);
      setValidationMessage(null);

      try {
        // Llamar al servicio para validar el cupón
        const response = await CouponService.validateCoupon(couponCode.trim());

        // Manejar la respuesta del servicio
        if (response) {
          const { discount, expirationDate } = response;
          const isExpired = new Date(expirationDate) < new Date();

          if (isExpired) {
            setValidationMessage('El cupón ha expirado.');
          } else {
            setValidationMessage(
              `Cupón válido. Se aplicó un descuento del ${discount}%.`,
            );
            onApplyCoupon(discount);
            onCouponApplied();
          }
        } else {
          setValidationMessage('Cupón inválido.');
        }
      } catch (error) {
        setValidationMessage('Error al validar el cupón.');
        console.error('Error en handleApply:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isButtonDisabled = couponCode.trim().length === 0 || loading;

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.label}>Ingresa el Cupón</PoppinsText>
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Input
            placeholder="Código de Cupón"
            value={couponCode}
            getValue={(text) => setCouponCode(text)}
            border="none"
            backgroundColor="none"
          />
        </View>
        <Button
          title="Aplicar"
          onPress={handleApply}
          variant={isButtonDisabled ? 'disabled' : 'primary'}
          size="medium"
          loading={loading || isLoading}
          style={styles.button}
        />
      </View>
      {validationMessage && (
        <PoppinsText
          style={[
            styles.validationMessage,
            {
              color: validationMessage.includes('Cupón válido')
                ? Colors.semanticSuccess
                : Colors.semanticDanger,
            },
          ]}
        >
          {validationMessage}
        </PoppinsText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    color: Colors.textMain,
    fontSize: FontSizes.b4.size,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 0.8,
    marginRight: 8,
    borderColor: Colors.gray_100,
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: Colors.menuWhite,
  },
  button: {
    flex: 0.2,
    height: 44,
    paddingHorizontal: 16,
  },
  validationMessage: {
    marginTop: 8,
    fontSize: FontSizes.b4.size,
  },
});

export default Coupon;
