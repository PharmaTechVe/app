// src/components/Coupon.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from './Input';
import Button from './Button';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';
import { CouponService } from '../services/coupon';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  setCouponDiscount,
  setCouponApplied,
  setLastAppliedCoupon,
} from '../redux/slices/checkoutSlice';

interface CouponProps {
  onApplyCoupon: (discount: number) => void;
  onCouponApplied: () => void;
  isLoading?: boolean;
}

const Coupon: React.FC<CouponProps> = ({ isLoading = false }) => {
  const dispatch = useDispatch();
  const lastAppliedCoupon = useSelector(
    (state: RootState) => state.checkout.lastAppliedCoupon,
  );

  const [couponCode, setCouponCode] = useState(lastAppliedCoupon || '');
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const code = couponCode.trim();
    if (!code) return;

    setLoading(true);
    setValidationMessage(null);

    try {
      const response = await CouponService.validateCoupon(code);
      const { discount, expirationDate } = response;
      if (new Date(expirationDate) < new Date()) {
        setValidationMessage('El cupón ha expirado.');
      } else {
        setValidationMessage(
          `Cupón válido. Se aplicó ${discount}% de descuento.`,
        );
        dispatch(setCouponDiscount(discount));
        dispatch(setCouponApplied(true));
        dispatch(setLastAppliedCoupon(code));
      }
    } catch (err: unknown) {
      const msg = (err instanceof Error && err.message.toLowerCase?.()) ?? '';
      if (
        typeof msg === 'string' &&
        (msg.includes('not found') || msg.includes('no encontrado'))
      ) {
        setValidationMessage('Cupón inválido.');
      } else {
        setValidationMessage('Error al validar el cupón.');
        console.error('Error en validateCoupon:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string) => {
    setCouponCode(text);
  };

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.label}>Ingresa el Cupón</PoppinsText>
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Input
            placeholder="Código de Cupón"
            value={couponCode}
            getValue={handleChange}
            border="none"
            backgroundColor="none"
          />
        </View>
        <Button
          title={
            couponCode.trim() === lastAppliedCoupon ? 'Aplicado' : 'Aplicar'
          }
          onPress={handleApply}
          variant={loading || isLoading ? 'disabled' : 'primary'}
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
              color: validationMessage.includes('válido')
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
