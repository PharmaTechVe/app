import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../../styles/theme';
import { router } from 'expo-router';
import Button from '../../components/Button';

export default function CategoriesScreen() {
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Categorías</PoppinsText>
      <Button
        title="Cerrar sesión"
        onPress={handleLogout}
        variant="secondary"
        mode="filled"
        size="large"
      />
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
