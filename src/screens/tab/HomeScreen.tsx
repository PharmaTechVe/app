import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/theme';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  const router = useRouter();

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
    <View testID="home-screen" style={styles.container}>
      <PoppinsText>Pantalla Home</PoppinsText>
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
