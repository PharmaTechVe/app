import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../hooks/useCart';
import CardButton from '../components/CardButton';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import type { CartItem } from '../redux/slices/cartSlice';

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
            initialValue={item.quantity}
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
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <PoppinsText style={styles.totalText}>Total: ${total}</PoppinsText>
        <TouchableOpacity style={styles.checkoutButton}>
          <PoppinsText style={styles.checkoutText}>
            Proceder al Pago
          </PoppinsText>
        </TouchableOpacity>
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
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: '500',
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
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CartListScreen;
