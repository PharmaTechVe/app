import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PlusIcon, MinusIcon } from 'react-native-heroicons/outline';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

interface CardButtonProps {
  getValue?: (count: number) => void;
  initialValue: number;
  size?: number;
  syncQuantity?: (count: number) => void;
  disabled?: boolean;
  showNoStockAlert?: () => void; // <-- nuevo prop opcional
}

const CardButton: React.FC<CardButtonProps> = ({
  getValue,
  initialValue = 0,
  size = 4,
  syncQuantity,
  disabled = false, // <-- Valor por defecto
  showNoStockAlert, // <-- Add this line
}) => {
  const [count, setCount] = useState(initialValue);
  const [showCounter, setShowCounter] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleCounter = () => setShowCounter(count > 0);
  useEffect(toggleCounter, [count]);

  useEffect(() => {
    if (hasInteracted && getValue) {
      getValue(count);
    }
    if (hasInteracted && syncQuantity) {
      syncQuantity(count);
    }
  }, [count]);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  const incrementCount = () => {
    if (disabled) {
      if (showNoStockAlert) showNoStockAlert();
      return;
    }
    setHasInteracted(true);
    setCount((prev) => prev + 1);
  };

  const decrementCount = () => {
    if (disabled) {
      if (showNoStockAlert) showNoStockAlert();
      return;
    }
    if (count > 0) {
      setHasInteracted(true);
      setCount((prev) => prev - 1);
    }
  };

  const showCounterIncrement = () => {
    if (disabled) return; // <-- No permitir si está deshabilitado
    setShowCounter(true);
    incrementCount();
  };

  return (
    <View style={styles.container}>
      {!showCounter ? (
        <TouchableOpacity
          style={[
            styles.mainButton,
            { padding: size },
            disabled && { backgroundColor: Colors.stroke }, // <-- más opaco
          ]}
          onPress={() => {
            if (disabled && showNoStockAlert) showNoStockAlert();
            else showCounterIncrement();
          }}
        >
          <PoppinsText style={styles.buttonText}>
            <PlusIcon size={20} color={Colors.textWhite} />
          </PoppinsText>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.counterContainer,
            { padding: size },
            disabled && { backgroundColor: Colors.stroke },
          ]}
        >
          <TouchableOpacity
            style={[styles.counterButton]}
            onPress={() => {
              if (disabled && showNoStockAlert) showNoStockAlert();
              else decrementCount();
            }}
          >
            <PoppinsText style={[styles.buttonText]}>
              <MinusIcon size={20} color={Colors.textWhite} />
            </PoppinsText>
          </TouchableOpacity>

          <PoppinsText style={styles.countText}>{count}</PoppinsText>

          <TouchableOpacity
            style={[styles.counterButton]}
            onPress={() => {
              if (disabled && showNoStockAlert) showNoStockAlert();
              else incrementCount();
            }}
          >
            <PoppinsText style={styles.buttonText}>
              <PlusIcon size={20} color={Colors.textWhite} />
            </PoppinsText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  mainButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    elevation: 3,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: Colors.primary,
    borderRadius: 50,
  },
  counterButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: FontSizes.b3.size,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: FontSizes.b3.size,
    color: Colors.textWhite,
    minWidth: 10,
    textAlign: 'center',
  },
});

export default CardButton;
