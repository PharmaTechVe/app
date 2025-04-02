import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../styles/theme';
import PoppinsText from './PoppinsText';

export interface BadgeProps {
  variant: 'filled' | 'outlined' | 'text';
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info';
  size: 'tiny' | 'small' | 'medium' | 'large';
  borderRadius?: 'rounded' | 'square';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant,
  color,
  size,
  borderRadius = 'rounded',
  children,
}) => {
  const sizeStyles: Record<string, StyleProp<ViewStyle | TextStyle>> = {
    tiny: { width: 17, height: 17, fontSize: 10 }, // Fixed width and height for a perfect circle
    small: { width: 24, height: 24, fontSize: 12 },
    medium: { width: 32, height: 32, fontSize: 14 },
    large: { width: 40, height: 40, fontSize: 16 },
  };

  const borderRadiusStyles: Record<string, StyleProp<ViewStyle>> = {
    rounded: { borderRadius: 9999 },
    square: { borderRadius: 4 },
  };

  const colorStyles: Record<
    string,
    Record<string, StyleProp<ViewStyle | TextStyle>>
  > = {
    filled: {
      primary: { backgroundColor: Colors.primary, color: Colors.textWhite },
      warning: {
        backgroundColor: Colors.semanticWarning,
        color: Colors.textWhite,
      },
      danger: {
        backgroundColor: Colors.semanticDanger,
        color: Colors.textWhite,
      },
      success: {
        backgroundColor: Colors.semanticSuccess,
        color: Colors.textWhite,
      },
      info: { backgroundColor: Colors.semanticInfo, color: Colors.textWhite },
    },
    outlined: {
      primary: {
        borderColor: Colors.primary,
        borderWidth: 1,
        color: Colors.primary,
      },
      warning: {
        borderColor: Colors.semanticWarning,
        borderWidth: 1,
        color: Colors.semanticWarning,
      },
      danger: {
        borderColor: Colors.semanticDanger,
        borderWidth: 1,
        color: Colors.semanticDanger,
      },
      success: {
        borderColor: Colors.semanticSuccess,
        borderWidth: 1,
        color: Colors.semanticSuccess,
      },
      info: {
        borderColor: Colors.semanticInfo,
        borderWidth: 1,
        color: Colors.semanticInfo,
      },
    },
    text: {
      primary: { color: Colors.primary },
      warning: { color: Colors.semanticWarning },
      danger: { color: Colors.semanticDanger },
      success: { color: Colors.semanticSuccess },
      info: { color: Colors.semanticInfo },
    },
  };

  const variantStyle = colorStyles[variant][color];
  const sizeStyle = sizeStyles[size];
  const borderRadiusStyle = borderRadiusStyles[borderRadius];

  return (
    <View style={[styles.base, sizeStyle, borderRadiusStyle, variantStyle]}>
      <PoppinsText
        style={[
          styles.text,
          variant === 'outlined' || variant === 'text'
            ? {
                color:
                  (variantStyle as TextStyle).borderColor || Colors.textWhite,
              }
            : { color: Colors.textWhite },
        ]}
        numberOfLines={1} // Ensures the text does not wrap
        ellipsizeMode="clip" // Prevents truncation
      >
        {children}
      </PoppinsText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 1.5,
    lineHeight: 16, // Matches the height for vertical centering
    fontSize: 10, // Matches the font size for the "tiny" size
  },
});

export default Badge;
