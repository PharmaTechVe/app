import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from './Input';
import Button from './Button';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

interface CouponProps {
  onApplyCoupon: (code: string) => void;
  isLoading?: boolean;
}

const Coupon: React.FC<CouponProps> = ({
  onApplyCoupon,
  isLoading = false,
}) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = () => {
    if (couponCode.trim().length > 0) {
      onApplyCoupon(couponCode.trim());
    }
  };

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.label}>Ingresa el Cupón</PoppinsText>
      <View style={styles.row}>
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: Colors.gray_100,
              borderWidth: 1,
              borderRadius: 8,
              height: 44,
              paddingHorizontal: 10,
              justifyContent: 'center',
              backgroundColor: Colors.menuWhite,
            },
          ]}
        >
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
          variant="primary"
          size="medium"
          loading={isLoading}
          style={styles.button}
        />
      </View>
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
  },
  button: {
    flex: 0.2,
    height: 44,
    paddingHorizontal: 16,
  },
});

export default Coupon;
