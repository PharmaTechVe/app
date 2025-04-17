import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import SlideMenu from './SlideMenu';
import Avatar from './Avatar';
import {
  UserIcon,
  MapIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
} from 'react-native-heroicons/outline';
import { Colors } from '../styles/theme';
import { useRouter } from 'expo-router';

const AvatarWithMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      id: '1',
      title: 'Perfil',
      icon: <UserIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/profile'),
    },
    {
      id: '2',
      title: 'Mis Direcciones',
      icon: <MapIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/direction'),
    },
    {
      id: '3',
      title: 'Seguridad',
      icon: <ShieldCheckIcon color={Colors.iconMainPrimary} />,
      onPress: () => console.log('Cerrar sesión presionado'),
    },
    {
      id: '4',
      title: 'Mis Pedidos',
      icon: <ShoppingCartIcon color={Colors.iconMainPrimary} />,
      onPress: () => router.push('/orders'),
    },
  ];

  return (
    <View style={styles.container}>
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={menuItems}
      />

      <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
        <Avatar />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -15,
    left: 0,
    zIndex: 100,
  },
});

export default AvatarWithMenu;
