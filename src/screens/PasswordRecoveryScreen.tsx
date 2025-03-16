import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import Steps from '../components/Steps';
import Alert from '../components/Alerts';
import { Colors, FontSizes } from '../styles/theme';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

export default function PasswordRecoveryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentStep === 1) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon width={24} height={24} color={Colors.primary} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => handleStepChange(currentStep - 1)}>
            <ChevronLeftIcon width={24} height={24} color={Colors.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [currentStep, navigation]);

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);
  const codeRefs = useRef<Array<TextInput>>([]);

  // States
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStepChange = (newStep: number) => {
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

  // Send email
  const handleSendEmail = () => {
    if (!validateEmail(email)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido');
      setShowErrorAlert(true);
      return;
    }

    setShowAlert(true);
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    alertTimeout.current = setTimeout(() => {
      setShowAlert(false);
      handleStepChange(2);
    }, 3000);
  };

  // Code verification
  const handleVerifyCode = () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setErrorMessage('Por favor ingresa el código de 6 dígitos');
      setShowErrorAlert(true);
      return;
    }
    handleStepChange(3);
  };

  // Change password
  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Por favor completa ambos campos');
      setShowErrorAlert(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowErrorAlert(true);
      return;
    }

    setShowSuccessAlert(true);
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    alertTimeout.current = setTimeout(() => {
      setShowSuccessAlert(false);
      router.replace('/login');
    }, 2000);
  };

  // Code inputs
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

  // Current step render
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <PoppinsText weight="medium" style={styles.stepTitle}>
              Recuperar contraseña
            </PoppinsText>
            <PoppinsText weight="regular" style={styles.stepDescription}>
              Ingresa el correo electrónico asociado a tu cuenta para recuperar
              tu contraseña.
            </PoppinsText>
            <Input
              label="Correo electrónico"
              placeholder="Ingresa tu correo"
              value={email}
              fieldType="email"
              getValue={setEmail}
              backgroundColor={Colors.menuWhite}
              errorText="El correo ingresado no es válido"
            />
            <Button
              title="Enviar"
              onPress={handleSendEmail}
              style={styles.button}
              size="medium"
            />
          </View>
        );

      case 2:
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
            />
          </View>
        );

      case 3:
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
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Alerts */}
      <View style={styles.alertsContainer}>
        {showAlert && (
          <Alert
            type="success"
            title="Correo enviado"
            message="Revisa tu bandeja de entrada para continuar"
            alertStyle="regular"
            borderColor
            onClose={() => setShowAlert(false)}
          />
        )}

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
              totalSteps={3}
              currentStep={currentStep}
              labels={['Enviar correo', 'Código', 'Recuperar Contraseña']}
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
    flex: 1,
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
    width: 328,
    left: '50%',
    marginLeft: -164,
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
