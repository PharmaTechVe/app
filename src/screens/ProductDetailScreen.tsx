import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TopBar from '../components/TopBar';
import { useCart } from '../hooks/useCart';
import { Product as CardProduct } from '../types/Product';
import {
  CheckCircleIcon,
  StarIcon,
  ChevronLeftIcon,
} from 'react-native-heroicons/solid';
import { Colors, FontSizes } from '../styles/theme';
import Dropdown from '../components/Dropdown';
import CardButton from '../components/CardButton';
import PoppinsText from '../components/PoppinsText';
import { ProductService } from '../services/products';
import { TruckIcon } from 'react-native-heroicons/outline';
import Carousel from '../components/Carousel';
import { StateService } from '../services/state';
import { State } from '../types/api';
import { InventoryService } from '../services/inventory';
import { useNavigation } from '@react-navigation/native';
import BranchMap from '../components/BranchMap';
import {
  ProductImage,
  ProductPresentationDetailResponse,
  ProductPresentationResponse,
  InventoryResponse,
} from '@pharmatech/sdk';
import Button from '../components/Button';
import { BranchService } from '../services/branches';

const ProductDetailScreen: React.FC = () => {
  const { id, productId } = useLocalSearchParams<{
    id: string;
    productId: string;
  }>();
  const navigation = useNavigation(); // Obtén la instancia de navegación

  const [showMap, setShowMap] = useState(false);
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [product, setProduct] = useState<ProductPresentationDetailResponse>();
  const [images, setImages] = useState<ProductImage[]>();
  const [presentations, setPresentations] =
    useState<ProductPresentationResponse[]>();
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const imagesScrollRef = useRef<ScrollView>(null);
  const discount = 10;
  const router = useRouter();

  const { cartItems, addToCart, getItemQuantity, updateCartQuantity } =
    useCart();

  const getQuantity = (): number => {
    return product?.id ? getItemQuantity(product.id) : 0;
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
        quantity: getItemQuantity(p.product.id),
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
            image: p.product.images[0].url,
          });
          updateCartQuantity(p.id, quantity);
        },
      }));

      setProducts(carouselProducts);
    } else {
      console.log(productsData.error);
    }
  };

  const changeState = async (name: string) => {
    if (!states) return;
    const state = states.find((p) => p.name === name);
    if (state) {
      setSelectedState(state.id);
    }
  };

  const changePresentation = async (description: string) => {
    if (!presentations) return;
    const presentation = presentations.find(
      (p) =>
        product?.product.name +
          ' ' +
          p.presentation.name +
          ' ' +
          p.presentation.quantity +
          ' ' +
          p.presentation.measurementUnit ===
        description,
    );
    if (presentation) {
      router.replace(
        '/products/' +
          productId +
          '/presentation/' +
          presentation.presentation.id,
      );
    }
  };

  useEffect(() => {
    obtainProducts();
  }, [cartItems]);

  useEffect(() => {
    const obtainProduct = async () => {
      const productPresentations =
        await ProductService.getProductPresentations(productId);
      const productImages = await ProductService.getProductImages(productId);
      const productData = await ProductService.getPresentation(productId, id);
      const states = await StateService.getStates(1, 40);

      if (productData.success) setProduct(productData.data);
      if (productImages.success) setImages(productImages.data);
      if (productPresentations.success) {
        const presentations = productPresentations.data.filter(
          (item) => item.presentation.id !== id,
        );
        setPresentations(presentations);
      }
      if (states.success) setStates(states.data?.results || []);
    };

    obtainProduct();
  }, []);

  useEffect(() => {
    const loadBranchesWithStock = async () => {
      if (!selectedState || !product) return;

      setInventory([]); // Limpiar el estado antes de cargar nuevos datos

      try {
        // Obtener las sucursales del estado seleccionado
        const branchesRes = await BranchService.findAll({
          page: 1,
          limit: 100,
          stateId: selectedState,
        });

        const results: InventoryResponse[] = [];

        for (const branch of branchesRes.results) {
          // Obtener el inventario de la sucursal para la presentación del producto
          const inventoryRes = await InventoryService.getBranchInventory({
            branchId: branch.id,
            page: 1,
            limit: 100,
          });

          // Validar que inventoryRes.results sea un array
          if (!Array.isArray(inventoryRes.results)) {
            console.error(
              'inventoryRes.results no es un array:',
              inventoryRes.results,
            );
            continue;
          }

          // Validar que product esté definido
          if (!product || !product.id) {
            console.error(
              'El producto no está definido o no tiene un ID:',
              product,
            );
            continue;
          }

          // Buscar el inventario que coincida con la presentación del producto
          const match = inventoryRes.results.find(
            (inv) =>
              inv.productPresentation &&
              inv.productPresentation.id === product.id,
          );

          if (match && match.stockQuantity > 0) {
            results.push(match); // Agregar directamente el objeto InventoryResponse
          }
        }

        setInventory(results); // Actualizar el estado con los datos obtenidos
      } catch (error) {
        console.error('Error cargando sucursales con stock:', error);
      }
    };

    loadBranchesWithStock();
  }, [selectedState, product]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentImageIndex(newIndex);
  };

  const scrollToImage = (index: number) => {
    setCurrentImageIndex(index);
    if (imagesScrollRef.current) {
      imagesScrollRef.current.scrollTo({
        x: index * width,
        animated: true,
      });
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // Aquí podrías enviar la calificación a tu API
    console.log('Calificación enviada:', rating);
  };

  const RatingStars = () => {
    return (
      <View style={styles.ratingStarsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => handleRating(star)}
            onPressIn={() => setHoverRating(star)}
            onPressOut={() => setHoverRating(0)}
          >
            <StarIcon
              size={32}
              color={
                star <= (hoverRating || userRating)
                  ? Colors.semanticWarning
                  : Colors.gray_100
              }
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  console.log('Current inventory state:', inventory); // Log para inspeccionar el estado de inventory

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <TopBar />
      {/* Botón de volver */}
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Navega a la pantalla anterior
        style={{
          paddingHorizontal: 10,
          marginBottom: -4,
          flexDirection: 'row',
          alignSelf: 'flex-start',
        }}
      >
        <ChevronLeftIcon
          width={20}
          height={20}
          color={Colors.primary}
          style={{ marginRight: 2, marginLeft: 6 }} // Espacio entre el ícono y el texto
        />
        <PoppinsText
          weight="medium"
          style={{
            fontSize: FontSizes.b1.size,
            lineHeight: FontSizes.b1.lineHeight,
            color: Colors.primary,
          }}
        >
          Volver
        </PoppinsText>
      </TouchableOpacity>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Carrusel de imágenes */}
          <ScrollView
            ref={imagesScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {images?.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.url }}
                style={styles.productImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* Indicadores de imágenes */}
          <View style={styles.imageIndicators}>
            {images?.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToImage(index)}
              >
                <View
                  style={[
                    styles.imageIndicator,
                    index === currentImageIndex && styles.activeImageIndicator,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <PoppinsText style={styles.productName}>
            {product ? (
              `${product.product.name} ${product.presentation.name} ${product.presentation.quantity} ${product.presentation.measurementUnit}`
            ) : (
              <ActivityIndicator size="small" color={Colors.primary} />
            )}
          </PoppinsText>

          <RatingStars />
          {userRating > 0 && (
            <PoppinsText style={styles.ratingFeedback}>
              ¡Gracias por tu calificación de {userRating} estrella
              {userRating !== 1 ? 's' : ''}!
            </PoppinsText>
          )}

          <PoppinsText style={styles.description}>
            {product?.presentation.description}
          </PoppinsText>

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <View style={styles.priceRatingContainer}>
              <PoppinsText style={styles.price}>$ {product?.price}</PoppinsText>
              {discount && (
                <PoppinsText style={styles.discount}>-{discount}%</PoppinsText>
              )}
            </View>
            <PoppinsText style={styles.sectionTitle}>
              Selecciona la presentación
            </PoppinsText>
            <View style={styles.quantitySelector}>
              {product ? (
                <Dropdown
                  placeholder={
                    product?.product.name +
                    ' ' +
                    product?.presentation.name +
                    ' ' +
                    product?.presentation.quantity +
                    ' ' +
                    product?.presentation.measurementUnit
                  }
                  options={
                    presentations?.map(
                      (p: ProductPresentationResponse) =>
                        product?.product.name +
                        ' ' +
                        p.presentation.name +
                        ' ' +
                        p.presentation.quantity +
                        ' ' +
                        p.presentation.measurementUnit,
                    ) || []
                  }
                  borderColor={Colors.gray_100}
                  onSelect={(e) => changePresentation(e)}
                />
              ) : (
                <ActivityIndicator size="small" color={Colors.primary} />
              )}
            </View>
            <PoppinsText
              style={[
                styles.sectionTitle,
                { fontSize: FontSizes.s1.size, paddingTop: 15 },
              ]}
            >
              Disponibilidad en sucursales
            </PoppinsText>
            <PoppinsText style={styles.sectionTitle}>
              Selecciona el estado
            </PoppinsText>
            <View style={styles.quantitySelector}>
              <Dropdown
                placeholder="Estado..."
                options={states.map((state) => state.name)}
                borderColor={Colors.gray_100}
                onSelect={(e) => changeState(e)}
              />
            </View>
            <View style={styles.availableContainer}>
              {inventory && inventory.length > 0 ? (
                inventory.map((inv) => (
                  <View key={inv.id} style={styles.availableCard}>
                    <View style={{ padding: 10, paddingHorizontal: 16 }}>
                      <PoppinsText style={styles.sectionTitle}>
                        {inv.branch.name}
                      </PoppinsText>
                      <PoppinsText
                        style={{
                          fontSize: FontSizes.b3.size,
                          color: Colors.textLowContrast,
                        }}
                      >
                        {inv.branch.address}
                      </PoppinsText>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'flex-end',
                        paddingHorizontal: 20,
                      }}
                    >
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <PoppinsText
                          style={{
                            fontSize: FontSizes.c1.size,
                            color: Colors.textLowContrast,
                          }}
                        >
                          {inv.stockQuantity} unidades{' '}
                        </PoppinsText>
                        <CheckCircleIcon
                          size={15}
                          color={Colors.semanticSuccess}
                        />
                      </View>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <TruckIcon size={15} color={Colors.gray_500} />
                        <PoppinsText
                          style={{
                            fontSize: FontSizes.c3.size,
                            color: Colors.gray_500,
                            marginLeft: 5,
                          }}
                        >
                          Envio en menos de 3h
                        </PoppinsText>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <PoppinsText
                  style={{
                    textAlign: 'center',
                    color: Colors.textLowContrast,
                    marginVertical: 10,
                  }}
                >
                  No hay productos disponibles
                </PoppinsText>
              )}
            </View>
            <View style={styles.quantitySelector}>
              {showMap ? (
                <View style={{ flex: 1, height: 300 }}>
                  {inventory && inventory.length > 0 ? (
                    <BranchMap
                      branches={inventory.map((inv) => ({
                        id: inv.branch.id,
                        name: inv.branch.name,
                        address: inv.branch.address,
                        latitude: inv.branch.latitude,
                        longitude: inv.branch.longitude,
                        stockQuantity: inv.stockQuantity,
                      }))}
                    />
                  ) : (
                    <PoppinsText
                      style={{
                        textAlign: 'center',
                        color: Colors.textLowContrast,
                        marginVertical: 10,
                      }}
                    >
                      No hay productos disponibles
                    </PoppinsText>
                  )}
                </View>
              ) : (
                <View style={{ flex: 1, marginVertical: 10 }}>
                  <Button
                    title="Ver Mapa"
                    onPress={() => setShowMap(true)}
                    variant={
                      selectedState && inventory.length > 0
                        ? 'primary'
                        : 'disabled'
                    }
                  />
                </View>
              )}
            </View>
            <PoppinsText style={styles.sectionTitle}>
              Productos relacionados
            </PoppinsText>
            <View style={styles.quantitySelector}>
              <Carousel cards={products} />
            </View>
          </View>
        </ScrollView>

        <View style={styles.cardButtonContainer}>
          <CardButton
            size={10}
            getValue={(quantity) => {
              if (product?.id) updateCartQuantity(product.id, quantity);
            }}
            initialValue={getQuantity()}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  productImage: {
    width: width,
    height: 200,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  activeImageIndicator: {
    backgroundColor: Colors.gray_500,
    width: 17,
  },
  productInfo: {
    padding: 16,
    paddingVertical: 0,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 10,
  },
  productName: {
    textAlign: 'center',
    fontSize: FontSizes.h5.size,
    color: Colors.textMain,
    margin: 20,
  },
  description: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.s2.size,
    color: Colors.textLowContrast,
    marginBottom: 3,
  },
  quantitySelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  starIcon: {
    marginHorizontal: 4,
  },
  ratingFeedback: {
    textAlign: 'center',
    color: '#4CAF50',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  mapContainer: {
    marginVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  availableContainer: {
    marginBottom: 8,
    backgroundColor: Colors.textWhite,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.gray_100,
  },
  availableCard: {
    marginBottom: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.gray_100,
  },
  cardButtonContainer: {
    position: 'relative',
    top: -40,
    left: 120,
    maxWidth: '65%',
    alignItems: 'flex-end',
    zIndex: 999,
  },
  discount: {
    fontSize: FontSizes.b4.size,
    backgroundColor: Colors.semanticInfo,
    borderRadius: 5,
    padding: 4,
  },
});

export default ProductDetailScreen;
