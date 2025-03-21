import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../styles/theme';
import PoppinsText from './PoppinsText';
import { ChatBubbleBottomCenterIcon } from 'react-native-heroicons/solid';

type BarType = 'withNumber' | 'withTooltip' | 'default';

interface ProgressBarProps {
  progress: number; // Valor de progreso entre 0 y 1
  color?: string;
  barHeight?: number;
  barType?: BarType;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.primary,
  barHeight = 8,
  barType = 'default',
}) => {
  const [width] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const interpolatedWidth = width.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ marginVertical: 5 }}>
      {barType == 'withTooltip' && (
        <View style={{ width: '100%' }}>
          <Animated.View style={{ width: interpolatedWidth }}>
            <ChatBubbleBottomCenterIcon
              size={40}
              color={color}
              style={{ alignSelf: 'flex-end' }}
            />
            <PoppinsText
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                color: Colors.textWhite,
                top: 7,
                right: 5,
              }}
            >
              {progress * 100}%
            </PoppinsText>
          </Animated.View>
        </View>
      )}
      <View style={[styles.container, { height: barHeight }]}>
        <Animated.View
          style={[
            styles.progress,
            { width: interpolatedWidth, backgroundColor: color },
          ]}
        >
          {barType == 'withNumber' && (
            <PoppinsText
              style={[styles.textInBar, { fontSize: barHeight / 1.5 }]}
            >
              {progress * 100}%
            </PoppinsText>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 5,
  },
  textInBar: {
    color: Colors.textWhite,
    textAlign: 'center',
    width: '100%',
  },
});

export default ProgressBar;
