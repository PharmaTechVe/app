// src/screens/tab/OffersScreen.tsx
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

export default function OffersScreen() {
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

      const mappedPromoItems = promoItems.map((p) => {
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
          finalPrice: p.price,
          quantity: 0,
          getQuantity: () => 0,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    paddingLeft: 5,
  },
  title: {
    fontSize: FontSizes.s1.size,
    color: Colors.textMain,
    paddingHorizontal: 15,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
});
