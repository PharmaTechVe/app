import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/theme';
import Popup from '../../components/Popup';
import { AuthService } from '../../services/auth';

export default function CategoriesScreen() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.logout(); // Llama al método logout del servicio de autenticación
      router.replace('/login'); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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
      <PoppinsText>Pantalla Categorías some change</PoppinsText>
      <Button
        title="Cerrar sesión"
        onPress={() => setShowPopup(true)}
        variant="secondary"
        mode="filled"
        size="large"
      />
      <Button
        title="Change password"
        onPress={() => router.push('/change-password')}
        variant="primary"
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
