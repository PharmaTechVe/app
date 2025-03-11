import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PlusIcon } from 'react-native-heroicons/outline';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';

const CounterButton = () => {
  const [count, setCount] = useState(0);
  const [showCounter, setShowCounter] = useState(false);

  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {!showCounter ? (
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setShowCounter(true)}
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
            <PoppinsText style={styles.buttonText}>-</PoppinsText>
          </TouchableOpacity>

          <PoppinsText style={styles.countText}>{count}</PoppinsText>

          <TouchableOpacity
            style={[styles.counterButton]}
            onPress={incrementCount}
          >
            <PoppinsText style={styles.buttonText}>+</PoppinsText>
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
  },
  mainButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    elevation: 3,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    minWidth: 40,
    textAlign: 'center',
  },
});

export default CounterButton;
