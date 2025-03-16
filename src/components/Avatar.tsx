import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../styles/theme';

interface AvatarProps {
  uri?: string; // URL de la imagen de perfil
  name?: string; // Nombre del usuario para mostrar iniciales
  size?: 'small' | 'medium' | 'large';
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = 'U',
  size = 'medium',
}) => {
  const avatarSizes = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const dimension = avatarSizes[size];

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
        <Text style={styles.initials}>{name.charAt(0).toUpperCase()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: Colors.secondaryGray,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  initials: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Avatar;
