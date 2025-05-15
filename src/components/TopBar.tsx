import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BellIcon,
  ShoppingCartIcon,
  ClipboardIcon,
} from 'react-native-heroicons/outline';
import Logo from '../assets/images/logos/PharmaTech_Logo.svg';
import SearchInput from './SearchInput';
import { Colors } from '../styles/theme';
import { useRouter } from 'expo-router';
import Popup from './Popup';
import { AuthService } from '../services/auth';
import Badge from './Badge';
import { useCart } from '../hooks/useCart';
import AvatarWithMenu from './AvatarWithMenu';
import { useNotifications } from '../hooks/useNotifications';

const TopBar = () => {
  const [searchText, setSearchText] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLogoutConfirmationVisible, setIsLogoutConfirmationVisible] =
    useState(false);
  const router = useRouter();
  const { cartItems } = useCart();
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Calculate the total quantity of items in the cart
  const totalCartQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

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
          <AvatarWithMenu />
        </View>

        <TouchableOpacity
          style={[styles.iconButton, { marginLeft: 40 }]}
          onPress={() => {
            router.push('/active-orders');
          }}
        >
          <ClipboardIcon size={26} color={Colors.textMain} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo width={118} height={48} />
        </View>

        <TouchableOpacity
          style={{ paddingRight: 8 }}
          onPress={() => {
            router.push('/notifications');
          }}
        >
          <BellIcon size={26} color={Colors.textMain} />
          {unreadCount > 0 && (
            <View style={styles.badgeContainerBell}>
              <Badge variant="filled" color="danger" size="tiny">
                {unreadCount}
              </Badge>
            </View>
          )}
        </TouchableOpacity>

        {/* Right cart icon with badge */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            router.push('/cart');
          }}
        >
          <ShoppingCartIcon size={26} color={Colors.textMain} />
          {totalCartQuantity > 0 && (
            <View style={styles.badgeContainer}>
              <Badge variant="filled" color="primary" size="tiny">
                {totalCartQuantity}
              </Badge>
            </View>
          )}
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
  badgeContainerBell: {
    position: 'absolute',
    top: -5,
    right: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -2,
  },
  searchInput: {
    backgroundColor: Colors.menuWhite,
    borderWidth: 1,
    borderColor: Colors.stroke,
    height: 32,
    borderRadius: 50,
  },
});

export default TopBar;
