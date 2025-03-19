import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Carousel from '../../components/Carousel';
import { ProductService } from '../../services/products';
import { ProductPresentation } from '../../types/api';

const productsToCarousel = (products: ProductPresentation[]) => {
  return products.map((product) => {
    const name = product.genericName;
    const imageUrl = product.images.length > 0 ? product.images[0].url : '';
    const category =
      product.categories.length > 0 ? product.categories[0].name : '';
    const originalPrice = 100;
    const discount = 10;
    const finalPrice = originalPrice - (originalPrice * discount) / 100;

    return {
      imageUrl,
      name,
      category,
      originalPrice,
      discount,
      finalPrice,
      getQuantity: () => console.log('producto'),
    };
  });
};

export default function HomeScreen() {
  const [products, setProducts] = useState([{}]);

  const productsss = async () => {
    const productsData = await ProductService.getProducts(1, 20);
    console.log(productsData);
    if (productsData.success) {
      const cProducts = productsToCarousel(productsData.data.results);
      setProducts(cProducts);
    } else console.log(productsData.error);
  };

  useEffect(() => {
    productsss();

    setProducts([
      {
        name: 'Medicamento 1',
        category: 'Medicamento',
        originalPrice: 120,
        discount: 20,
        finalPrice: 80,
      },
      {
        name: 'Medicamento 2',
        category: 'Medicamento',
        originalPrice: 120,
        discount: 20,
        finalPrice: 80,
      },
    ]);
  }, []);

  return (
    <View testID="home-screen" style={styles.container}>
      <View>
        <PoppinsText weight="medium" style={styles.title}>
          Ofertas especiales
        </PoppinsText>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Carousel cards={products} />
        </View>
      </View>
      <View>
        <PoppinsText weight="medium" style={styles.title}>
          Medicamentos
        </PoppinsText>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Carousel cards={products} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: Colors.bgColor,
  },
  title: {
    fontSize: FontSizes.s1.size,
    color: Colors.textMain,
    paddingHorizontal: 10,
  },
});
