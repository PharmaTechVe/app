import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import Steps from '../components/Steps';
import RadioButton from '../components/RadioButton';
import { Colors, FontSizes } from '../styles/theme';
//import { PharmaTech } from '@pharmatech/sdk';
import GoogleLogo from '../assets/images/logos/Google_Logo.png';
import DatePickerInput from '../components/DatePickerInput';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

export default function RegisterScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Step 1: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleLogin = () => {
    console.log('Iniciar sesión con Google');
    // Google login logic
  };

  // Step 2: Personal Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    if (currentStep === 2) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => handleStepChange(1)}>
            <ChevronLeftIcon width={24} height={24} color={Colors.primary} />
          </TouchableOpacity>
        ),
      });
    } else if (currentStep === 1) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon width={24} height={24} color={Colors.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [currentStep]);

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

  //const api = new PharmaTech(true);

  const handleNext = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    handleStepChange(2);
  };

  const handleRegister = async () => {
    //Register logic
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        {currentStep === 1 && (
          <View style={styles.headerContainer}>
            <PoppinsText weight="medium" style={styles.mainHeader}>
              Crea tu cuenta
            </PoppinsText>
            <PoppinsText weight="regular" style={styles.subHeader}>
              Por favor introduce tus datos para iniciar sesión
            </PoppinsText>
          </View>
        )}

        {currentStep === 2 && (
          <PoppinsText
            weight="regular"
            style={[styles.mainHeader2, { marginBottom: 20 }]}
          >
            Completa tus datos para crear tu cuenta
          </PoppinsText>
        )}

        {/* Steps */}
        <Steps
          totalSteps={2}
          currentStep={currentStep}
          labels={['Credenciales', 'Datos personales']}
        />

        {currentStep === 1 && (
          <View style={styles.formContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <Input
                label="Correo electrónico"
                placeholder="Ingresa tu correo"
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
              <Input
                label="Confirmar Contraseña"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                fieldType="password"
                getValue={setConfirmPassword}
                backgroundColor={Colors.menuWhite}
                errorText="La contraseña debe tener al menos 8 caracteres"
              />

              <Button
                title="Siguiente"
                onPress={handleNext}
                style={styles.nextButton}
                size="medium"
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
                onPress={handleLogin}
                style={styles.loginContainer}
              >
                <PoppinsText weight="regular" style={styles.loginText}>
                  ¿Ya tienes cuenta?{' '}
                  <PoppinsText weight="regular" style={styles.loginLink}>
                    Inicia sesión
                  </PoppinsText>
                </PoppinsText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.formContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <Input
                label="Nombre"
                placeholder="Ingresa tu nombre"
                value={firstName}
                getValue={setFirstName}
                backgroundColor={Colors.menuWhite}
                errorText="El campo no puede estar vacío"
              />
              <Input
                label="Apellido"
                placeholder="Ingresa tu apellido"
                value={lastName}
                getValue={setLastName}
                backgroundColor={Colors.menuWhite}
                errorText="El campo no puede estar vacío"
              />
              <Input
                label="Cédula"
                placeholder="Ingresa tu cédula"
                value={cedula}
                getValue={setCedula}
                backgroundColor={Colors.menuWhite}
                fieldType="number"
                errorText="El campo no puede estar vacío"
              />
              <Input
                label="Teléfono"
                placeholder="Ingresa tu número"
                value={phoneNumber}
                getValue={setPhoneNumber}
                backgroundColor={Colors.menuWhite}
                fieldType="number"
                errorText="El campo no puede estar vacío"
              />

              <View style={styles.genderContainer}>
                <PoppinsText weight="medium" style={styles.label}>
                  Género
                </PoppinsText>
                <View style={styles.radioGroup}>
                  <RadioButton
                    label="Hombre"
                    value="male"
                    selectedValue={gender}
                    onValueChange={setGender}
                    style={styles.radioButton}
                  />
                  <RadioButton
                    label="Mujer"
                    value="female"
                    selectedValue={gender}
                    onValueChange={setGender}
                    style={styles.radioButton}
                  />
                  <RadioButton
                    label="Otro"
                    value="other"
                    selectedValue={gender}
                    onValueChange={setGender}
                    style={styles.radioButton}
                  />
                </View>
              </View>

              <DatePickerInput
                label="Fecha de Nacimiento"
                placeholder="Selecciona tu fecha"
                value={dateOfBirth}
                getValue={setDateOfBirth}
              />

              <View style={styles.createContainer}>
                <Button
                  title="Crear cuenta"
                  onPress={handleRegister}
                  style={styles.nextButton}
                  size="medium"
                />

                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.loginContainer}
                >
                  <PoppinsText weight="regular" style={styles.loginText}>
                    ¿Ya tienes cuenta?{' '}
                    <PoppinsText weight="regular" style={styles.loginLink}>
                      Inicia sesión
                    </PoppinsText>
                  </PoppinsText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </Animated.View>
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
  createContainer: {
    paddingBottom: 28,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mainHeader: {
    fontSize: FontSizes.h4.size,
    lineHeight: FontSizes.h4.lineHeight,
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: 20,
  },
  mainHeader2: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textLowContrast,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
    flex: 1,
    width: '100%',
  },
  nextButton: {
    marginTop: 16,
    width: '100%',
    height: 50,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  backButton: {
    flex: 1,
    height: 50,
  },
  registerButton: {
    flex: 1,
    height: 50,
  },
  genderContainer: {
    marginVertical: 10,
    width: '80%',
  },
  label: {
    fontSize: FontSizes.label.size,
    color: Colors.textMain,
    marginBottom: 8,
  },
  calendarModal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  loginContainer: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  loginText: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.textMain,
  },
  loginLink: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.secondary,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
