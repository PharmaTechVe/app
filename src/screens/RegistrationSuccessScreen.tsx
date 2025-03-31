import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthService } from '../services/auth';
import PoppinsText from '../components/PoppinsText';
import Button from '../components/Button';
import { Colors, FontSizes } from '../styles/theme';

export default function RegistrationSuccessScreen() {
  const router = useRouter();
  const { email, password } = useLocalSearchParams(); // Recibe las credenciales del registro
  const [loading, setLoading] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      if (email && password) {
        const result = await AuthService.login(
          email as string,
          password as string,
        );
        if (result.success) {
          setLoginSuccess(true); // Login exitoso
        } else {
          console.error(
            'Error en el inicio de sesión automático:',
            result.error,
          );
          router.replace('/login'); // Redirige al login manualmente
        }
      }
      setLoading(false);
    };

    autoLogin();
  }, [email, password, router]);

  return (
    <View style={styles.container}>
      <PoppinsText weight="semibold" style={styles.title}>
        Registro Exitoso!
      </PoppinsText>
      {loading ? (
        <>
          <PoppinsText weight="regular" style={styles.message}>
            Estamos configurando tu cuenta. Por favor, espera un momento...
          </PoppinsText>
          <ActivityIndicator size="large" color={Colors.primary} />
        </>
      ) : loginSuccess ? (
        <>
          <PoppinsText weight="regular" style={styles.message}>
            Tu cuenta está lista. Presiona el botón para continuar.
          </PoppinsText>
          <Button
            title="Ir al Home"
            size="medium"
            onPress={() => router.replace('/(tabs)')}
            style={styles.button}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: FontSizes.h2.size,
    lineHeight: FontSizes.h2.lineHeight,
    color: Colors.textMain,
    marginBottom: 20,
  },
  message: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    height: 50,
  },
});
