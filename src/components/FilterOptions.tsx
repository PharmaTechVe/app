import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
} from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/solid';
import PoppinsText from './PoppinsText';
import Button from './Button';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

type FilterOptionsProps = {
  visible: boolean;
  onClose: () => void;
  onClearFilters: () => void;
  onApplyFilters: (priceRange: { min: number; max: number }) => void;
  children: React.ReactNode;
};

const FilterOptions: React.FC<FilterOptionsProps> = ({
  visible,
  onClose,
  onClearFilters,
  onApplyFilters,
  children,
}) => {
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const scrollOffset = useRef(0);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

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
      onStartShouldSetPanResponder: (_, gestureState) => {
        return scrollOffset.current <= 0 && gestureState.dy > 0;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return scrollOffset.current <= 0 && gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.max(gestureState.dy, 0);
        panY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 200 || gestureState.vy > 1) {
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

  const handleApplyFilters = () => {
    onApplyFilters(priceRange);
    closeSheet();
  };

  const handleClearFilters = () => {
    setPriceRange({ min: 0, max: 1000 }); // Reiniciar el rango de precios
    onClearFilters(); // Llamar a la función pasada como prop
  };

  return (
    <Modal
      animated
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={closeSheet}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.container, { transform: [{ translateY: panY }] }]}
            {...panResponders.panHandlers}
          >
            {/* Cabecera fija */}
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                <PoppinsText style={styles.headerTitle}>Filtros</PoppinsText>
                <AdjustmentsHorizontalIcon
                  size={20}
                  color={Colors.iconMainDefault}
                />
              </View>
              <TouchableWithoutFeedback onPress={handleClearFilters}>
                <View style={styles.clearButtonContainer}>
                  <PoppinsText style={styles.clearText}>Limpiar</PoppinsText>
                </View>
              </TouchableWithoutFeedback>
            </View>

            {/* Contenido desplazable */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              onScroll={(event) => {
                scrollOffset.current = event.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
            >
              {children}

              {/* Filtro de precios */}
              <View style={styles.priceFilterContainer}>
                <PoppinsText style={styles.priceFilterTitle}>
                  Rango de precios
                </PoppinsText>
                <MultiSlider
                  values={[priceRange.min, priceRange.max]}
                  min={0}
                  max={1000}
                  step={10}
                  onValuesChange={(values) =>
                    setPriceRange({ min: values[0], max: values[1] })
                  }
                  selectedStyle={{ backgroundColor: Colors.primary }}
                  unselectedStyle={{ backgroundColor: Colors.gray_500 }}
                  markerStyle={{
                    backgroundColor: Colors.primary,
                    height: 20,
                    width: 20,
                  }}
                  containerStyle={{ marginHorizontal: 10 }}
                />
                <View style={styles.priceLabels}>
                  <PoppinsText style={styles.priceLabel}>
                    Min: ${priceRange.min}
                  </PoppinsText>
                  <PoppinsText style={styles.priceLabel}>
                    Max: ${priceRange.max}
                  </PoppinsText>
                </View>
              </View>
            </ScrollView>

            {/* Botón para aplicar filtros */}
            <View style={styles.applyButtonContainer}>
              <Button
                title="Aplicar filtros"
                onPress={handleApplyFilters}
                variant="primary"
                size="large"
              />
            </View>
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
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.gray_100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.primary,
    marginRight: 4,
  },
  clearButtonContainer: {
    position: 'absolute',
    right: 20,
  },
  clearText: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.iconMainDefault,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  priceFilterContainer: {
    marginTop: 20,
  },
  priceFilterTitle: {
    fontSize: FontSizes.s1.size,
    lineHeight: FontSizes.s1.lineHeight,
    marginBottom: 8,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textLowContrast,
  },
  applyButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: Colors.gray_100,
  },
});

export default FilterOptions;
