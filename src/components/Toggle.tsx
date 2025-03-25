import React, { useState } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { Colors } from '../styles/theme';

interface ToggleProps {
  value?: boolean;
  onChange?: (newValue: boolean) => void;
  disabled?: boolean;
}

const TOGGLE_CONFIG = {
  width: 55,
  height: 32,
  radius: 30,
  circleSize: 26, // Ajustado para que el círculo quede bien dentro del switch
};

const Toggle: React.FC<ToggleProps> = ({
  value = false,
  onChange,
  disabled = false,
}) => {
  const [toggleValue, setToggleValue] = useState(value);
  const animatedValue = new Animated.Value(value ? 1 : 0);

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
    outputRange: [2, TOGGLE_CONFIG.width - TOGGLE_CONFIG.circleSize - 2],
  });

  return (
    <Pressable
      onPress={handleToggle}
      style={[
        styles.toggleBase,
        {
          width: TOGGLE_CONFIG.width,
          height: TOGGLE_CONFIG.height,
          backgroundColor: toggleValue ? Colors.toggleOn : Colors.toggleOff,
          borderRadius: TOGGLE_CONFIG.radius,
        },
        disabled && styles.disabled,
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            width: TOGGLE_CONFIG.circleSize,
            height: TOGGLE_CONFIG.circleSize,
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggleBase: {
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
