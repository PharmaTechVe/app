import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ProductCard from './Card';
import { Product } from '../types/Product';

const { width: screenWidth } = Dimensions.get('window');

type CarouselProps = {
  cards: Product[];
};

const Carousel: React.FC<CarouselProps> = ({ cards }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      style={styles.carrusel}
    >
      {cards.map((item, index) => (
        <View key={index} style={styles.card}>
          <ProductCard key={index} {...item} />
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
    width: screenWidth - 205, // Ancho de cada card
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Carousel;
