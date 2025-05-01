import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { Colors } from '../styles/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const isValidSession = await AuthService.validateSession();
        if (isValidSession) {
          // Obtener el perfil del usuario para determinar el rol
          const profileResponse = await UserService.getProfile();
          if (profileResponse.success) {
            const userRole = profileResponse.data.role;

            if (userRole === 'delivery') {
              // Redirigir a (delivery-tabs) si es un usuario de tipo delivery
              router.replace('/(delivery-tabs)');
            } else {
              // Redirigir a (tabs) si es un usuario regular
              router.replace('/(tabs)');
            }
          } else {
            console.error(
              'Error al obtener el perfil del usuario (se lleva al login):',
              profileResponse.error,
            );
            router.replace('/login'); // Redirigir al login en caso de error
          }
        } else {
          router.replace('/login'); // Redirigir al login si la sesión no es válida
        }
      } catch (error) {
        console.error('Error al validar la sesión:', error);
        router.replace('/login'); // Redirigir al login en caso de error
      }
    };

    checkSession();
  }, []);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
});
