import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';

type CustomerAvatarProps = {
  firstName: string;
  lastName: string;
  profilePicture?: string; // Nueva propiedad para la imagen de perfil
  scale?: number; // Propiedad opcional para definir el tamaño del avatar
};

const CustomerAvatar: React.FC<CustomerAvatarProps> = ({
  firstName,
  lastName,
  profilePicture,
  scale = 32,
}) => {
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  const initials = getInitials(firstName, lastName);

  // Cálculo dinámico de tamaño y fuentes
  const avatarSize = scale;
  const fontSize = avatarSize / 2.5;
  const lineHeight = fontSize + 1;
  const marginTop = avatarSize / 10;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
      ]}
    >
      {profilePicture ? (
        <Image
          source={{ uri: profilePicture }}
          style={[
            styles.avatarImage,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        />
      ) : (
        <PoppinsText
          style={[
            styles.initials,
            {
              fontSize: fontSize,
              lineHeight: lineHeight,
              marginTop: marginTop,
            },
          ]}
          weight="semibold"
        >
          {initials}
        </PoppinsText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  initials: {
    color: Colors.textWhite,
    textAlign: 'center',
  },
});

export default CustomerAvatar;
