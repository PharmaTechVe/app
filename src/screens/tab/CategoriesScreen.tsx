import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import EmailVerificationModal from './EmailVerificationModal';
import { Colors } from '../../styles/theme';
import * as SecureStore from 'expo-secure-store';
import Popup from '../../components/Popup';

export default function CategoriesScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      setShowPopup(false);
      router.replace('/login');
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
      <PoppinsText>Pantalla Categorías</PoppinsText>
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
      <Button
        title="Verificar correo"
        onPress={() => setIsModalVisible(true)}
        variant="primary"
        mode="filled"
        size="large"
      />
      <EmailVerificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
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
