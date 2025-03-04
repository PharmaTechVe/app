// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import { Colors, FontSizes } from '../styles/theme';
import Logo from '../assets/app_images/PharmaTech_Logo.svg';
import { PharmaTech } from '@pharmatech/sdk';
import GoogleLogo from '../assets/images/Google_Logo.png';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const api = new PharmaTech(true);

  const handleLogin = async () => {
    try {
      const response = await api.auth.login({ email, password });
      console.log('Token de acceso:', response.accessToken);
      // Succes alert
      Alert.alert('Éxito', 'Inicio de sesión exitoso', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/success');
          },
        },
      ]);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert(
        'Error',
        'Error al iniciar sesión, por favor verifica tus credenciales.',
      );
    }
  };

  const handleRecoverPassword = () => {
    console.log('Recuperar contraseña');
    // Password recovery logic
  };

  const handleGoogleLogin = () => {
    console.log('Iniciar sesión con Google');
    // Google login logic
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      {/* Logo*/}
      <Logo style={styles.logo} />

      {/* Titles */}
      <PoppinsText weight="medium" style={styles.title}>
        Bienvenido
      </PoppinsText>
      <PoppinsText weight="regular" style={styles.subtitle}>
        Por favor introduce tus datos para iniciar sesión
      </PoppinsText>

      {/* Inputs */}
      <View style={styles.inputsContainer}>
        <Input
          label="Correo electrónico"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          fieldType="email"
          getValue={setEmail}
          backgroundColor={Colors.menuWhite}
        />
        <Input
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          fieldType="password"
          getValue={setPassword}
          backgroundColor={Colors.menuWhite}
        />
      </View>

      {/* Forgot my password */}
      <TouchableOpacity
        onPress={handleRecoverPassword}
        style={styles.linkContainer}
      >
        <PoppinsText weight="regular" style={styles.linkText}>
          ¿Olvidaste tu contraseña?
        </PoppinsText>
      </TouchableOpacity>

      {/* Login button */}
      <Button
        title="Iniciar sesión"
        onPress={handleLogin}
        style={styles.loginButton}
        size="medium"
      />

      {/* Google button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={GoogleLogo}
          style={styles.googleIcon}
          resizeMode="contain"
        />
        <PoppinsText weight="medium" style={styles.googleButtonText}>
          Iniciar sesión con Google
        </PoppinsText>
      </TouchableOpacity>

      {/* Register link */}
      <TouchableOpacity
        onPress={handleRegister}
        style={styles.registerContainer}
      >
        <PoppinsText weight="regular" style={styles.registerText}>
          ¿No tienes cuenta?{' '}
          <PoppinsText weight="regular" style={styles.registerLink}>
            Regístrate
          </PoppinsText>
        </PoppinsText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  logo: {
    width: 192,
    height: 79,
    marginBottom: 26,
  },
  title: {
    fontSize: FontSizes.h3.size,
    lineHeight: FontSizes.h3.lineHeight,
    marginBottom: 20,
    color: Colors.textMain,
  },
  subtitle: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.textLowContrast,
  },
  inputsContainer: {
    width: '100%',
    gap: 8,
  },
  linkContainer: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.secondary,
  },
  loginButton: {
    marginTop: 16,
    width: '100%',
    height: 50,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    height: 50,
    backgroundColor: Colors.menuWhite,
  },
  googleIcon: {
    width: 24 + 12,
    height: 24 + 12,
    marginRight: 4,
  },
  googleButtonText: {
    fontSize: FontSizes.btnMedium.size,
    lineHeight: FontSizes.btnMedium.lineHeight,
    color: Colors.textMain,
    backgroundColor: Colors.menuWhite,
  },
  registerContainer: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  registerText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.textMain,
  },
  registerLink: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.secondary,
  },
});
