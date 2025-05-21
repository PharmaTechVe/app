import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCart } from '../../hooks/useCart';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Carousel from '../../components/Carousel';
import { ProductService } from '../../services/products';
import { Product } from '../../types/Product';
import type { Promo } from '@pharmatech/sdk';
import EmailVerificationModal from './EmailVerificationModal';
import { decodeJWT } from '../../helper/jwtHelper';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const router = useRouter();
  const { showEmailVerification: showEmailVerificationParam } =
    useLocalSearchParams();
  const { cartItems, addToCart, updateCartQuantity, setCartUserId } = useCart();

  const getItemQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item.id === productId.toString());
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        router.replace('/login');
      } else {
        const decoded = decodeJWT(token);
        if (decoded?.userId) {
          setCartUserId(decoded.userId);
        }
      }

      await obtainProducts();
      await obtainRecommendedProducts();
      setLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (showEmailVerificationParam) {
      const timer = setTimeout(() => {
        setShowEmailVerification(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showEmailVerificationParam]);

  const obtainProducts = async () => {
    setLoading(true);
    try {
      const productsData = await ProductService.getProducts(1, 20);
      if (productsData.success) {
        const pd = productsData.data.results;
        const carouselProducts = pd.map((p) => {
          // Usa el descuento real si hay promo, si no, no lo agregues
          // @ts-expect-error: promo puede estar en p o en p.presentation
          const promo: Promo | undefined = p.promo ?? p.presentation.promo;
          const discount: Promo['discount'] | undefined = promo?.discount
            ? Math.round(promo.discount * 100) / 100
            : undefined;
          return {
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
            ...(discount !== undefined ? { discount } : {}),
            finalPrice: p.price,
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
                  p.product.images?.[0]?.url ||
                  'https://via.placeholder.com/150',
              });
              updateCartQuantity(p.id, quantity);
            },
          };
        });

        setProducts(carouselProducts);
      } else {
        console.log(productsData.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtainRecommendedProducts = async () => {
    setLoadingRecommendations(true);
    try {
      const recommendations = await ProductService.getRecommendations();
      const carouselRecommendations = recommendations.results.map((p) => {
        // Usa el descuento real si hay promo, si no, no lo agregues
        // @ts-expect-error: promo puede estar en p o en p.presentation
        const promo: Promo | undefined = p.promo ?? p.presentation.promo;
        const discount: Promo['discount'] | undefined = promo?.discount
          ? Math.round(promo.discount * 100) / 100
          : undefined;
        return {
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
          category: p.product.categories[0]?.name || 'Sin categoría',
          originalPrice: p.price,
          ...(discount !== undefined ? { discount } : {}),
          finalPrice: p.price,
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
        };
      });

      setRecommendedProducts(carouselRecommendations);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  return (
    <View testID="home-screen" style={styles.container}>
      <ScrollView>
        <View>
          <PoppinsText weight="medium" style={styles.title}>
            Ofertas especiales
          </PoppinsText>
          <View style={styles.rowFullWidth}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <PoppinsText style={styles.loadingText}>
                  Cargando ofertas...
                </PoppinsText>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <Carousel cards={products} />
            )}
          </View>
        </View>
        <View>
          <PoppinsText weight="medium" style={styles.title}>
            Medicamentos
          </PoppinsText>
          <View style={styles.rowFullWidth}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <PoppinsText style={styles.loadingText}>
                  Cargando medicamentos...
                </PoppinsText>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <Carousel cards={products} />
            )}
          </View>
        </View>
        <View>
          <PoppinsText weight="medium" style={styles.title}>
            Recomendados para ti
          </PoppinsText>
          <View style={styles.rowFullWidth}>
            {loadingRecommendations ? (
              <View style={styles.loadingContainer}>
                <PoppinsText style={styles.loadingText}>
                  Cargando recomendaciones...
                </PoppinsText>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <Carousel cards={recommendedProducts} />
            )}
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
