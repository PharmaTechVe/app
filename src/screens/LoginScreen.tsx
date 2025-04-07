import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import { Colors, FontSizes } from '../styles/theme';
import Logo from '../assets/images/logos/PharmaTech_Logo.svg';
import GoogleLogo from '../assets/images/logos/Google_Logo.png';
import { AuthService } from '../services/auth';
import Alert from '../components/Alerts';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        const { isValidated } = result.data!;

        // Mostrar alerta de éxito para todos los usuarios
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);

          if (!isValidated) {
            // Redirigir al home con el modal de verificación de correo
            router.replace({
              pathname: '/(tabs)',
              params: { showEmailVerification: 'true' },
            });
          } else {
            // Redirigir al home si el correo ya está validado
            router.replace('/(tabs)');
          }
        }, 2000);
      } else {
        setShowErrorAlert(true);
        setErrorMessage(result.error || 'Error al iniciar sesión.');
      }
    } catch (error) {
      console.error(error);
      setShowErrorAlert(true);
      setErrorMessage('Error al iniciar sesión, verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = () => {
    router.push('/passwordRecovery');
  };

  const handleGoogleLogin = () => {
    console.log('Iniciar sesión con Google');
    // Google login logic
  };

  const handleRegister = () => {
    router.replace('/register');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Alerts */}
          <View style={styles.alertContainer}>
            {showErrorAlert && (
              <Alert
                type="error"
                title="Error"
                message={errorMessage}
                borderColor
                onClose={() => setShowErrorAlert(false)}
              />
            )}
            {showSuccessAlert && (
              <Alert
                type="success"
                title="Login Exitoso"
                message="Redirigiendo..."
                borderColor
                onClose={() => setShowSuccessAlert(false)}
              />
            )}
          </View>
          {/* Scrollable content */}
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
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
                errorText="El correo ingresado no es válido"
              />
              <Input
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                fieldType="password"
                getValue={setPassword}
                backgroundColor={Colors.menuWhite}
                errorText="La contraseña debe tener al menos 8 caracteres"
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
              loading={loading}
            />
            {/* Google button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
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
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Permite que el contenido sea desplazable
    backgroundColor: Colors.bgColor,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  alertContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -163,
    top: 20,
    zIndex: 1000,
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
    width: 36,
    height: 36,
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
