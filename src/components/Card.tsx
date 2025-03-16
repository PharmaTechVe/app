import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';
import CardButton from './CardButton';

interface ProductCardProps {
  name: string;
  category?: string;
  originalPrice: string;
  discount?: string;
  finalPrice?: string;
  getQuantity?: (count: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  originalPrice,
  discount,
  finalPrice,
  getQuantity,
}) => {
  return (
    <View style={styles.card}>
      <View
        style={{
          width: '100%',
          height: 160,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row-reverse',
          }}
        >
          <PoppinsText
            style={{
              backgroundColor: Colors.semanticInfo,
              borderRadius: 50,
              paddingHorizontal: 9,
              color: Colors.textWhite,
              fontSize: FontSizes.c2.size,
              maxWidth: '65%',
            }}
          >
            {category}
          </PoppinsText>
        </View>
        <View
          style={{
            backgroundColor: Colors.secondaryGray,
            minHeight: 140,
            maxHeight: 140,
            borderRadius: 15,
            marginVertical: 8,
          }}
        >
          <View
            style={{
              position: 'relative',
              top: 105,
              left: 70,
              backgroundColor: 'red',
              maxWidth: '60%',
              justifyContent: 'flex-end',
            }}
          >
            <CardButton getValue={getQuantity} />
          </View>
        </View>
      </View>
      <View style={styles.description}>
        <PoppinsText style={styles.name}>{name}</PoppinsText>
        {discount && (
          <View style={styles.priceContainer}>
            <PoppinsText style={styles.originalPrice}>
              ${originalPrice}
            </PoppinsText>
            <PoppinsText style={styles.discount}>{discount}%</PoppinsText>
          </View>
        )}
        <PoppinsText
          style={[
            styles.finalPrice,
            !discount && { color: Colors.semanticInfo },
          ]}
        >
          ${finalPrice}
        </PoppinsText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    maxWidth: 190,
    minWidth: 190,
  },
  description: {
    marginHorizontal: 4,
  },
  name: {
    fontSize: 18,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.disableText,
    textDecorationLine: 'line-through',
    marginRight: 18,
  },
  discount: {
    fontSize: FontSizes.c1.size,
    backgroundColor: Colors.semanticInfo,
    borderRadius: 5,
    padding: 5,
  },
  finalPrice: {
    fontSize: 20,
  },
});

export default ProductCard;
