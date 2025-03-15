import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

interface ProductCardProps {
  name: string;
  originalPrice: string;
  discount: string;
  finalPrice: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  originalPrice,
  discount,
  finalPrice,
}) => {
  return (
    <View style={styles.card}>
      <View
        style={{
          width: '100%',
          height: 160,
          backgroundColor: Colors.secondaryGray,
        }}
      ></View>
      <PoppinsText style={styles.name}>{name}</PoppinsText>
      <View style={styles.priceContainer}>
        <PoppinsText style={styles.originalPrice}>${originalPrice}</PoppinsText>
        <PoppinsText style={styles.discount}>{discount}%</PoppinsText>
      </View>
      <PoppinsText style={styles.finalPrice}>${finalPrice}</PoppinsText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: FontSizes.c1.size,
    backgroundColor: Colors.semanticInfo,
    borderRadius: 5,
    padding: 3,
  },
  finalPrice: {
    fontSize: 20,
  },
});

export default ProductCard;
