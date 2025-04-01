import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../styles/theme';

export interface BadgeProps {
  variant: 'filled' | 'outlined' | 'text';
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info';
  size: 'small' | 'medium' | 'large';
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
    small: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
    medium: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
    large: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 16 },
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
      <Text
        style={[
          styles.text,
          variant === 'outlined' || variant === 'text'
            ? {
                color:
                  (variantStyle as TextStyle).borderColor || Colors.textWhite,
              }
            : { color: Colors.textWhite },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins',
  },
});

export default Badge;
