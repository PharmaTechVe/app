import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { Colors } from '../styles/theme';

type FilterOptionsProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const FilterOptions: React.FC<FilterOptionsProps> = ({
  visible,
  onClose,
  children,
}) => {
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 500,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 0 && gs.vy > 0.5) {
          return closeSheet();
        }
        return resetPositionAnim.start();
      },
    }),
  ).current;

  React.useEffect(() => {
    if (visible) {
      resetPositionAnim.start();
    } else {
      closeAnim.start();
    }
  }, [visible]);

  const closeSheet = () => {
    closeAnim.start(() => onClose());
  };

  return (
    <Modal
      animated
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={closeSheet}
    >
      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateY: panY }],
              },
            ]}
            {...panResponders.panHandlers}
          >
            <View style={styles.sliderIndicatorRow}>
              <View style={styles.sliderIndicator} />
            </View>
            {children}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.bgColor,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    minHeight: 200,
    maxHeight: '80%',
  },
  sliderIndicatorRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderIndicator: {
    backgroundColor: '#CECECE',
    height: 4,
    width: 45,
    borderRadius: 2,
  },
});

export default FilterOptions;
