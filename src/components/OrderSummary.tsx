import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCart } from '../hooks/useCart';
import PoppinsText from './PoppinsText';
import { Colors, FontSizes } from '../styles/theme';
import type { CartItem } from '../redux/slices/cartSlice';
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/outline';

const OrderSummary = () => {
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity * 0.1),
    0,
  );

  const renderItem = ({ item }: { item: CartItem }) => {
    const discount = 10;
    const discountedPrice = item.price * (1 - discount / 100);
    const totalDiscountedPrice = discountedPrice * item.quantity;
    const totalOriginalPrice = item.price * item.quantity;

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <View style={styles.discountBadge}>
            <PoppinsText style={styles.discountBadgeText}>
              -{discount}%
            </PoppinsText>
          </View>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <PoppinsText style={styles.productName}>{item.name}</PoppinsText>
            <PoppinsText style={styles.productTotalPrice}>
              ${totalDiscountedPrice.toFixed(2)}
            </PoppinsText>
          </View>
          <PoppinsText style={styles.productOriginalPrice}>
            ${totalOriginalPrice.toFixed(2)}
          </PoppinsText>
          <PoppinsText style={styles.productPrice}>
            (${item.price} c/u)
          </PoppinsText>
          <PoppinsText style={styles.productQuantity}>
            Cantidad: {item.quantity}
          </PoppinsText>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownHeaderContainer}
        onPress={() => setIsOpen(!isOpen)}
      >
        <PoppinsText style={styles.dropdownHeader}>
          Resumen del pedido
        </PoppinsText>
        {isOpen ? (
          <ChevronUpIcon
            size={24}
            color={Colors.textMain}
            style={styles.dropdownIcon}
          />
        ) : (
          <ChevronDownIcon
            size={24}
            color={Colors.textMain}
            style={styles.dropdownIcon}
          />
        )}
      </TouchableOpacity>

      {isOpen && (
        <>
          <View style={styles.listContainer}>
            {cartItems
              .filter((item) => item.quantity > 0)
              .map((item) => (
                <React.Fragment key={item.id}>
                  {renderItem({ item })}
                </React.Fragment>
              ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.row}>
              <PoppinsText style={styles.subtotalText}>Subtotal</PoppinsText>
              <PoppinsText style={styles.subtotalText}>
                ${subtotal.toFixed(2)}
              </PoppinsText>
            </View>
            <View style={styles.row}>
              <PoppinsText style={styles.discountText}>Descuentos</PoppinsText>
              <PoppinsText style={styles.discountText}>
                -${totalDiscount.toFixed(2)}
              </PoppinsText>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: Colors.gray_100,
    backgroundColor: Colors.menuWhite,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dropdownHeader: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_100,
    paddingBottom: 18,
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    width: '50%',
  },
  productPrice: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.gray_500,
    marginBottom: 2,
  },
  productTotalPrice: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
    marginBottom: 8,
  },
  productOriginalPrice: {
    position: 'absolute',
    right: 0,
    top: 24,
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.gray_500,
    textDecorationLine: 'line-through',
    marginBottom: 8,
  },
  discountBadge: {
    zIndex: 999,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.semanticWarning,
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountBadgeText: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.primary,
  },
  footer: {
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subtotalText: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
  },
  discountText: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.secondary,
  },
  ivaText: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
  },
  productImage: {
    width: '100%',
    height: '100%',
    marginTop: 16,
  },
  productQuantity: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.textMain,
    marginTop: 4,
  },
});

export default OrderSummary;
