import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';
import { router } from 'expo-router';
import { ProductService } from '../services/products';
import { ProductPresentation } from '@pharmatech/sdk';

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
  const [result, setResult] = useState<ProductPresentation[]>();

  useEffect(() => {
    const fetchQuery = async () => {
      const resultData = await ProductService.getProducts(1, 20, { q: search });

      if (resultData.success) setResult(resultData.data.results);
    };

    fetchQuery();
  }, [search]);
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
              borderWidth: 1,
              borderColor: Colors.gray_100,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                padding: 1,
                borderBottomWidth: 1,
                borderColor: Colors.gray_100,
              }}
            >
              <PoppinsText style={{ fontSize: FontSizes.c1.size, width: 130 }}>
                Sugerencias
              </PoppinsText>
              <PoppinsText
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  fontSize: FontSizes.c1.size,
                }}
              >
                Productos que coinciden con &quot;{search}&quot;
              </PoppinsText>
            </View>
            <ScrollView style={{ height: 400 }}>
              {result?.map((p, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ flexDirection: 'row' }}
                  onPress={() =>
                    router.push(
                      `/products/${p.product.id}/presentation/${p.presentation.id}`,
                    )
                  }
                >
                  <View style={{ width: 130 }}>
                    <PoppinsText
                      style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        fontSize: FontSizes.c1.size,
                      }}
                    >
                      {p.product.categories[0].name}
                    </PoppinsText>
                  </View>
                  <View>
                    <View></View>
                    <View style={{ padding: 1 }}>
                      <PoppinsText
                        style={{
                          flex: 1,
                          flexWrap: 'wrap',
                          fontSize: FontSizes.c1.size,
                        }}
                      >
                        {p?.product?.name +
                          ' ' +
                          p?.presentation?.quantity +
                          ' ' +
                          p?.presentation?.measurementUnit +
                          ' ' +
                          p?.product?.categories[0].name +
                          '. ' +
                          p?.product?.description +
                          '\n' +
                          'Bs.' +
                          p?.price}
                      </PoppinsText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => router.push(`/search/${search}`)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 1,
                  borderTopWidth: 1,
                  borderColor: Colors.gray_100,
                }}
              >
                <PoppinsText
                  style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    fontSize: FontSizes.c1.size,
                  }}
                >
                  Buscar &quot;{search}&quot;
                </PoppinsText>
                <ArrowRightIcon size={20} color={Colors.gray_500} />
              </View>
            </TouchableOpacity>
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
