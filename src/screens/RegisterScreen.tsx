// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
//import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import PoppinsText from '../components/PoppinsText';
import CustomCalendar from '../components/Calendar';
import Steps from '../components/Steps';
import RadioButton from '../components/RadioButton';
import { Colors, FontSizes } from '../styles/theme';
//import { PharmaTech } from '@pharmatech/sdk';

export default function RegisterScreen() {
  //const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  // Paso 1: Credenciales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Paso 2: Datos personales
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

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
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleRegister = async () => {
    //Register logic
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado */}
      {currentStep === 1 && (
        <View style={styles.headerContainer}>
          <PoppinsText weight="regular" style={styles.mainHeader}>
            Crea tu cuenta
          </PoppinsText>
          <PoppinsText style={styles.subHeader}>
            Por favor introduce tus datos para iniciar sesión
          </PoppinsText>
        </View>
      )}

      {currentStep === 2 && (
        <PoppinsText
          weight="regular"
          style={[styles.mainHeader, { marginBottom: 20 }]}
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
          <Input
            label="Correo electrónico"
            placeholder="Ingresa tu correo"
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
          <Input
            label="Confirmar Contraseña"
            placeholder="Reingresa tu contraseña"
            value={confirmPassword}
            fieldType="password"
            getValue={setConfirmPassword}
            backgroundColor={Colors.menuWhite}
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
            label="Cédula"
            placeholder="Ingresa tu cédula"
            value={cedula}
            getValue={setCedula}
            backgroundColor={Colors.menuWhite}
            fieldType="number"
          />
          <Input
            label="Teléfono"
            placeholder="Ingresa tu número"
            value={phoneNumber}
            getValue={setPhoneNumber}
            backgroundColor={Colors.menuWhite}
            fieldType="number"
          />

          <View style={styles.genderContainer}>
            <PoppinsText style={styles.label}>Género</PoppinsText>
            <RadioButton
              label="Hombre"
              value="male"
              selectedValue={gender}
              onValueChange={setGender}
            />
            <RadioButton
              label="Mujer"
              value="female"
              selectedValue={gender}
              onValueChange={setGender}
            />
            <RadioButton
              label="Otro"
              value="other"
              selectedValue={gender}
              onValueChange={setGender}
            />
          </View>

          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Input
              label="Fecha de Nacimiento"
              placeholder="Selecciona tu fecha"
              value={dateOfBirth}
              backgroundColor={Colors.menuWhite}
            />
          </TouchableOpacity>

          <Modal visible={showCalendar} transparent animationType="slide">
            <View style={styles.calendarModal}>
              <CustomCalendar
                onAccept={(date) => {
                  setDateOfBirth(date);
                  setShowCalendar(false);
                }}
                onCancel={() => setShowCalendar(false)}
              />
            </View>
          </Modal>

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
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mainHeader: {
    fontSize: FontSizes.h2.size,
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    color: Colors.textLowContrast,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  nextButton: {
    marginTop: 20,
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
});
