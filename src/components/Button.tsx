// src/components/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'secondaryLight'
  | 'secondaryWhite'
  | 'secondaryGray'
  | 'disabled';

export type ButtonMode = 'filled' | 'outline';

export type ButtonSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  mode?: ButtonMode;
  size?: ButtonSize;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
}

const getButtonStyles = (
  variant: ButtonVariant,
  mode: ButtonMode,
): ViewStyle => {
  let backgroundColor: string = Colors.primary;
  let borderColor: string = Colors.primary;

  switch (variant) {
    case 'primary':
      backgroundColor = Colors.primary;
      borderColor = Colors.primary;
      break;
    case 'secondary':
      backgroundColor = Colors.secondary;
      borderColor = Colors.secondary;
      break;
    case 'secondaryLight':
      backgroundColor = Colors.secondaryLight;
      borderColor = Colors.secondaryLight;
      break;
    case 'secondaryWhite':
      backgroundColor = Colors.secondaryWhite;
      borderColor = Colors.secondaryWhite;
      break;
    case 'secondaryGray':
      backgroundColor = Colors.secondaryGray;
      borderColor = Colors.secondaryGray;
      break;
    case 'disabled':
      backgroundColor = Colors.stroke;
      borderColor = Colors.stroke;
      break;
    default:
      backgroundColor = Colors.primary;
      borderColor = Colors.primary;
  }

  return mode === 'outline'
    ? {
        backgroundColor: 'transparent',
        borderColor: borderColor,
        borderWidth: 1,
      }
    : {
        backgroundColor: backgroundColor,
      };
};

const getTextColor = (variant: ButtonVariant, mode: ButtonMode): string => {
  if (mode === 'outline') {
    switch (variant) {
      case 'primary':
        return Colors.textMain;
      case 'secondary':
        return Colors.secondary;
      case 'secondaryLight':
        return Colors.secondaryLight;
      case 'secondaryWhite':
        return Colors.secondaryWhite;
      case 'secondaryGray':
        return Colors.secondaryGray;
      case 'disabled':
        return Colors.disableText;
      default:
        return Colors.primary;
    }
  }
  return variant === 'secondaryWhite'
    ? Colors.textHighContrast
    : variant === 'secondary'
      ? Colors.textHighContrast
      : variant === 'secondaryLight'
        ? Colors.textHighContrast
        : variant === 'disabled'
          ? Colors.disableText
          : Colors.textWhite;
};

const getFontSizeStyle = (size: ButtonSize): TextStyle => {
  const sizes = {
    giant: FontSizes.btnGiant,
    large: FontSizes.btnLarge,
    medium: FontSizes.btnMedium,
    small: FontSizes.btnSmall,
    tiny: FontSizes.btnTiny,
  };

  return {
    fontSize: sizes[size].size,
    lineHeight: sizes[size].lineHeight,
  };
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  mode = 'filled',
  size = 'large',
  icon,
  style,
  textStyle,
  loading = false,
}) => {
  const buttonStyle = getButtonStyles(variant, mode);
  const textColor = getTextColor(variant, mode);
  const fontSizeStyle = getFontSizeStyle(size);

  return (
    <TouchableOpacity
      style={[styles.buttonBase, buttonStyle, style]}
      onPress={!loading && variant !== 'disabled' ? onPress : undefined}
      disabled={loading || variant === 'disabled'}
      activeOpacity={0.9}
    >
      <View style={styles.contentContainer}>
        {loading && (
          <ActivityIndicator
            color={textColor}
            style={styles.activityIndicator}
          />
        )}
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <PoppinsText
          weight="medium"
          style={[
            styles.textBase,
            fontSizeStyle,
            { color: textColor },
            textStyle,
          ]}
        >
          {title}
        </PoppinsText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    minWidth: 80,
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBase: {
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 4,
  },
  activityIndicator: {
    marginRight: 8,
  },
});

export default Button;
