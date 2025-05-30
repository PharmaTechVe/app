import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '../styles/theme';
import { useState } from 'react';
import TabBarButton from './TabBarButton';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const currentRoute = state.routes[state.index].name;

  // Oculta la TabBar en pantallas específicas
  const hiddenRoutes = ['menu', 'cart']; // Agrega aquí las rutas donde no quieres mostrar la TabBar
  if (hiddenRoutes.includes(currentRoute)) {
    return null; // No renderiza la TabBar
  }

  const [dimensions, setDimensions] = useState({ width: 10, height: 20 });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: tabPositionX.value + 16,
      },
    ],
  }));

  return (
    <View onLayout={onTabBarLayout} style={styles.tabBar}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            width: buttonWidth - 32,
            height: dimensions.height - 20,
            backgroundColor: Colors.tertiary_400,
            borderRadius: 30,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withTiming(buttonWidth * index, {
            duration: 350,
          });

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={
              route.name as 'index' | 'categories' | 'branches' | 'offers'
            }
            color={isFocused ? Colors.primary : Colors.textLowContrast}
            label={
              typeof label === 'function'
                ? (props) =>
                    label({
                      ...props,
                      position: props.position as 'beside-icon' | 'below-icon',
                    })
                : label
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.gray_100,
    borderTopWidth: 1,
    backgroundColor: Colors.menuWhite,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  // tabBarItem: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});
