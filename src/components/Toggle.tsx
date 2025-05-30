import React, { useState, useEffect } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { Colors, ToggleSizes } from '../styles/theme';

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
  const config = ToggleSizes[size];

  useEffect(() => {
    setToggleValue(value);
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

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
    outputRange: [2, config.width - config.circleSize - 2],
  });

  return (
    <Pressable
      onPress={handleToggle}
      style={[
        styles.toggleBase,
        {
          width: config.width,
          height: config.height,
          backgroundColor: toggleValue ? Colors.toggleOn : Colors.toggleOff,
          borderRadius: config.radius,
        },
        disabled && styles.disabled,
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            width: config.circleSize,
            height: config.circleSize,
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
    backgroundColor: Colors.stroke,
  },
});

export default Toggle;
