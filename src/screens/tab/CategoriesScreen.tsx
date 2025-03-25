import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/theme';
import * as SecureStore from 'expo-secure-store';
import Popup from '../../components/Popup';
import CartTotal from '../../components/CartTotal';
import { useDispatch } from 'react-redux';
import { addItem, removeItem } from '../../redux/slices/cartSlice';

export default function CategoriesScreen() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      setShowPopup(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: '1',
        name: 'Camiseta Azul',
        price: 20,
        quantity: 1,
        image: 'https://example.com/camiseta.jpg',
      }),
    );
  };

  const handleRemoveFromCart = () => {
    dispatch(removeItem('1')); // Elimina el producto con ID '1'
  };

  return (
    <View style={styles.container}>
      {/* Popup */}
      <Popup
        visible={showPopup}
        type="center"
        headerText="Cerrar sesión"
        bodyText="¿Estás seguro de que deseas cerrar sesión?"
        primaryButton={{
          text: 'Sí',
          onPress: handleLogout,
        }}
        secondaryButton={{
          text: 'No',
          onPress: () => setShowPopup(false),
        }}
        onClose={() => setShowPopup(false)}
      />
      <PoppinsText>Pantalla Categorías</PoppinsText>
      <Button
        title="Cerrar sesión"
        onPress={() => setShowPopup(true)}
        variant="secondary"
        mode="filled"
        size="large"
      />
      <CartTotal />
      <Button title="Agregar al carrito" onPress={handleAddToCart} />
      <Button title="Eliminar del carrito" onPress={handleRemoveFromCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
});
