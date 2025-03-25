import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import { Colors, FontSizes } from '../styles/theme';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const api = new PharmaTech(true);

  const handleChangePassword = async () => {
    if (loading) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Error',
        'La nueva contraseña debe tener al menos 8 caracteres.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert(
        'Error',
        'La nueva contraseña debe ser diferente a la actual.',
      );
      return;
    }

    setLoading(true);
    try {
      //await api.auth.changePassword({ currentPassword, newPassword });
      Alert.alert('Éxito', 'Contraseña cambiada correctamente.', [
        {
          text: 'OK',
          onPress: () => router.replace('/categories'),
        },
      ]);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      Alert.alert(
        'Error',
        'No se pudo cambiar la contraseña, verifica tus datos.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <PoppinsText weight="medium" style={styles.title}>
        Cambiar Contraseña
      </PoppinsText>

      {/* Descripción debajo del título */}
      <PoppinsText weight="regular" style={styles.description}>
        Crea una nueva contraseña.
      </PoppinsText>
      <PoppinsText weight="regular" style={styles.description2}>
        Asegúrate de que sea diferente a las anteriores por seguridad.
      </PoppinsText>
      <View style={styles.inputsContainer}>
        <View style={styles.inputGroup}>
          <Input
            label="Contraseña Actual"
            placeholder="Ingresa tu contraseña actual"
            value={currentPassword}
            fieldType="password"
            getValue={setCurrentPassword}
            backgroundColor={Colors.menuWhite}
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Contraseña Nueva"
            placeholder="Ingresa tu nueva contraseña"
            value={newPassword}
            fieldType="password"
            getValue={setNewPassword}
            backgroundColor={Colors.menuWhite}
            errorText="Debe tener al menos 8 caracteres"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Repetir Nueva Contraseña"
            placeholder="Repite tu nueva contraseña"
            value={confirmPassword}
            fieldType="password"
            getValue={setConfirmPassword}
            backgroundColor={Colors.menuWhite}
          />
        </View>
      </View>

      {/* Enlace de recuperación de contraseña */}
      <TouchableOpacity
        onPress={() => router.push('/recover-password')}
        style={styles.forgotPasswordContainer}
      >
        <PoppinsText weight="regular" style={styles.forgotPasswordText}>
          ¿Olvidaste tu contraseña?{' '}
          <PoppinsText weight="regular" style={styles.forgotPasswordLink}>
            Ingresa aquí
          </PoppinsText>
        </PoppinsText>
      </TouchableOpacity>

      <Button
        title="Continuar"
        onPress={handleChangePassword}
        style={styles.button}
        size="medium"
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FontSizes.h4.size,
    lineHeight: FontSizes.h4.lineHeight,
    marginBottom: 10,
    color: Colors.textMain,
  },
  description: {
    marginTop: 30,
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    textAlign: 'center',
    marginBottom: 0,
    color: Colors.textLowContrast,
  },
  description2: {
    marginTop: 0,
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    textAlign: 'center',
    marginBottom: 22,
    color: Colors.textLowContrast,
  },
  inputsContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24, // Aumenta la separación entre los campos
  },
  changePasswordButton: {
    marginTop: 16,
    width: '100%',
    height: 50,
  },
  forgotPasswordContainer: {
    marginTop: 5,
  },
  forgotPasswordText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.textMain,
  },
  forgotPasswordLink: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.secondaryLight, // Color azul claro para indicar que es un enlace
  },
  button: {
    marginTop: 24,
    width: '100%',
    height: 50,
  },
});
