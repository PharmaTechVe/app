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
  color:
    | 'primary'
    | 'warning'
    | 'danger'
    | 'success'
    | 'info'
    | 'secondary_300';
  size: 'tiny' | 'small' | 'medium' | 'large';
  borderRadius?: 'rounded' | 'square';
  textColor?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant,
  color,
  size,
  borderRadius = 'rounded',
  textColor,
  children,
}) => {
  const sizeStyles: Record<string, StyleProp<ViewStyle | TextStyle>> = {
    tiny: { height: 17, fontSize: 10, minWidth: 17 },
    small: { height: 24, fontSize: 12, minWidth: 24 },
    medium: { height: 32, fontSize: 14, minWidth: 32 },
    large: { height: 40, fontSize: 16, minWidth: 40 },
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
      secondary_300: {
        backgroundColor: Colors.secondary_300,
        color: Colors.textWhite,
      },
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
      secondary_300: {
        borderColor: Colors.secondary_300,
        borderWidth: 1,
        color: Colors.secondary_300,
      },
    },
    text: {
      primary: { color: Colors.primary },
      warning: { color: Colors.semanticWarning },
      danger: { color: Colors.semanticDanger },
      success: { color: Colors.semanticSuccess },
      info: { color: Colors.semanticInfo },
      secondary_300: { color: Colors.secondary_300 },
    },
  };

  const variantStyle = colorStyles[variant][color];
  const sizeStyle = sizeStyles[size];
  const borderRadiusStyle = borderRadiusStyles[borderRadius];

  return (
    <View
      style={[
        styles.base,
        sizeStyle,
        borderRadiusStyle,
        variantStyle,
        { paddingHorizontal: (children?.toString().length ?? 0) > 1 ? 6 : 4 },
      ]}
    >
      <PoppinsText
        style={[
          styles.text,
          {
            color:
              textColor ||
              (variantStyle as TextStyle).color ||
              Colors.textWhite,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="clip"
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
    paddingHorizontal: 4,
  },
  text: {
    textAlign: 'center',
    marginTop: 1.5,
    lineHeight: 16,
    fontSize: 10,
  },
});

export default Badge;
