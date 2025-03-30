import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import { UserService } from '../services/user';
import PoppinsText from './PoppinsText';
import * as SecureStore from 'expo-secure-store';

const Avatar: React.FC = () => {
  const [profile, setProfile] = useState<{ uri?: string; name?: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        console.warn(
          'No se encontró el token de autenticación. Usando datos locales.',
        );

        // Data from secureStore
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
        const { firstName, lastName, profilePicture } = response.data!;
        setProfile({
          uri: profilePicture,
          name: `${firstName} ${lastName}`,
        });
      } else {
        console.error('Error fetching profile:', response.error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const getInitials = (fullName: string): string => {
    console.log('Full Name:', fullName);
    const words = fullName.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <View style={[styles.avatarContainer, styles.loadingContainer]}>
        <ActivityIndicator color={Colors.textWhite} />
      </View>
    );
  }

  return (
    <View style={styles.avatar}>
      {profile.uri ? (
        <Image source={{ uri: profile.uri }} style={styles.avatarImage} />
      ) : (
        <PoppinsText style={styles.initials} weight="semibold">
          {profile.name ? getInitials(profile.name) : ''}
        </PoppinsText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 32,
    height: 32,
    resizeMode: 'cover',
  },
  initials: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.textWhite,
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
