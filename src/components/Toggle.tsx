import React, { useState } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { Colors } from '../styles/theme';

interface ToggleProps {
  value?: boolean;
  onChange?: (newValue: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Toggle: React.FC<ToggleProps> = ({
  value = false,
  onChange,
  disabled = false,
  size = 'medium',
}) => {
  const [toggleValue, setToggleValue] = useState(value);
  const animatedValue = new Animated.Value(value ? 1 : 0);

  const toggleSizes = {
    small: { width: 40, height: 20, circle: 16 },
    medium: { width: 50, height: 24, circle: 20 },
    large: { width: 60, height: 30, circle: 26 },
  };

  const { width, height, circle } = toggleSizes[size];

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !toggleValue;
    setToggleValue(newValue);
    onChange?.(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width - circle - 2],
  });

  return (
    <Pressable
      onPress={handleToggle}
      style={[
        styles.toggleBase,
        {
          width,
          height,
          backgroundColor: toggleValue ? Colors.toggleOn : Colors.toggleOff,
        },
        disabled && styles.disabled,
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          { width: circle, height: circle, transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggleBase: {
    borderRadius: 20,
    justifyContent: 'center',
    padding: 2,
  },
  circle: {
    backgroundColor: Colors.textWhite,
    borderRadius: 50,
    position: 'absolute',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Toggle;
