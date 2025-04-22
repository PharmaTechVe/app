import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import TopBar from '../components/TopBar';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { ProductService } from '../services/products';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/solid';
import FilterOptions from '../components/FilterOptions';
import { ManufacturerResponse, ProductPresentation } from '@pharmatech/sdk';
import Checkbox from '../components/Checkbox';
import Steps from '../components/Steps';
import Button from '../components/Button';

export default function SearchProductScreen() {
  const { query } = useLocalSearchParams<{ query: string }>();

  const [search, setSearch] = useState<ProductPresentation[]>();
  const [isVisible, setIsVisible] = useState(false);
  const [brands, setBrands] = useState<ManufacturerResponse[]>();

  useEffect(() => {
    const fetchSearchData = async () => {
      const searchData = await ProductService.getProducts(1, 20, { q: query });
      const brands = await ProductService.getBrands(1, 100);
      console.log(search);
      if (searchData.success) setSearch(searchData.data.results);
      if (brands.success) setBrands(brands.data.results);
    };

    fetchSearchData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <TopBar />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'center' }}
          onPress={() => setIsVisible(true)}
        >
          <PoppinsText style={{ color: Colors.primary, paddingEnd: 5 }}>
            Filtrar
          </PoppinsText>
          <AdjustmentsHorizontalIcon size={20} color={Colors.iconMainDefault} />
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <View style={{ marginVertical: 5 }}>
          <PoppinsText>Resultados de la búsqueda: {query}</PoppinsText>
          <PoppinsText style={{ fontSize: FontSizes.c1.size }}>
            {60} resultados
          </PoppinsText>
        </View>
      </View>
      <SafeAreaView style={styles.container}></SafeAreaView>
      <FilterOptions visible={isVisible} onClose={() => setIsVisible(false)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: Colors.gray_100,
          }}
        >
          <PoppinsText style={{ color: Colors.primary, paddingEnd: 5 }}>
            Filtros
          </PoppinsText>
          <AdjustmentsHorizontalIcon size={20} color={Colors.iconMainDefault} />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <View>
            <PoppinsText weight="medium">Categoría</PoppinsText>
            <View></View>
          </View>
          <View>
            <PoppinsText weight="medium">Marca o Laboratorio</PoppinsText>
            <View>
              {brands?.map((b, index) => (
                <Checkbox
                  key={index}
                  checked={false}
                  label={b.name}
                  onChange={(e) => (e ? '' : null)}
                  style={{ margin: 3 }}
                  size={20}
                />
              ))}
            </View>
          </View>
          <View>
            <PoppinsText weight="medium">Presentación</PoppinsText>
          </View>
        </View>
        <View>
          <PoppinsText weight="medium">Precio</PoppinsText>
          <Steps
            totalSteps={2}
            currentStep={2}
            labels={['Bs. 40.00', 'Bs. 1000.00']}
          />
          <Button title="Filtrar" />
        </View>
      </FilterOptions>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  productImage: {
    width: width,
    height: 200,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  activeImageIndicator: {
    backgroundColor: Colors.gray_500,
    width: 17,
  },
  productInfo: {
    padding: 16,
    paddingVertical: 0,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 10,
  },
  productName: {
    textAlign: 'center',
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    marginVertical: 15,
  },
  description: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.s2.size,
    color: Colors.textLowContrast,
    marginBottom: 3,
  },
  quantitySelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  starIcon: {
    marginHorizontal: 4,
  },
  ratingFeedback: {
    textAlign: 'center',
    color: '#4CAF50',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  mapContainer: {
    marginVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  availableContainer: {
    marginBottom: 8,
    backgroundColor: Colors.textWhite,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.gray_100,
  },
  availableCard: {
    marginBottom: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.gray_100,
  },
  cardButtonContainer: {
    position: 'relative',
    top: -40,
    left: 120,
    maxWidth: '65%',
    alignItems: 'flex-end',
    zIndex: 999,
  },
  discount: {
    fontSize: FontSizes.b4.size,
    backgroundColor: Colors.semanticInfo,
    borderRadius: 5,
    padding: 4,
  },
});
