import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import Alert from '../components/Alerts';
import { Colors, FontSizes } from '../styles/theme';
import { AuthService } from '../services/auth';
import {
  validatePassword,
  validatePasswordMatch,
  validateRequiredFields,
} from '../utils/validators';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'info',
    title: string,
    message: string,
  ) => {
    setAlert({ visible: true, type, title, message });
    setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
  };

  const handleChangePassword = async () => {
    if (loading) return;

    if (
      !validateRequiredFields([currentPassword, newPassword, confirmPassword])
    ) {
      showAlert('error', 'Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (!validatePassword(newPassword)) {
      showAlert(
        'error',
        'Error',
        'La nueva contraseña debe tener al menos 8 caracteres.',
      );
      return;
    }

    if (!validatePasswordMatch(newPassword, confirmPassword)) {
      showAlert('error', 'Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (newPassword === currentPassword) {
      showAlert(
        'error',
        'Error',
        'La nueva contraseña debe ser diferente a la actual.',
      );
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.changePassword(newPassword);
      if (result.success) {
        showAlert('success', 'Éxito', 'Contraseña cambiada correctamente.');
        setTimeout(() => router.replace('/categories'), 3000);
      } else {
        showAlert(
          'error',
          'Error',
          result.error || 'No se pudo cambiar la contraseña.',
        );
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      showAlert('error', 'Error', 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      {/* Contenedor de la alerta personalizada */}
      {alert.visible && (
        <View style={styles.alertContainer}>
          <Alert
            type={alert.type as 'success' | 'error' | 'info'}
            title={alert.title}
            message={alert.message}
            alertStyle="regular"
            borderColor
            onClose={() => setAlert({ ...alert, visible: false })}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          <View style={styles.forgotPasswordContainer}>
            <View style={styles.forgotPasswordRow}>
              <PoppinsText weight="regular" style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?{' '}
              </PoppinsText>
              <TouchableOpacity
                onPress={() => router.push('/loggedInPasswordRecovery')}
              >
                <PoppinsText weight="regular" style={styles.forgotPasswordLink}>
                  Ingresa aquí
                </PoppinsText>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Continuar"
            onPress={handleChangePassword}
            style={styles.button}
            size="medium"
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 2,
    right: 0,
    zIndex: 1000,
    padding: 16,
  },
  title: {
    fontSize: FontSizes.h4.size,
    lineHeight: FontSizes.h4.lineHeight,
    marginBottom: 24,
    color: Colors.textMain,
  },
  description: {
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
    marginBottom: 16,
  },
  changePasswordButton: {
    marginTop: 16,
    width: '100%',
    height: 50,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
  },
  forgotPasswordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.textMain,
  },
  forgotPasswordLink: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.secondaryLight,
  },
  button: {
    marginTop: 24,
    width: '100%',
    height: 50,
  },
});
