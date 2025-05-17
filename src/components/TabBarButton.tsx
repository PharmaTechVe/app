import { Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import React, { useEffect } from 'react';
import { icon } from '../constants/icon';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../styles/theme';

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
}: {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: keyof typeof icon;
  color: string;
  label:
    | string
    | ((args: {
        focused: boolean;
        color: string;
        position: string;
        children: string;
      }) => React.ReactNode);
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 },
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {icon[routeName]({
          color: isFocused ? Colors.menuWhite : Colors.primary,
        })}
      </Animated.View>

      <Animated.Text style={animatedTextStyle}>
        {typeof label === 'function'
          ? label({
              focused: isFocused,
              color: isFocused ? Colors.primary : Colors.primary,
              position: 'beside-icon',
              children: '',
            })
          : label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
});
