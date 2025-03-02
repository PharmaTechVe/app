import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

type borderType = 'none' | 'default' | 'double';

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: string[];
  border: borderType;
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  options,
  border,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const getBorderWidth = () => {
    switch (border) {
      case 'none':
        return 0;
      case 'double':
        return 2;
      default:
        return 1;
    }
  };

  return (
    <View style={styles.container}>
      {label && <PoppinsText style={styles.label}>{label}</PoppinsText>}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[{ borderWidth: getBorderWidth() }, styles.Selectbtn]}
      >
        <PoppinsText style={styles.selectedText}>
          {selectedOption || placeholder}
        </PoppinsText>
        <ChevronDownIcon color={Colors.iconMainDefault} size={20} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(option)}
              style={[
                {
                  backgroundColor:
                    option === selectedOption ? Colors.primary : '',
                },
                styles.option,
              ]}
              activeOpacity={1}
            >
              <PoppinsText
                style={[
                  { color: option === selectedOption ? Colors.textWhite : '' },
                  styles.optionText,
                ]}
              >
                {option}
              </PoppinsText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  label: {
    fontSize: FontSizes.label.size,
    marginBottom: 8,
  },
  Selectbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    fontSize: FontSizes.label.size,
  },
  selectedText: {
    fontSize: 16,
    color: Colors.textLowContrast,
    flex: 1,
  },
  optionsContainer: {
    marginTop: 15,
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Dropdown;
