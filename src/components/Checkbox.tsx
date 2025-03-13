// src/components/Checkbox.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  color?: string;
  size?: number;
  style?: object;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  color = Colors.primary,
  size = 24,
  style,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.container, style]}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label || 'Checkbox'}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.2,
            borderColor: checked ? color : Colors.primary,
            backgroundColor: checked ? color : Colors.menuWhite,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {checked && (
          <CheckIcon
            size={size * 0.6}
            color={Colors.textWhite}
            strokeWidth={2.5}
          />
        )}
      </View>
      {label && (
        <PoppinsText
          weight="regular"
          style={[styles.label, disabled && styles.disabledLabel]}
        >
          {label}
        </PoppinsText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: FontSizes.b4.size,
    lineHeight: FontSizes.b4.lineHeight,
    color: Colors.textMain,
  },
  disabledLabel: {
    color: Colors.disableText,
  },
});

export default Checkbox;
