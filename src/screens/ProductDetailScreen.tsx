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
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
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
import { Inventory, State } from '../types/api';
import { InventoryService } from '../services/inventory';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import BranchMap from '../components/BranchMap';

type Product = {
  id: string;
  name: string;
  description: string;
  rating: number;
  discount: number;
  presentation: { id: string; description: string; price: number }[];
  images: string[];
};

const ProductDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation(); // Obtén la instancia de navegación

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [product, setProduct] = useState<Product>();
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const imagesScrollRef = useRef<ScrollView>(null);

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

  const changePresentation = (description: string) => {
    const presentation = product?.presentation.find(
      (p) => p.description === description,
    );
    if (presentation && 'price' in presentation)
      setCurrentPrice(presentation.price);
  };

  useEffect(() => {
    obtainProducts();
  }, [cartItems]);

  useEffect(() => {
    const obtainProducts = async () => {
      const productsData = await ProductService.getProduct(id);
      const states = await StateService.getStates(1, 40);

      if (states.success) {
        setStates(states.data.results);
      }

      if (productsData.success) {
        setProduct({
          id: productsData.data.id,
          name: productsData.data.name,
          description: productsData.data.description,
          rating: productsData.data.rating,
          images: productsData.data.images.map(
            (image: { url: string }) => image.url,
          ),
          discount: 10,
          presentation: productsData.data.presentation.map(
            (presentation: {
              id: string;
              presentation: { description: string };
              price: number;
            }) => ({
              id: presentation.id,
              description: presentation.presentation.description,
              price: presentation.price,
            }),
          ),
        });

        setCurrentPrice(productsData.data.presentation[0].price);
      } else {
        console.log(productsData.error);
      }
    };

    obtainProducts();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      if (product?.presentation) {
        for (const p of product.presentation) {
          const inventoryData = await InventoryService.getPresentationInventory(
            1,
            20,
            p.id || '',
          );
          if (inventoryData.success) {
            const newInventory = inventoryData.data.results.map((inv) => ({
              id: inv.id,
              branch: {
                id: inv.branch.id,
                name: inv.branch.name,
                address: inv.branch.address,
                latitude: inv.branch.latitude,
                longitude: inv.branch.longitude,
              },
              stockQuantity: inv.stockQuantity, // Mover al nivel superior
            }));

            setInventory((prevInventory) => {
              const updatedInventory = [...prevInventory];
              newInventory.forEach((newItem) => {
                if (!prevInventory.some((item) => item.id === newItem.id)) {
                  updatedInventory.push(newItem);
                }
              });
              return updatedInventory;
            });
          } else {
            console.error(inventoryData.error);
          }
        }
      }
    };
    fetchInventory();
  }, [product]);

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
          alignItems: 'center',
        }}
      >
        <ChevronLeftIcon
          width={16}
          height={16}
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
            {product?.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* Indicadores de imágenes */}
          <View style={styles.imageIndicators}>
            {product?.images.map((_, index) => (
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

          <PoppinsText style={styles.productName}>{product?.name}</PoppinsText>

          <RatingStars />
          {userRating > 0 && (
            <PoppinsText style={styles.ratingFeedback}>
              ¡Gracias por tu calificación de {userRating} estrella
              {userRating !== 1 ? 's' : ''}!
            </PoppinsText>
          )}

          <PoppinsText style={styles.description}>
            {product?.description}
          </PoppinsText>

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <View style={styles.priceRatingContainer}>
              <PoppinsText style={styles.price}>$ {currentPrice}</PoppinsText>
              {product?.discount && (
                <PoppinsText style={styles.discount}>
                  -{product.discount}%
                </PoppinsText>
              )}
            </View>
            <PoppinsText style={styles.sectionTitle}>
              Selecciona la presentación
            </PoppinsText>
            <View style={styles.quantitySelector}>
              <Dropdown
                placeholder="Presentación..."
                options={
                  product?.presentation.map(
                    (p: { description: string }) => p.description,
                  ) || []
                }
                borderColor={Colors.gray_100}
                onSelect={(e) => changePresentation(e)}
              />
            </View>
            <PoppinsText
              style={[
                styles.sectionTitle,
                { fontSize: FontSizes.s1.size, paddingTop: 15 },
              ]}
            >
              Disponibilidad en sucursales
            </PoppinsText>
            <View style={styles.quantitySelector}>
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
            </View>
            <PoppinsText style={styles.sectionTitle}>
              Selecciona el estado
            </PoppinsText>
            <View style={styles.quantitySelector}>
              <Dropdown
                placeholder="Estado..."
                options={states.map((state) => state.name)}
                borderColor={Colors.gray_100}
                onSelect={() => console.log('p')}
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
    marginVertical: 15,
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
