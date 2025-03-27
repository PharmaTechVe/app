import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../hooks/useCart';
import CardButton from '../components/CardButton';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import type { CartItem } from '../redux/slices/cartSlice';
import Button from '../components/Button';

const CartListScreen = () => {
  const { cartItems, total, removeFromCart, updateCartQuantity } = useCart();

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <PoppinsText>Imagen</PoppinsText>
        {/* Image */}
      </View>
      <View style={styles.detailsContainer}>
        <PoppinsText style={styles.productName}>{item.name}</PoppinsText>
        <PoppinsText style={styles.productPrice}>${item.price}</PoppinsText>
        <View style={styles.quantityContainer}>
          <CardButton
            getValue={(quantity) => updateCartQuantity(item.id, quantity)}
            initialValue={item.quantity > 0 ? item.quantity : 0}
            syncQuantity={(quantity) => updateCartQuantity(item.id, quantity)}
          />
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <PoppinsText style={styles.removeText}>Eliminar</PoppinsText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.header} weight="regular">
        Carrito de compras
      </PoppinsText>
      {cartItems.filter((item) => item.quantity > 0).length === 0 ? (
        <PoppinsText style={styles.emptyCartText}>
          Tu carrito está vacío
        </PoppinsText>
      ) : (
        <FlatList
          data={cartItems.filter((item) => item.quantity > 0)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <View style={styles.footerBackground} />
      <View style={styles.footer}>
        <View style={styles.row}>
          <PoppinsText style={styles.subtotalText}>Subtotal</PoppinsText>
          <PoppinsText style={styles.subtotalText}>${total}</PoppinsText>
        </View>
        <View style={styles.row}>
          <PoppinsText style={styles.discountText}>Descuentos</PoppinsText>
          <PoppinsText style={styles.discountText}>$0.00</PoppinsText>
        </View>
        <View style={styles.row}>
          <PoppinsText style={styles.ivaText}>IVA</PoppinsText>
          <PoppinsText style={styles.ivaText}>$0.00</PoppinsText>
        </View>
        <View style={styles.row}>
          <PoppinsText style={styles.totalText}>Total</PoppinsText>
          <PoppinsText style={styles.totalText}>${total}</PoppinsText>
        </View>
        <Button
          title="Ir a pagar"
          onPress={() => {}}
          style={styles.checkoutButton}
          size="medium"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 16,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: FontSizes.b2.size,
    lineHeight: FontSizes.b2.lineHeight,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeText: {
    fontSize: 14,
    color: Colors.semanticDanger,
  },
  footerBackground: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.menuWhite,
    paddingTop: 310,
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
  checkoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  emptyCartText: {
    fontSize: 16,
    color: Colors.textMain,
    textAlign: 'center',
    marginTop: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
});

export default CartListScreen;
