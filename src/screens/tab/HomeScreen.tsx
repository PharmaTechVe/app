import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCart } from '../../hooks/useCart';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Carousel from '../../components/Carousel';
import { ProductService } from '../../services/products';
import { Product } from '../../types/Product';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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
        name: p.product.name,
        category: p.product.categories[0].name,
        originalPrice: p.price,
        discount: 10,
        finalPrice: p.price - p.price * 0.1,
        quantity: getItemQuantity(p.product.id),
        getQuantity: (quantity: number) => {
          addToCart({
            id: p.product.id,
            name: p.product.name,
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
    const checkAuthToken = async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        router.replace('/login'); // Redirige al login si no hay token
      } else {
        console.log('JWT Token:', token); // Log del JWT
        setLoading(false);
      }
    };

    checkAuthToken();
    obtainProducts();
  }, [cartItems]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <PoppinsText weight="regular" style={styles.loadingText}>
          Verificando autenticación...
        </PoppinsText>
      </View>
    );
  }

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
    backgroundColor: Colors.bgColor,
    paddingLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
  loadingText: {
    marginTop: 10,
    fontSize: FontSizes.b1.size,
    color: Colors.textLowContrast,
  },
  title: {
    fontSize: FontSizes.s1.size,
    color: Colors.textMain,
    paddingHorizontal: 15,
  },
});
