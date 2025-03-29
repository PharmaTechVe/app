import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import TopBar from '../components/TopBar';
import { StarIcon } from 'react-native-heroicons/solid';
import { Colors, FontSizes } from '../styles/theme';
import Dropdown from '../components/Dropdown';
import CardButton from '../components/CardButton';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  images: string[];
  colors: string[];
  sizes: string[];
};

const ProductDetailScreen: React.FC = () => {
  const [userRating, setUserRating] = useState<number>(0); // 0 significa no calificado
  const [hoverRating, setHoverRating] = useState<number>(0); // Para efecto hover

  // Datos de ejemplo del producto
  const product: Product = {
    id: '1',
    name: 'Zapatillas Running Premium',
    price: 129.99,
    description:
      'Zapatillas de running con tecnología de amortiguación avanzada para mayor comodidad y rendimiento. Ideal para corredores que buscan soporte y ligereza.',
    rating: 4.8,
    images: [
      'https://wallpapers.com/images/featured/imagenes-lindas-para-perfil-estetico-r521rmfa6ucixtw5.jpg',
      'https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/color-fondo-imagen-r.png',
      'https://img.freepik.com/vector-gratis/cute-cool-boy-dabbing-pose-dibujos-animados-vector-icono-ilustracion-concepto-icono-moda-personas-aislado_138676-5680.jpg',
    ],
    colors: ['#000000', '#FF0000', '#1E90FF'],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
  };

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
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
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
              <View key={index} style={styles.imageIndicator} />
            ))}
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <RatingStars />
          {userRating > 0 && (
            <Text style={styles.ratingFeedback}>
              ¡Gracias por tu calificación de {userRating} estrella
              {userRating !== 1 ? 's' : ''}!
            </Text>
          )}

          <Text style={styles.description}>{product.description}</Text>

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <View style={styles.priceRatingContainer}>
              <Text style={styles.price}>Bs {product.price.toFixed(2)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Selecciona la presentación</Text>
            <View style={styles.quantitySelector}>
              <Dropdown
                options={['A', 'B', 'c']}
                onSelect={() => console.log('p')}
              />
            </View>
          </View>
        </ScrollView>

        {/* Botón de agregar al carrito */}
        <View style={styles.footer}>
          <CardButton initialValue={0} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  productImage: {
    width: width,
    height: width,
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
  productInfo: {
    padding: 16,
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
    marginBottom: 20,
  },
  description: {
    fontSize: FontSizes.b3.size,
    color: Colors.textLowContrast,
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.s1.size,
    color: Colors.textLowContrast,
    marginBottom: 3,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  sizeOption: {
    width: 60,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedSizeOption: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  sizeText: {
    color: '#333333',
  },
  selectedSizeText: {
    color: '#FFFFFF',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 20,
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
});

export default ProductDetailScreen;
