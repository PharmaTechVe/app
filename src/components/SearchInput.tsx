import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearchPress?: () => void;
  style?: object;
  showClearButton?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Buscar...',
  value,
  onChangeText,
  onSearchPress,
  style,
  showClearButton = true,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onSearchPress}
        style={styles.iconContainer}
        testID="search-icon"
      >
        <MagnifyingGlassIcon size={20} color={Colors.textLowContrast} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLowContrast}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSearchPress}
      />

      {showClearButton && value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          testID="clear-button"
          accessibilityLabel="Limpiar búsqueda"
        >
          <XMarkIcon size={20} color={Colors.textLowContrast} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.menuWhite,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSizes.label.size,
    color: Colors.textMain,
    height: '100%',
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default SearchInput;
