import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BellIcon } from 'react-native-heroicons/outline';
import Logo from '../assets/images/logos/PharmaTech_Logo.svg';
import SearchInput from './SearchInput';
import { Colors } from '../styles/theme';
import { useRouter } from 'expo-router';
import Avatar from './Avatar';
import Popup from './Popup';
import { AuthService } from '../services/auth';

const TopBarDelivery = () => {
  const [searchText, setSearchText] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLogoutConfirmationVisible, setIsLogoutConfirmationVisible] =
    useState(false);
  const router = useRouter();

  const handleSearch = () => {
    console.log('Texto de búsqueda:', searchText);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout(); // Llama al método logout del servicio de autenticación
      setIsLogoutConfirmationVisible(false); // Cierra el popup de confirmación

      // Verificar si hay pantallas en la pila antes de llamar a dismissAll
      if (router.canGoBack()) {
        router.dismissAll();
      }

      router.replace('/login'); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Upper section */}
      <View style={styles.topSection}>
        {/* Left user icon */}
        <View>
          <TouchableOpacity
            onPress={() => router.push('/menu?context=topBarDelivery')}
          >
            <Avatar />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo width={118} height={48} />
        </View>

        {/* Right notification icon */}
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <BellIcon size={26} color={Colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearchPress={handleSearch}
        style={styles.searchInput}
      />

      {/* Popup for Avatar Options */}
      <Popup
        visible={isPopupVisible}
        type="center"
        headerText="Opciones"
        bodyText="Selecciona una acción:"
        primaryButton={{
          text: 'Cambiar contraseña',
          onPress: () => {
            setIsPopupVisible(false);
            router.push('/change-password');
          },
        }}
        secondaryButton={{
          text: 'Cerrar sesión',
          onPress: () => {
            setIsPopupVisible(false);
            setIsLogoutConfirmationVisible(true); // Muestra el popup de confirmación
          },
        }}
        onClose={() => setIsPopupVisible(false)}
      />

      {/* Popup for Logout Confirmation */}
      <Popup
        visible={isLogoutConfirmationVisible}
        type="center"
        headerText="Cerrar sesión"
        bodyText="¿Estás seguro de que deseas cerrar sesión?"
        primaryButton={{
          text: 'Sí',
          onPress: handleLogout,
        }}
        secondaryButton={{
          text: 'No',
          onPress: () => setIsLogoutConfirmationVisible(false),
        }}
        onClose={() => setIsLogoutConfirmationVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    paddingRight: 4,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: Colors.menuWhite,
    borderWidth: 1,
    borderColor: Colors.stroke,
    height: 32,
    borderRadius: 50,
  },
});

export default TopBarDelivery;
