import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../styles/theme';
import { UserService } from '../services/user';
import PoppinsText from './PoppinsText';
import * as SecureStore from 'expo-secure-store';
import { usePathname } from 'expo-router';

type AvatarProps = {
  scale?: number; // Propiedad para definir el tamaño del avatar
};

const Avatar: React.FC<AvatarProps> = ({ scale = 32 }) => {
  const [profile, setProfile] = useState<{ uri?: string; name?: string }>({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        console.warn(
          'No se encontró el token de autenticación. Usando datos locales.',
        );

        const userData = await SecureStore.getItemAsync('user_data');
        if (userData) {
          const { firstName, lastName } = JSON.parse(userData);
          setProfile({
            name: `${firstName} ${lastName}`,
          });
        } else {
          console.error('No se encontraron datos del usuario en SecureStore.');
        }

        setLoading(false);
        return;
      }

      const response = await UserService.getProfile();
      if (response.success) {
        const { firstName, lastName } = response.data!;
        const profilePicture = response.data.profile.profilePicture;
        setProfile({
          uri:
            profilePicture !== 'https://via.placeholder.com/150'
              ? profilePicture
              : '',
          name: `${firstName} ${lastName}`,
        });
      } else {
        console.error('Error fetching profile:', response.error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [pathname]);

  const getInitials = (fullName: string): string => {
    const words = fullName.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  // Cálculo dinámico de tamaño y fuentes
  const avatarSize = scale;
  const fontSize = avatarSize / 2.5;
  const lineHeight = fontSize + 1;
  const marginTop = avatarSize / 10;

  if (loading) {
    return (
      <View
        style={[
          styles.avatarContainer,
          styles.loadingContainer,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      >
        <ActivityIndicator color={Colors.textWhite} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
      ]}
    >
      {profile.uri ? (
        <Image
          source={{ uri: profile.uri }}
          style={[
            styles.avatarImage,
            { width: avatarSize, height: avatarSize },
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
          {profile.name ? getInitials(profile.name) : ''}
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
    overflow: 'hidden',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  initials: {
    color: Colors.textWhite,
    textAlign: 'center',
  },
  avatarContainer: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loadingContainer: {
    backgroundColor: Colors.stroke,
  },
});

export default Avatar;
