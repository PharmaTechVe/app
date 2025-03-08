// src/screens/RegistrationSuccessScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import PoppinsText from '../components/PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

export default function RegistrationSuccessScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <PoppinsText weight="semibold" style={styles.title}>
        Registro Exitoso!
      </PoppinsText>
      <PoppinsText weight="regular" style={styles.message}>
        Tu cuenta ha sido creada con éxito. ¡Bienvenido a PharmaTech!
      </PoppinsText>
      <Button
        title="Continuar"
        onPress={handleContinue}
        style={styles.button}
        size="large"
      />
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
