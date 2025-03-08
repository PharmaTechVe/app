// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
//import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import CustomCalendar from '../components/Calendar';
import Steps from '../components/Steps';
import { Colors, FontSizes } from '../styles/theme';
//import { PharmaTech } from '@pharmatech/sdk';

export default function RegisterScreen() {
  //const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Paso 1: Datos del usuario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Paso 2: Fecha de nacimiento
  //const [dateOfBirth, setDateOfBirth] = useState('');

  // Instancia del SDK para el registro
  //const api = new PharmaTech(true);

  const handleNext = () => {
    // Validaciones simples para el paso 1
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    // Avanzar al siguiente paso
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleRegister = async () => {
    //Registration logic
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Indicador de pasos */}
      <Steps totalSteps={2} />

      {currentStep === 1 && (
        <View style={styles.formContainer}>
          <PoppinsText weight="medium" style={styles.header}>
            Registro de Usuario
          </PoppinsText>
          <Input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            value={firstName}
            getValue={setFirstName}
            backgroundColor={Colors.menuWhite}
          />
          <Input
            label="Apellido"
            placeholder="Ingresa tu apellido"
            value={lastName}
            getValue={setLastName}
            backgroundColor={Colors.menuWhite}
          />
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
          <Input
            label="Confirmar Contraseña"
            placeholder="Reingresa tu contraseña"
            value={confirmPassword}
            fieldType="password"
            getValue={setConfirmPassword}
            backgroundColor={Colors.menuWhite}
            errorText="Las contraseñas no coinciden"
          />
          <Button
            title="Siguiente"
            onPress={handleNext}
            style={styles.nextButton}
            size="medium"
          />
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.formContainer}>
          <PoppinsText weight="medium" style={styles.header}>
            Fecha de Nacimiento
          </PoppinsText>
          <CustomCalendar
          // El componente CustomCalendar debe recibir una prop onAccept para obtener la fecha seleccionada
          //onAccept={(date) => setDateOfBirth(date)}
          />
          <View style={styles.navigationButtons}>
            <Button
              title="Atrás"
              onPress={handleBack}
              style={styles.backButton}
              size="medium"
              variant="secondary"
            />
            <Button
              title="Registrar"
              onPress={handleRegister}
              style={styles.registerButton}
              size="medium"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: 20,
  },
  header: {
    fontSize: FontSizes.h3.size,
    lineHeight: FontSizes.h3.lineHeight,
    color: Colors.textMain,
    marginBottom: 20,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 20,
    width: '100%',
    height: 50,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    width: '45%',
    height: 50,
  },
  registerButton: {
    width: '45%',
    height: 50,
  },
});
