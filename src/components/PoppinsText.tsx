import React, { forwardRef } from 'react';
import { Text, TextProps } from 'react-native';

interface PoppinsTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'semibold';
}

const PoppinsText = forwardRef<Text, PoppinsTextProps>(
  ({ weight = 'regular', style, ...props }, ref) => {
    // Selecciona la fuente según el peso solicitado
    const fontFamily =
      weight === 'medium'
        ? 'Poppins_500Medium'
        : weight === 'semibold'
          ? 'Poppins_600SemiBold'
          : 'Poppins_400Regular';

    return <Text {...props} ref={ref} style={[{ fontFamily }, style]} />;
  },
);

PoppinsText.displayName = 'PoppinsText';

export default PoppinsText;
