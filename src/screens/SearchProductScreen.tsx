import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import TopBar from '../components/TopBar';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { ProductService } from '../services/products';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/solid';
import FilterOptions from '../components/FilterOptions';
import {
  CategoryResponse,
  ManufacturerResponse,
  PresentationResponse,
  ProductPresentation,
} from '@pharmatech/sdk';
import Checkbox from '../components/Checkbox';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import ProductCard from '../components/Card';
import { CategoryService } from '../services/category';
import { useNavigation } from '@react-navigation/native';

export default function SearchProductScreen() {
  const { query } = useLocalSearchParams<{ query: string }>();

  const [initialSearchResults, setInitialSearchResults] = useState<
    ProductPresentation[]
  >([]); // Almacena los resultados iniciales
  const [search, setSearch] = useState<ProductPresentation[]>([]); // Almacena los resultados actuales (filtrados)
  const [isVisible, setIsVisible] = useState(false);
  const [brands, setBrands] = useState<ManufacturerResponse[]>([]); // Cambiado a ManufacturerResponse
  const [categories, setCategories] = useState<CategoryResponse[]>([]); // Cambiado a CategoryResponse
  const [presentations, setPresentations] = useState<PresentationResponse[]>(
    [],
  );
  const navigation = useNavigation();

  const [selectedPresentations, setSelectedPresentations] = useState<string[]>(
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const priceRange = useState({ min: 0, max: 1000 });

  const handleBrandToggle = (brand: boolean, value: string) => {
    if (brand) {
      setSelectedBrands([...selectedBrands, value]);
    } else {
      setSelectedBrands((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleCategoryToggle = (category: boolean, value: string) => {
    if (category) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((item) => item !== value));
    }
  };

  const handlePresentationToggle = (presentation: boolean, value: string) => {
    if (presentation) {
      setSelectedPresentations([...selectedPresentations, value]);
    } else {
      setSelectedPresentations((prev) => prev.filter((item) => item !== value));
    }
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedPresentations([]);
    setSearch(initialSearchResults); // Restablecer los resultados a los iniciales
  };

  const submitFilters = (range: { min: number; max: number }) => {
    const filteredResults = initialSearchResults.filter((item) => {
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(
          (item.product.manufacturer as ManufacturerResponse).id,
        );

      const matchesCategory =
        selectedCategories.length === 0 ||
        (item.product.categories as CategoryResponse[]).some((category) =>
          selectedCategories.includes(category.id),
        );

      const matchesPresentation =
        selectedPresentations.length === 0 ||
        selectedPresentations.includes(item.presentation.id);

      const matchesPrice = item.price >= range.min && item.price <= range.max; // Usar el rango pasado como argumento

      return (
        matchesBrand && matchesCategory && matchesPresentation && matchesPrice
      );
    });

    setSearch(filteredResults);
  };

  useEffect(() => {
    const fetchSearchData = async () => {
      const searchData = await ProductService.getProducts(1, 20, { q: query });
      const brandsData = await ProductService.getBrands(1, 100);
      const presentationsData = await ProductService.getPresentations(1, 100);
      const categoriesData = await CategoryService.getCategories(1, 100);

      if (searchData.success) {
        setInitialSearchResults(searchData.data.results); // Guardar los resultados iniciales
        setSearch(searchData.data.results); // Mostrar los resultados iniciales
      }
      if (brandsData.success) setBrands(brandsData.data.results);
      if (presentationsData.success)
        setPresentations(presentationsData.data.results);
      if (categoriesData.success) setCategories(categoriesData.data.results);
    };

    fetchSearchData();
  }, []);

  const renderItem: ListRenderItem<ProductPresentation> = ({ item }) => (
    <ProductCard
      id={item.id}
      presentationId={item.presentation.id}
      productId={item.product.id}
      name={
        item.product.name +
        ' ' +
        item.presentation.name +
        ' ' +
        item.presentation.quantity +
        ' ' +
        item.presentation.measurementUnit
      }
      category={item.product.categories[0]?.name}
      imageUrl={item.product.images[0]?.url}
      //originalPrice={item.price}
      //discount={10}
      finalPrice={item.price}
      quantity={10}
      getQuantity={() => console.log}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <TopBar />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          paddingHorizontal: 10,
          marginBottom: -4,
          flexDirection: 'row',
          alignSelf: 'flex-start',
        }}
      >
        <ChevronLeftIcon
          width={20}
          height={20}
          color={Colors.primary}
          style={{ marginRight: 2, marginLeft: 6 }}
        />
        <PoppinsText
          weight="medium"
          style={{
            fontSize: FontSizes.b1.size,
            lineHeight: FontSizes.b1.lineHeight,
            color: Colors.primary,
          }}
        >
          Volver
        </PoppinsText>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
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
      <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
        <PoppinsText>Resultados de la búsqueda: {query}</PoppinsText>
        <PoppinsText style={{ fontSize: FontSizes.c1.size }}>
          {search?.length} resultados
        </PoppinsText>
      </View>
      <FlatList
        data={search}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      />
      <FilterOptions
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onClearFilters={clearFilters}
        onApplyFilters={(range) => {
          priceRange[1](range); // Actualizar el rango de precios
          submitFilters(range); // Aplicar los filtros
        }}
      >
        {/* Filtros */}
        <View style={{ paddingVertical: 10 }}>
          <View>
            <PoppinsText style={styles.text}>Categoría</PoppinsText>
            <View>
              {categories?.map((b) => (
                <Checkbox
                  key={b.id}
                  checked={selectedCategories.includes(b.id)}
                  label={b.name}
                  value={b.id}
                  onChange={(e, val) => handleCategoryToggle(e, val)}
                  style={{ margin: 3 }}
                  size={20}
                />
              ))}
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <PoppinsText style={styles.text}>Marca o Laboratorio</PoppinsText>
            <View>
              {brands?.map((b) => (
                <Checkbox
                  key={b.id}
                  checked={selectedBrands.includes(b.id)}
                  label={b.name}
                  value={b.id}
                  onChange={(e, val) => handleBrandToggle(e, val)}
                  style={{ margin: 3 }}
                  size={20}
                />
              ))}
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <PoppinsText style={styles.text}>Presentación</PoppinsText>
            <View>
              {presentations?.map((b) => (
                <Checkbox
                  key={b.id}
                  checked={selectedPresentations.includes(b.id)}
                  label={b.name + ' ' + b.quantity + ' ' + b.measurementUnit}
                  value={b.id}
                  onChange={(e, val) => handlePresentationToggle(e, val)}
                  style={{ margin: 3 }}
                  size={20}
                />
              ))}
            </View>
          </View>
        </View>
      </FilterOptions>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 20,
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
  text: {
    fontSize: FontSizes.s1.size,
    lineHeight: FontSizes.s1.lineHeight,
    marginBottom: 8,
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
