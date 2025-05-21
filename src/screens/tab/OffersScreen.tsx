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
import OfferCard from '../../components/OfferCardProps';
import { ProductService } from '../../services/products';
import { ProductPresentation } from '../../types/api.d';

export default function OffersScreen() {
  const [offers, setOffers] = useState<ProductPresentation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOffers = async () => {
    setLoading(true);
    const res = await ProductService.getProducts(1, 50);
    if (res.success) {
      const promoItems = res.data.results.filter((item) =>
        // puede venir en item.promo o dentro de item.presentation.promo
        Boolean(
          // @ts-expect-error - promo puede estar en item o en item.presentation
          item.promo?.discount ??
            // @ts-expect-error - promo puede estar en item o en item.presentation
            item.presentation.promo?.discount,
        ),
      );
      setOffers(promoItems);
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

  const renderOffer = ({ item }: ListRenderItemInfo<ProductPresentation>) => {
    // @ts-expect-error: asumimos que existe promo en alguna de estas rutas
    const promo = item.promo ?? item.presentation.promo;
    const discount = promo?.discount ?? 0;
    const finalPrice = item.price * (1 - discount / 100);

    return (
      <OfferCard
        id={item.id}
        presentationId={item.id}
        productId={item.product.id}
        imageUrl={item.product.images[0]?.url}
        name={item.product.genericName ?? item.product.name}
        category={item.product.categories?.[0]?.name ?? ''}
        originalPrice={item.price}
        discount={discount}
        finalPrice={finalPrice}
        getQuantity={() => {}}
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
