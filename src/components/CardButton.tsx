import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PlusIcon, MinusIcon } from 'react-native-heroicons/outline';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

interface CardButtonProps {
  getValue?: (count: number) => void;
  initialValue: number;
  syncQuantity?: (count: number) => void;
}

const CardButton: React.FC<CardButtonProps> = ({
  getValue,
  initialValue = 0,
  syncQuantity,
}) => {
  const [count, setCount] = useState(initialValue);
  const [showCounter, setShowCounter] = useState(false);

  const toggleCounter = () => setShowCounter(count > 0);
  useEffect(toggleCounter, [count]);

  useEffect(() => {
    if (getValue) {
      getValue(count);
    }
    if (syncQuantity) {
      syncQuantity(count);
    }
  }, [count]);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
    }
  };

  const showCounterIncrement = () => {
    setShowCounter(true);
    incrementCount();
  };

  return (
    <View style={styles.container}>
      {!showCounter ? (
        <TouchableOpacity
          style={styles.mainButton}
          onPress={showCounterIncrement}
        >
          <PoppinsText style={styles.buttonText}>
            <PlusIcon size={20} color={Colors.textWhite} />
          </PoppinsText>
        </TouchableOpacity>
      ) : (
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={[styles.counterButton]}
            onPress={decrementCount}
          >
            <PoppinsText style={[styles.buttonText]}>
              <MinusIcon size={20} color={Colors.textWhite} />
            </PoppinsText>
          </TouchableOpacity>

          <PoppinsText style={styles.countText}>{count}</PoppinsText>

          <TouchableOpacity
            style={[styles.counterButton]}
            onPress={incrementCount}
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
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 50,
    elevation: 3,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 4,
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
