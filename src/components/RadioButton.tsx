import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';

interface RadioButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  selectedValue,
  onValueChange,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(value)}
      style={styles.container}
    >
      <View
        style={[
          styles.circle,
          selectedValue === value && styles.selectedCircle,
        ]}
      >
        {selectedValue === value && <View style={styles.innerCircle} />}
      </View>
      <PoppinsText style={styles.label}>{label}</PoppinsText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    borderColor: Colors.primary,
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  label: {
    marginLeft: 8,
    color: Colors.textMain,
  },
});

export default RadioButton;
