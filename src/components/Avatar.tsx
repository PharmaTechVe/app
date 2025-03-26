import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../styles/theme';

interface AvatarProps {
  uri?: string; // URL de la imagen de perfil
  name?: string; // Nombre completo del usuario
}

const Avatar: React.FC<AvatarProps> = ({ uri, name = '' }) => {
  const dimension = 32; // Tamaño fijo

  // Función para obtener iniciales del nombre
  const getInitials = (fullName: string): string => {
    const words = fullName.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <View
      style={[
        styles.avatarContainer,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.avatarImage, { width: dimension, height: dimension }]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: dimension / 2.5 }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: Colors.primary, // Color de fondo cuando no hay foto
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  initials: {
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
});

export default Avatar;
