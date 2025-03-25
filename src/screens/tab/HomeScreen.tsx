import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Carousel from '../../components/Carousel';
import { ProductService } from '../../services/products';

export default function HomeScreen() {
  const [products, setProducts] = useState([{}]);
  const dispatch = useDispatch();

  const obtainProducts = async () => {
    const productsData = await ProductService.getProducts(1, 20);

    if (productsData.success) {
      const pd = productsData.data.results;
      const carouselProducts: object[] = [];

      pd.forEach((p) => {
        carouselProducts.push({
          id: p.product.id, // Product id
          imageUrl: p.product.images[0].url,
          name: p.product.genericName,
          category: p.product.categories[0].name,
          originalPrice: p.price,
          discount: 10,
          finalPrice: p.price - p.price * 0.1,
          getQuantity: (quantity: number) => {
            // Update cart
            dispatch(
              addItem({
                id: p.product.id,
                name: p.product.genericName,
                price: p.price,
                quantity,
                image: p.product.images[0].url,
              }),
            );
          },
        });
      });

      setProducts(carouselProducts);
    } else console.log(productsData.error);
  };

  useEffect(() => {
    obtainProducts();
  }, []);

  return (
    <View testID="home-screen" style={styles.container}>
      <ScrollView>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: Colors.bgColor,
    paddingLeft: 5,
  },
  title: {
    fontSize: FontSizes.s1.size,
    color: Colors.textMain,
    paddingHorizontal: 15,
  },
});
