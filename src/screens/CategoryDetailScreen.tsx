import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProductService } from '../services/products';
import { CategoryResponse, ProductPresentation } from '@pharmatech/sdk';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { usePagination } from '../hooks/usePagination';
import { CategoryService } from '../services/category';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [category, setCategory] = useState<CategoryResponse | null>(null);

  const router = useRouter();

  const {
    data: products,
    fetchData,
    loading,
    hasMore,
  } = usePagination<ProductPresentation>(async (page) => {
    const productResponse = await ProductService.getProducts(page, 10, {
      categoryId: [id!],
    });

    if (!productResponse.success) {
      return { data: [], next: null };
    }

    return {
      data: productResponse.data.results,
      next: productResponse.data.next,
    };
  });

  useEffect(() => {
    if (!id) {
      console.error('El ID de la categoria no está definido.');
      return;
    }

    const fetchCategoryDetails = async () => {
      try {
        const categoryData = await CategoryService.getById(id);
        setCategory(categoryData);
      } catch (error) {
        console.error('Error fetching category details:', error);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const renderProduct = ({ item }: { item: ProductPresentation }) => {
    const { product, presentation, stock } = item;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          router.push(`/products/${product.id}/presentation/${presentation.id}`)
        }
      >
        <Image
          source={{
            uri: product.images?.[0]?.url || 'https://via.placeholder.com/60',
          }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <PoppinsText style={styles.productName}>
            {product.name || 'Nombre no disponible'} {presentation.name}{' '}
            {presentation.quantity} {presentation.measurementUnit}
          </PoppinsText>
          <PoppinsText style={styles.productQuantity}>
            Cantidad disponible: {stock || 0}
          </PoppinsText>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <PoppinsText style={styles.loadingText}>Cargando...</PoppinsText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {category ? (
        <>
          <PoppinsText style={styles.title}>{category.name}</PoppinsText>
        </>
      ) : (
        <PoppinsText style={styles.loadingText}>
          No se pudo cargar la información de la categoria.
        </PoppinsText>
      )}
      <View style={styles.divider} />
      <PoppinsText style={styles.titleAddress}>
        Productos disponibles en {category?.name || 'la categoria'}
      </PoppinsText>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        onEndReached={hasMore ? fetchData : null}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading ? (
            <PoppinsText style={styles.emptyText}>
              No hay productos disponibles.
            </PoppinsText>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 16,
    paddingTop: 52,
  },
  title: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
    marginBottom: 8,
  },
  titleAddress: {
    fontSize: FontSizes.s2.size,
    lineHeight: FontSizes.s2.lineHeight,
    color: Colors.primary,
    marginBottom: 4,
  },
  address: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.textLowContrast,
    marginBottom: 12,
  },
  map: {
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.b2.lineHeight,
    color: Colors.primary,
    marginBottom: 4,
  },
  mapButton: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.stroke,
  },
  mapButtonText: {
    color: Colors.textWhite,
    textAlign: 'center',
    fontSize: FontSizes.b1.size,
  },
  list: {
    marginTop: 10,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.menuWhite,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: FontSizes.b1.size,
    color: Colors.textMain,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: FontSizes.c1.size,
    color: Colors.textLowContrast,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textLowContrast,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.b1.size,
    color: Colors.textLowContrast,
  },
});
