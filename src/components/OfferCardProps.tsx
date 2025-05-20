// src/components/OfferCard.tsx

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';
import CardButton from './CardButton';
import { truncateString } from '../utils/commons';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'expo-router';

export interface OfferCardProps {
  id: string;
  presentationId: string;
  productId: string;
  imageUrl: string;
  name: string;
  category: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  getQuantity?: (qty: number) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  id,
  presentationId,
  productId,
  imageUrl,
  name,
  category,
  originalPrice,
  discount,
  finalPrice,
  getQuantity,
}) => {
  const { getItemQuantity, updateCartQuantity } = useCart();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(`/products/${productId}/presentation/${presentationId}`)
      }
    >
      <View style={styles.card}>
        <View style={styles.tagContainer}>
          <PoppinsText style={styles.tag}>{category}</PoppinsText>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.cardButtonContainer}>
            <CardButton
              getValue={(qty) => {
                getQuantity?.(qty);
                updateCartQuantity(id, qty);
              }}
              initialValue={getItemQuantity(id)}
            />
          </View>
        </View>

        <View style={styles.description}>
          <PoppinsText style={styles.name}>
            {truncateString(name, 25)}
          </PoppinsText>

          <View style={styles.priceContainer}>
            <PoppinsText style={styles.originalPrice}>
              ${originalPrice.toFixed(2)}
            </PoppinsText>
            <PoppinsText style={styles.discountBadge}>
              {discount.toFixed(0)}%
            </PoppinsText>
          </View>
          <PoppinsText style={styles.finalPrice}>
            ${finalPrice.toFixed(2)}
          </PoppinsText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: Colors.menuWhite,
    borderWidth: 1,
    borderColor: Colors.gray_100,
    borderRadius: 15,
    padding: 10,
    maxWidth: 140,
    minWidth: 140,
    minHeight: 340,
  },
  tagContainer: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: Colors.semanticInfo,
    borderRadius: 50,
    paddingHorizontal: 9,
    color: Colors.textWhite,
    fontSize: FontSizes.c3.size,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 114,
    height: 118,
    borderRadius: 14,
  },
  cardButtonContainer: {
    position: 'absolute',
    bottom: -15,
    right: 8,
    zIndex: 2,
  },
  description: {
    marginHorizontal: 2,
  },
  name: {
    fontSize: FontSizes.s2.size,
    marginBottom: 6,
    minHeight: 50,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: FontSizes.b1.size,
    color: Colors.disableText,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountBadge: {
    fontSize: FontSizes.c1.size,
    backgroundColor: Colors.semanticInfo,
    borderRadius: 4,
    paddingHorizontal: 4,
    color: Colors.textWhite,
  },
  finalPrice: {
    fontSize: FontSizes.s1.size,
    fontWeight: 'bold',
    color: Colors.gray_500,
  },
});

export default OfferCard;
