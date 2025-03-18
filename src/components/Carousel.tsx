import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ProductCard from './Card';

const { width: screenWidth } = Dimensions.get('window');

type ProductCardType = {
  imageUrl: string;
  name: string;
  category: string;
  originalPrice: string;
  discount: string;
  finalPrice: string;
  getQuantity?: (count: number) => void;
};

type ProductCardProps = {
  cards: ProductCardType[];
};

const Carrusel: React.FC<ProductCardProps> = ({ cards }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.carrusel}
    >
      {cards.map((item, index) => (
        <View key={index} style={styles.card}>
          <ProductCard
            imageUrl={item.imageUrl}
            name={item.name}
            category={item.category}
            originalPrice={item.originalPrice}
            discount={item.discount}
            finalPrice={item.finalPrice}
            getQuantity={item.getQuantity}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carrusel: {
    flex: 1,
  },
  card: {
    width: screenWidth - 150, // Ancho de cada card
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Carrusel;
