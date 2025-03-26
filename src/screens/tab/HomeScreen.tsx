import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useCart } from '../../hooks/useCart';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Carousel from '../../components/Carousel';
import { ProductService } from '../../services/products';
import { Product } from '../../types/Product';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const { cartItems, addToCart, updateCartQuantity } = useCart();

  const getItemQuantity = (productId: number) => {
    const cartItem = cartItems.find((item) => item.id === productId.toString());
    return cartItem ? cartItem.quantity : 0;
  };

  const obtainProducts = async () => {
    const productsData = await ProductService.getProducts(1, 20);

    if (productsData.success) {
      const pd = productsData.data.results;
      const carouselProducts = pd.map((p) => ({
        id: p.product.id,
        imageUrl: p.product.images[0].url,
        name: p.product.genericName,
        category: p.product.categories[0].name,
        originalPrice: p.price,
        discount: 10,
        finalPrice: p.price - p.price * 0.1,
        quantity: getItemQuantity(p.product.id),
        getQuantity: (quantity: number) => {
          addToCart({
            id: p.product.id,
            name: p.product.genericName,
            price: p.price,
            quantity,
            image: p.product.images[0].url,
          });
          updateCartQuantity(p.product.id, quantity);
        },
      }));

      setProducts(carouselProducts);
    } else {
      console.log(productsData.error);
    }
  };

  useEffect(() => {
    obtainProducts();
  }, [cartItems]);

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
