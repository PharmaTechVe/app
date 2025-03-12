import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

interface RadioButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
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
      <PoppinsText weight="regular" style={styles.label}>
        {label}
      </PoppinsText>
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
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
  },
});

export default RadioButton;
