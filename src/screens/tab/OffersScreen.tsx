import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Card from '../../components/Card';
import { ProductService } from '../../services/products';
import type { Promo } from '@pharmatech/sdk';
import { isPromoActive } from '../../utils/promoUtils';
import { useCart } from '../../hooks/useCart';

export default function OffersScreen() {
  const { addToCart, updateCartQuantity, getItemQuantity } = useCart();
  const [offers, setOffers] = useState<
    Array<{
      id: string;
      presentationId: string;
      productId: string;
      imageUrl: string;
      name: string;
      category: string;
      originalPrice: number;
      discount: number;
      promo?: Promo;
      finalPrice: number;
      quantity: number;
      getQuantity: (quantity: number) => void;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  function hasPromo(item: {
    [key: string]: unknown;
  }): item is { promo?: Promo } {
    return 'promo' in item && typeof item.promo !== 'undefined';
  }

  const loadOffers = async () => {
    setLoading(true);
    const res = await ProductService.getProducts(1, 50);
    if (res.success) {
      const promoItems = res.data.results.filter(
        (item) => hasPromo(item) && Boolean(item.promo?.discount),
      );

      const mappedPromoItems = promoItems
        .filter((p) => hasPromo(p) && isPromoActive(p.promo))
        .map((p) => {
          const promo: Promo | undefined = hasPromo(p) ? p.promo : undefined;
          const discount: Promo['discount'] = promo?.discount ?? 0;

          return {
            id: p.id,
            presentationId: p.presentation.id,
            productId: p.product.id,
            imageUrl:
              p.product.images?.[0]?.url || 'https://via.placeholder.com/150',
            name:
              p.product.name +
              ' ' +
              p.presentation.name +
              ' ' +
              p.presentation.quantity +
              ' ' +
              p.presentation.measurementUnit,
            category: p.product.categories?.[0]?.name || 'Sin categoría',
            originalPrice: p.price,
            discount,
            promo,
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
                discount,
                promo,
              });
              updateCartQuantity(p.id, quantity, discount, p.price);
            },
          };
        });
      setOffers(mappedPromoItems);
    } else {
      console.error('Error al cargar productos:', res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderOffer = ({
    item,
  }: ListRenderItemInfo<{
    id: string;
    presentationId: string;
    productId: string;
    imageUrl: string;
    name: string;
    category: string;
    originalPrice: number;
    discount: number;
    promo?: Promo;
    finalPrice: number;
    quantity: number;
    getQuantity: (quantity: number) => void;
  }>) => {
    return (
      <Card
        id={item.id}
        presentationId={item.presentationId}
        productId={item.productId}
        imageUrl={item.imageUrl}
        name={item.name}
        category={item.category}
        originalPrice={item.originalPrice}
        discount={item.discount}
        promo={item.promo}
        finalPrice={item.finalPrice}
        quantity={item.quantity}
        getQuantity={item.getQuantity}
      />
    );
  };

  return (
    <View style={styles.container}>
      <PoppinsText weight="medium" style={styles.title}>
        Ofertas especiales
      </PoppinsText>
      {offers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PoppinsText style={styles.emptyText}>
            No hay ofertas disponibles en este momento.
          </PoppinsText>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderOffer}
          columnWrapperStyle={styles.columnWrapper}
          onRefresh={loadOffers}
          refreshing={loading}
        />
      )}
      <View style={styles.height} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: FontSizes.s1.size,
    color: Colors.textMain,
    paddingHorizontal: 15,
  },
  list: {
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
  height: {
    height: 64,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: FontSizes.s1.size,
    color: Colors.textLowContrast,
    textAlign: 'center',
  },
});
