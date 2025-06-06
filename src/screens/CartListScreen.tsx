import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useCart } from '../hooks/useCart';
import CardButton from '../components/CardButton';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import type { CartItem } from '../redux/slices/cartSlice';
import Button from '../components/Button';
import { TrashIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { formatPrice } from '../utils/formatPrice';

const CartListScreen = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // Total price sum
  const totalDiscount = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity * ((item.discount ?? 0) / 100),
    0,
  ); // Discount sum
  const total = subtotal - totalDiscount; // Subtotal with discount

  const renderItem = ({ item }: { item: CartItem }) => {
    console.log('[CartListScreen] Renderizando item:', item); // <-- LOG
    // Usar el descuento del item, si existe, si no 0
    const discount = item.discount ?? 0;
    const discountedPrice = item.price * (1 - discount / 100);
    const totalDiscountedPrice = discountedPrice * item.quantity;
    const totalOriginalPrice = item.price * item.quantity;

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {/* Discount badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <PoppinsText style={styles.discountBadgeText}>
                -{discount}%
              </PoppinsText>
            </View>
          )}
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <PoppinsText style={styles.productName}>{item.name}</PoppinsText>
            <View style={{ alignItems: 'flex-end' }}>
              <PoppinsText style={styles.productTotalPrice}>
                ${formatPrice(totalDiscountedPrice)}
              </PoppinsText>
              {discount > 0 && (
                <PoppinsText style={styles.productOriginalPrice}>
                  ${formatPrice(totalOriginalPrice)}
                </PoppinsText>
              )}
            </View>
          </View>
          <PoppinsText style={styles.productPrice}>
            (${formatPrice(discountedPrice)} c/u)
          </PoppinsText>
          <View style={styles.quantityContainer}>
            <CardButton
              getValue={(quantity) =>
                updateCartQuantity(item.id, quantity, item.discount ?? 0)
              }
              initialValue={item.quantity > 0 ? item.quantity : 0}
              syncQuantity={(quantity) =>
                updateCartQuantity(item.id, quantity, item.discount ?? 0)
              }
            />
            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              style={styles.trashIconContainer}
            >
              <TrashIcon size={24} color={Colors.iconCancel} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const isCartEmpty =
    cartItems.filter((item) => item.quantity > 0).length === 0;

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.header} weight="regular">
        Carrito de compras
      </PoppinsText>
      {isCartEmpty ? (
        <View style={styles.emptyCartContainer}>
          <PoppinsText style={styles.emptyCartText}>
            Aún no tienes productos en tu carrito
          </PoppinsText>
          <PoppinsText style={styles.emptyCartText1}>
            Explora y encuentra lo que buscas
          </PoppinsText>
          <Button
            title="Ver productos disponibles"
            onPress={() => {
              router.replace('/(tabs)');
            }}
            size="medium"
            style={styles.emptyCartButton}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems.filter((item) => item.quantity > 0)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footerBackground} />
          <View style={styles.footer}>
            <View style={styles.row}>
              <PoppinsText style={styles.subtotalText}>Subtotal</PoppinsText>
              <PoppinsText style={styles.subtotalText}>
                ${formatPrice(subtotal)}
              </PoppinsText>
            </View>
            <View style={styles.row}>
              <PoppinsText style={styles.discountText}>Descuentos</PoppinsText>
              <PoppinsText style={styles.discountText}>
                -${formatPrice(totalDiscount)}
              </PoppinsText>
            </View>
            <View style={styles.row}>
              <PoppinsText style={styles.totalText}>Total</PoppinsText>
              <PoppinsText style={styles.totalText}>
                ${formatPrice(total)}
              </PoppinsText>
            </View>
            <Button
              title="Ir a pagar"
              onPress={() => {
                router.push('/checkout');
              }}
              style={styles.checkoutButton}
              size="medium"
            />
          </View>
        </>
      )}
      <View style={styles.height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 16,
    paddingTop: -16,
  },
  header: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    marginBottom: 24,
    color: Colors.textMain,
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
  quantityContainer: {
    flexDirection: 'row',
    left: -10,
  },
  removeText: {
    fontSize: 14,
    color: Colors.semanticDanger,
  },
  footerBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.menuWhite,
    paddingTop: 310,
    alignItems: 'center',
  },
  footer: {
    paddingTop: 44,
    alignItems: 'center',
    position: 'relative',
  },
  totalText: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
    marginBottom: 16,
  },
  checkoutButton: {
    marginBottom: 16,
    width: '100%',
    height: 50,
  },
  emptyCartText: {
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.b2.lineHeight,
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyCartText1: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.textMain,
    textAlign: 'center',
  },
  subtotalText: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
    marginBottom: 8,
  },
  discountText: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.secondary,
    marginBottom: 8,
  },
  ivaText: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
    marginBottom: 20,
  },
  height: {
    height: 64,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    marginTop: 16,
  },
  trashIconContainer: {
    position: 'absolute',
    bottom: 16,
    right: -10,
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
  emptyCartContainer: {
    flex: 1,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  emptyCartButton: {
    marginTop: 16,
  },
});

export default CartListScreen;
