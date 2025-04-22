import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Importamos useLocalSearchParams
import * as SecureStore from 'expo-secure-store';
import { useCart } from '../../hooks/useCart';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Carousel from '../../components/Carousel';
import { ProductService } from '../../services/products';
import { Product } from '../../types/Product';
import EmailVerificationModal from './EmailVerificationModal';
import { decodeJWT } from '../../helper/jwtHelper';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const router = useRouter();
  const { showEmailVerification: showEmailVerificationParam } =
    useLocalSearchParams();
  const { cartItems, addToCart, updateCartQuantity, setCartUserId } = useCart();

  const getItemQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item.id === productId.toString());
    return cartItem ? cartItem.quantity : 0;
  };

  const obtainProducts = async () => {
    const productsData = await ProductService.getProducts(1, 20);

    if (productsData.success) {
      const pd = productsData.data.results;
      const carouselProducts = pd.map((p) => ({
        id: p.id,
        presentationId: p.presentation.id,
        productId: p.product.id,
        imageUrl: p.product.images[0].url,
        name:
          p.product.name +
          ' ' +
          p.presentation.name +
          ' ' +
          p.presentation.quantity +
          ' ' +
          p.presentation.measurementUnit,
        category: p.product.categories[0].name,
        originalPrice: p.price,
        discount: 10,
        finalPrice: p.price - p.price * 0.1,
        quantity: getItemQuantity(p.id),
        getQuantity: (quantity: number) => {
          addToCart({
            id: p.id,
            name:
              p.product.name +
              ' ' +
              p.presentation.name +
              ' ' +
              p.presentation.quantity +
              ' ' +
              p.presentation.measurementUnit,
            price: p.price,
            quantity,
            image:
              p.product.images?.[0]?.url || 'https://via.placeholder.com/150',
          });
          updateCartQuantity(p.id, quantity);
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
        const decoded = decodeJWT(token);
        if (decoded?.userId) {
          setCartUserId(decoded.userId); // Set the userId in the cart
        }
        setLoading(false);
      }
    };

    checkAuthToken();
    obtainProducts();
  }, [cartItems]);

  useEffect(() => {
    if (showEmailVerificationParam) {
      const timer = setTimeout(() => {
        setShowEmailVerification(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showEmailVerificationParam]);

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
          <View style={styles.rowFullWidth}>
            <Carousel cards={products} />
          </View>
        </View>
        <View>
          <PoppinsText weight="medium" style={styles.title}>
            Medicamentos
          </PoppinsText>
          <View style={styles.rowFullWidth}>
            <Carousel cards={products} />
          </View>
        </View>
      </ScrollView>
      <EmailVerificationModal
        visible={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
      />
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
  rowFullWidth: {
    flexDirection: 'row',
    width: '100%',
  },
});
