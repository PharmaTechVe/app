import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import TopBar from '../components/TopBar';
import { CheckCircleIcon, StarIcon } from 'react-native-heroicons/solid';
import { Colors, FontSizes } from '../styles/theme';
import Dropdown from '../components/Dropdown';
import CardButton from '../components/CardButton';
import PoppinsText from '../components/PoppinsText';
import { ProductService } from '../services/products';
import { TruckIcon } from 'react-native-heroicons/outline';
//import Carousel from '../components/Carousel';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  images: string[];
};

const ProductDetailScreen: React.FC = () => {
  const [userRating, setUserRating] = useState<number>(0); // 0 significa no calificado
  const [hoverRating, setHoverRating] = useState<number>(0); // Para efecto hover
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const imagesScrollRef = useRef<ScrollView>(null);

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

  // Datos de ejemplo del producto
  const product: Product = {
    id: '1',
    name: 'Acetaminofen 650mg Genven Caja x 10 tabletas',
    price: 129.99,
    description:
      'Zapatillas de running con tecnología de amortiguación avanzada.',
    rating: 4.8,
    images: [
      'https://wallpapers.com/images/featured/imagenes-lindas-para-perfil-estetico-r521rmfa6ucixtw5.jpg',
      'https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/color-fondo-imagen-r.png',
      'https://img.freepik.com/vector-gratis/cute-cool-boy-dabbing-pose-dibujos-animados-vector-icono-ilustracion-concepto-icono-moda-personas-aislado_138676-5680.jpg',
    ],
  };

  useEffect(() => {
    const obtainProducts = async () => {
      const productsData = await ProductService.getProduct(1);

      if (productsData.success) {
        console.log(productsData);
      } else {
        console.log(productsData.error);
      }
    };
    obtainProducts();
  }, []);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // Aquí podrías enviar la calificación a tu API
    console.log('Calificación enviada:', rating);
  };

  // Componente de estrellas de calificación
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
                star <= (hoverRating || userRating) ? '#FFD700' : '#CCCCCC'
              }
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar />
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
            {product.images.map((image, index) => (
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
            {product.images.map((_, index) => (
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

          <PoppinsText style={styles.productName}>{product.name}</PoppinsText>

          <RatingStars />
          {userRating > 0 && (
            <Text style={styles.ratingFeedback}>
              ¡Gracias por tu calificación de {userRating} estrella
              {userRating !== 1 ? 's' : ''}!
            </Text>
          )}

          <PoppinsText style={styles.description}>
            {product.description}
          </PoppinsText>

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <View style={styles.priceRatingContainer}>
              <PoppinsText style={styles.price}>
                Bs {product.price.toFixed(2)}
              </PoppinsText>
            </View>
            <PoppinsText style={styles.sectionTitle}>
              Selecciona la presentación
            </PoppinsText>
            <View style={styles.quantitySelector}>
              <Dropdown
                placeholder="Presentación..."
                options={['A', 'B', 'c']}
                borderColor={Colors.gray_100}
                onSelect={() => console.log('p')}
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
              <View style={styles.mapContainer}>
                <Image
                  source={{
                    uri: 'https://s3-alpha-sig.figma.com/img/e1d4/243c/e04ae0848573e5aec930a59844b09c9d?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=FXKYpecuImVVY6u2fXMUb9gNHckqHMuudCo5P2d8nKpcX4UOIDviLX9axkku~lqIwrFxFrrwi-K1SfHW9Ptvp1YCeRMuw12APbec9X45pxjdXxZZ7B--elUAPERCWzJXmX3WSxW~YIYfqMtK6Ld~3w4JXKif0ajl9zkzojgF-ZxGsddzhXL3Th~tgIrzCy3Nmv5tNFClXiweA3weh~tnqR3xKhsqr0YmPWihV24a40aDrQw-Qk1ilxuDYwZJ3sChx8TPXPIeM3K0dsjGkENGbHmqe5qHt4UWce1PGpPs4TnaCl~DmwdgIYRZP3TywbDsNZbXR9OQdFTB2EToVFmFvQ__',
                  }}
                  style={{ width: 300, height: 300, borderRadius: 5 }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <PoppinsText style={styles.sectionTitle}>
              Selecciona el estado
            </PoppinsText>
            <View style={styles.quantitySelector}>
              <Dropdown
                placeholder="Estado..."
                options={['Lara', 'Anzoategui', 'Caracas']}
                borderColor={Colors.gray_100}
                onSelect={() => console.log('p')}
              />
            </View>
            <View style={styles.availableContainer}>
              <View style={styles.availableCard}>
                <View style={{ padding: 10, paddingHorizontal: 16 }}>
                  <PoppinsText style={styles.sectionTitle}>
                    Pharmatech Sambil Barquisimeto
                  </PoppinsText>
                  <PoppinsText
                    style={{
                      fontSize: FontSizes.b3.size,
                      color: Colors.textLowContrast,
                    }}
                  >
                    Av. Venezuela con Av. Bracamonte
                  </PoppinsText>
                </View>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'flex-end',
                    paddingHorizontal: 20,
                  }}
                >
                  <PoppinsText
                    style={{
                      fontSize: FontSizes.c1.size,
                      color: Colors.textLowContrast,
                    }}
                  >
                    150 unidades{' '}
                    <CheckCircleIcon size={15} color={Colors.semanticSuccess} />
                  </PoppinsText>
                  <PoppinsText
                    style={{
                      fontSize: FontSizes.c3.size,
                      color: Colors.gray_500,
                    }}
                  >
                    <TruckIcon size={15} color={Colors.gray_500} /> Envio en
                    menos de 3h
                  </PoppinsText>
                </View>
              </View>
            </View>
            <PoppinsText style={styles.sectionTitle}>
              Productos relacionados
            </PoppinsText>
            <View style={styles.quantitySelector}>
              {/* <Carousel cards={} /> */}
            </View>
          </View>
        </ScrollView>

        <View style={styles.cardButtonContainer}>
          <CardButton initialValue={0} size={10} />
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
    height: 250,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#666666',
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
    lineHeight: 24,
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
  footer: {
    flexDirection: 'row-reverse',
    padding: 16,
    backgroundColor: '',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
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
});

export default ProductDetailScreen;
