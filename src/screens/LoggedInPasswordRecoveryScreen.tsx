import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import Steps from '../components/Steps';
import Alert from '../components/Alerts';
import { Colors, FontSizes } from '../styles/theme';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';

export default function LoggedInPasswordRecoveryScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // Comenzar en el primer step visual (Código)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const codeRefs = useRef<Array<TextInput>>([]);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const sendOtpAutomatically = async () => {
      setLoading(true);
      try {
        // Obtener el correo del usuario logueado
        const profileResponse = await UserService.getProfile();
        if (!profileResponse.success || !profileResponse.data?.email) {
          throw new Error('No se pudo obtener el correo del usuario.');
        }

        const email = profileResponse.data.email;

        // Enviar OTP automáticamente
        const forgotPasswordResponse = await AuthService.forgotPassword(email);
        if (!forgotPasswordResponse.success) {
          throw new Error(
            forgotPasswordResponse.error || 'Error al enviar el OTP.',
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message || 'Error inesperado.');
        } else {
          setErrorMessage('Error inesperado.');
        }
        setShowErrorAlert(true);
      } finally {
        setLoading(false);
      }
    };

    sendOtpAutomatically();
  }, []);

  const handleStepChange = (newStep: number) => {
    // Eliminar cualquier alerta de error al cambiar de paso
    setShowErrorAlert(false);
    setErrorMessage('');

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(newStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setErrorMessage('El código debe tener 6 dígitos');
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.resetPassword(enteredCode);
      if (result.success) {
        handleStepChange(2); // Avanzar al siguiente paso (Recuperar Contraseña)
      } else {
        setCode(['', '', '', '', '', '']);
        setErrorMessage(
          result.error ||
            'El código ingresado es incorrecto. Inténtalo nuevamente.',
        );
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setErrorMessage(
        'Error inesperado al verificar el código. Inténtalo nuevamente.',
      );
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.updatePassword(
        newPassword,
        confirmPassword,
      );
      if (result.success) {
        // Mostrar alerta de éxito
        setShowSuccessAlert(true);

        // Cerrar sesión y redirigir al login
        setTimeout(async () => {
          await AuthService.logout();
          router.dismissAll(); // Cierra toda la pila de pantallas
          router.replace('/login'); // Redirige al login
        }, 2000); // Tiempo para mostrar la alerta
      } else {
        setErrorMessage(result.error || 'No se pudo cambiar la contraseña.');
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setErrorMessage('Ocurrió un error inesperado.');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const renderCodeInputs = useCallback(() => {
    return (
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (codeRefs.current[index] = ref as TextInput)}
            placeholder="•"
            placeholderTextColor={Colors.textLowContrast}
            style={styles.codeInput}
            caretHidden={true}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => {
              const newCode = [...code];
              const cleanedText = text.replace(/[^0-9]/g, '');
              newCode[index] = cleanedText;
              setCode(newCode);
              if (cleanedText && index < 5) {
                codeRefs.current[index + 1]?.focus();
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                codeRefs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>
    );
  }, [code]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <PoppinsText weight="medium" style={styles.stepTitle}>
              Introducir código
            </PoppinsText>
            <PoppinsText weight="regular" style={styles.stepDescription}>
              Introduce el código de 6 dígitos que te enviamos a tu correo.
            </PoppinsText>
            {renderCodeInputs()}
            <Button
              title="Verificar"
              onPress={handleVerifyCode}
              style={styles.button}
              size="medium"
              loading={loading}
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <PoppinsText weight="medium" style={styles.stepTitle}>
              Recuperar contraseña
            </PoppinsText>
            <PoppinsText weight="regular" style={styles.stepDescription}>
              Ingresa tu nueva contraseña y confírmala.
            </PoppinsText>
            <Input
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              value={newPassword}
              fieldType="password"
              getValue={setNewPassword}
              backgroundColor={Colors.menuWhite}
              errorText="La contraseña debe tener al menos 8 caracteres"
            />
            <Input
              label="Confirmar contraseña"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              fieldType="password"
              getValue={setConfirmPassword}
              backgroundColor={Colors.menuWhite}
              errorText="Las contraseñas no coinciden"
            />
            <Button
              title="Cambiar contraseña"
              onPress={handleChangePassword}
              style={styles.button}
              size="medium"
              loading={loading}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.alertsContainer}>
        {showErrorAlert && (
          <Alert
            type="error"
            title="Error"
            message={errorMessage}
            alertStyle="regular"
            borderColor
            onClose={() => setShowErrorAlert(false)}
          />
        )}
        {showSuccessAlert && (
          <Alert
            type="success"
            title="Contraseña actualizada"
            message="Redirigiendo al inicio de sesión..."
            alertStyle="regular"
            borderColor
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
      </View>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.stepsWrapper}>
            <Steps
              totalSteps={2} // Solo dos steps visuales
              currentStep={currentStep}
              labels={['Código', 'Recuperar Contraseña']}
            />
          </View>
          {renderStepContent()}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    justifyContent: 'flex-start',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  stepsWrapper: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  stepContainer: {
    width: '100%',
    marginVertical: 16,
  },
  alertsContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -162,
    top: 20,
    right: 0,
    zIndex: 1000,
  },
  stepTitle: {
    fontSize: FontSizes.h5.size,
    lineHeight: FontSizes.h5.lineHeight,
    color: Colors.textMain,
    marginBottom: 24,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textLowContrast,
    textAlign: 'center',
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  codeInput: {
    width: 42,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.stroke,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    color: Colors.textMain,
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    borderRadius: 8,
    backgroundColor: Colors.menuWhite,
    includeFontPadding: false,
    padding: 0,
    textAlignVertical: 'center',
  },
  button: {
    marginTop: 20,
    width: '100%',
    height: 50,
  },
});
