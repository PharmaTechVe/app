import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';
import CardButton from './CardButton';
import { truncateString } from '../utils/commons';
import { useCart } from '../hooks/useCart';
import { Product } from '../types/Product';
import { useRouter } from 'expo-router';

const ProductCard: React.FC<Product> = ({
  id,
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
    <TouchableOpacity onPress={() => router.replace('/products/' + id)}>
      <View style={styles.card}>
        <View
          style={{
            width: '100%',
            height: 135,
            marginBottom: 30,
          }}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row-reverse',
            }}
          >
            <PoppinsText style={styles.tag}>{category}</PoppinsText>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              width={114}
              height={118}
              style={{ borderRadius: 14 }}
            />
            <View style={styles.cardButtonContainer}>
              <CardButton
                getValue={(quantity) => {
                  if (getQuantity) getQuantity(quantity);
                  updateCartQuantity(id, quantity);
                }}
                initialValue={getItemQuantity(id)}
              />
            </View>
          </View>
        </View>
        <View style={styles.description}>
          <PoppinsText style={styles.name}>{truncateString(name)}</PoppinsText>
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
    minHeight: 270,
    maxHeight: 300,
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
  discount: {
    fontSize: FontSizes.c1.size,
    backgroundColor: Colors.semanticInfo,
    borderRadius: 5,
    padding: 4,
  },
  finalPrice: {
    fontSize: FontSizes.s1.size,
  },
});

export default ProductCard;
