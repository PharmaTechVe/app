import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

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
  const [search, setSearch] = useState('');
  return (
    <>
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
          value={search}
          onChangeText={(value) => setSearch(value)}
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
      {search && (
        <View
          style={{
            zIndex: 999,
            position: 'absolute',
            top: 110,
            left: 20,
            width: 325,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.textWhite,
              padding: 10,
              borderRadius: 5,
              flex: 1,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <PoppinsText>Sugerencias</PoppinsText>
              <PoppinsText style={{ flex: 1, flexWrap: 'wrap' }}>
                Productos que coinciden con &quot;{search}&quot;
              </PoppinsText>
            </View>
            <View></View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <PoppinsText style={{ flex: 1, flexWrap: 'wrap' }}>
                Buscar &quot;{search}&quot;
              </PoppinsText>
              <ArrowRightIcon size={20} color={Colors.gray_500} />
            </View>
          </View>
        </View>
      )}
    </>
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
