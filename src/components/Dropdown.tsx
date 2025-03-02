import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <View className="my-2 w-full px-6">
      <Text className="text-md mb-2">Dropdown</Text>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center border-2 rounded-xl p-4 w-lg text-md"
      >
        <Text style={styles.selectedText} className="flex-1">
          {selectedOption || 'Select an option'}
        </Text>
        <ChevronDownIcon color="gray" size={20} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(option)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedText: {
    fontSize: 16,
    color: 'gray',
  },
  optionsContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Dropdown;
