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
        <View style={styles.imageTagWrapper}>
          <View style={styles.tagRow}>
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
    paddingBottom: 5,
    marginBottom: 16,
    maxWidth: 140,
    minWidth: 140,
    minHeight: 315,
    maxHeight: 315,
  },
  imageTagWrapper: {
    width: '100%',
    height: 135,
    marginBottom: 30,
  },
  tagRow: {
    width: '100%',
    flexDirection: 'row-reverse',
  },
  tag: {
    backgroundColor: Colors.semanticInfo,
    borderRadius: 50,
    paddingHorizontal: 9,
    color: Colors.textWhite,
    fontSize: FontSizes.c3.size,
    maxWidth: '100%',
  },
  imageContainer: {
    minHeight: 118,
    maxHeight: 118,
    maxWidth: 114,
    borderRadius: 15,
    marginVertical: 8,
  },
  image: {
    width: 114,
    height: 118,
    borderRadius: 14,
  },
  cardButtonContainer: {
    position: 'relative',
    top: -30,
    left: 58,
    maxWidth: '65%',
    alignItems: 'flex-end',
    zIndex: 999,
  },
  description: {
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  name: {
    fontSize: FontSizes.s2.size,
    marginBottom: 6,
    minHeight: 70,
    maxHeight: 70,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: FontSizes.b1.size,
    color: Colors.disableText,
    textDecorationLine: 'line-through',
    marginRight: 14,
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
    fontWeight: 'medium',
    color: Colors.textMain,
  },
});

export default OfferCard;
