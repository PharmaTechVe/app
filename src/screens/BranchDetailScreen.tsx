import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BranchService } from '../services/branches';
import { ProductService } from '../services/products'; // Importar el servicio de productos
import { InventoryService } from '../services/inventory'; // Importar el servicio de inventario
import { BranchResponse, ProductPresentation } from '@pharmatech/sdk';
import BranchMapModal from '../components/BranchMapModal';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import { usePagination } from '../hooks/usePagination';

export default function BranchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [branch, setBranch] = useState<BranchResponse | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  const router = useRouter();

  const {
    data: products,
    fetchData,
    loading,
    hasMore,
  } = usePagination<ProductPresentation & { stockQuantity: number }>(
    async (page) => {
      const [productResponse, inventoryResponse] = await Promise.all([
        ProductService.getProducts(page, 10, { branchId: [id!] }),
        InventoryService.getBranchInventory({ page, limit: 10, branchId: id! }),
      ]);

      if (!productResponse.success || !inventoryResponse) {
        return { data: [], next: null };
      }

      // Map inventory stockQuantity to products
      const inventoryMap = new Map(
        inventoryResponse.results.map((item) => [
          item.productPresentation.id,
          item.stockQuantity,
        ]),
      );

      const productsWithStock = productResponse.data.results.map((product) => ({
        ...product,
        stockQuantity: inventoryMap.get(product.id) || 0, // Default to 0 if not found
      }));

      return {
        data: productsWithStock,
        next: productResponse.data.next,
      };
    },
  );

  useEffect(() => {
    if (!id) {
      console.error('El ID de la sucursal no está definido.');
      return;
    }

    const fetchBranchDetails = async () => {
      try {
        const branchData = await BranchService.getById(id);
        setBranch(branchData);
      } catch (error) {
        console.error('Error fetching branch details:', error);
      }
    };

    fetchBranchDetails();
  }, [id]);

  const renderProduct = ({
    item,
  }: {
    item: ProductPresentation & { stockQuantity: number };
  }) => {
    const { product, presentation, stockQuantity } = item;

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
            Cantidad disponible en sucursal: {stockQuantity}
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
      {branch ? (
        <>
          <PoppinsText style={styles.title}>{branch.name}</PoppinsText>
          <PoppinsText style={styles.address}>{branch.address}</PoppinsText>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setMapVisible(true)}
          >
            <PoppinsText style={styles.mapButtonText}>
              Ver en el mapa
            </PoppinsText>
          </TouchableOpacity>
        </>
      ) : (
        <PoppinsText style={styles.loadingText}>
          No se pudo cargar la información de la sucursal.
        </PoppinsText>
      )}
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
      {branch && (
        <BranchMapModal
          visible={mapVisible}
          onClose={() => setMapVisible(false)}
          branchName={branch.name}
          branchCoordinates={{
            latitude: branch.latitude,
            longitude: branch.longitude,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 16,
  },
  title: {
    fontSize: FontSizes.h4.size,
    color: Colors.textMain,
    marginBottom: 10,
  },
  address: {
    fontSize: FontSizes.b2.size,
    color: Colors.textLowContrast,
    marginBottom: 20,
  },
  mapButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
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
