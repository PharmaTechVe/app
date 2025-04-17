import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserService } from '../services/user';
import { UserAddressResponse } from '../types/api';
import Return from '../components/Return';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { validateRequiredFields } from '../utils/validators';
import Alert from '../components/Alerts';

import { StateService } from '../services/state';
import { State, City } from '../types/api';
import Dropdown from '../components/Dropdown';

const ChangeDirectionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [address, setAddress] = useState<UserAddressResponse>({});
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) setIsEditable(true);
    const fetchStates = async () => {
      const states = await StateService.getStates(1, 40);
      if (states.success) {
        setStates(states.data.results);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      const cities = await StateService.getCities(1, 40, selectedState);
      if (cities.success) {
        setCities(cities.data.results);
      }
    };
    fetchCities();
  }, [selectedState]);

  useEffect(() => {
    const fetchAddress = async (id: string) => {
      try {
        const address = await UserService.getDirection(id);

        if (address.success) {
          setAddress(address.data);

          const city = await StateService.getCity(address.data.cityId);
          if (city.success) {
            setSelectedCity(city.data.name);
            const state = await StateService.getState(city.data.state.id);
            if (state.success) setSelectedState(state.data.name);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (id) fetchAddress(id);
  }, []);

  const submitAddress = async () => {
    if (!validateRequiredFields([address.adress])) {
      setShowErrorAlert(true);
      setErrorMessage('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const updatedAddress = {
        adress: address.adress,
        zipCode: address.zipCode,
        cityId: selectedCity,
        additionalInformation: address.additionalInformation,
        referencePoint: address.referencePoint,
      };

      const response = id
        ? await UserService.updateDirection(updatedAddress, id)
        : await UserService.saveDirection(updatedAddress);

      if (response.success) {
        setIsEditable(false);
        alert('Dirección actualizada exitosamente');
      } else {
        alert('Error al actualizar la dirección');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al actualizar la dirección:', error);
      alert('Ocurrió un error al intentar actualizar la dirección');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.alertContainer}>
        {showErrorAlert && (
          <Alert
            type="error"
            title="Error"
            message={errorMessage}
            onClose={() => setShowErrorAlert(false)}
            borderColor
          />
        )}
        {showSuccessAlert && (
          <Alert
            type="success"
            title="Éxito"
            message="Dirección creada correctamente"
            onClose={() => {
              setShowSuccessAlert(false);
              router.replace('/success');
            }}
            borderColor
          />
        )}
      </View>
      {/* Header */}
      <Return onClose={() => router.push('/')} />
      <View style={styles.profileHeader}>
        {isEditable ? (
          <PoppinsText
            style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}
          >
            {!id ? 'Agregar' : 'Editar'} Dirección
          </PoppinsText>
        ) : (
          <PoppinsText
            style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}
          >
            Ver Dirección
          </PoppinsText>
        )}
      </View>

      {/* Información de direccion */}
      <View style={styles.profileInfo}>
        {isEditable ? (
          <Dropdown
            label="Estado"
            placeholder="Seleccione Estado"
            options={states.map((state) => state.name)}
            borderColor={Colors.gray_100}
            onSelect={(option) => {
              const sState = states.find((state) => state.name === option);
              if (sState) setSelectedState(sState.id);
            }}
          />
        ) : (
          <Input
            label="Estado"
            value={selectedState}
            isEditable={isEditable}
            border={isEditable ? 'default' : 'none'}
          />
        )}
        {isEditable ? (
          <Dropdown
            label="Ciudad"
            placeholder="Seleccione Ciudad"
            options={cities.map((city) => city.name)}
            borderColor={Colors.gray_100}
            onSelect={(option) => {
              const sCity = cities.find((city) => city.name === option);
              if (sCity) setSelectedCity(sCity.id);
            }}
          />
        ) : (
          <Input
            label="Ciudad"
            value={selectedCity}
            isEditable={isEditable}
            border={isEditable ? 'default' : 'none'}
          />
        )}

        <Input
          label="Dirección:* (Ubicación actual)"
          value={address?.adress}
          isEditable={isEditable}
          border={isEditable ? 'default' : 'none'}
          getValue={(value) => setAddress({ ...address, adress: value })}
          errorText="El campo no puede estar vacío"
          backgroundColor={isEditable ? Colors.textWhite : undefined}
        />
        <Input
          label="Código Postal:"
          value={address?.zipCode}
          isEditable={isEditable}
          border={isEditable ? 'default' : 'none'}
          getValue={(value) => setAddress({ ...address, zipCode: value })}
          fieldType="number"
          errorText="El campo no puede estar vacío"
          backgroundColor={isEditable ? Colors.textWhite : undefined}
        />
        <Input
          label="Información adicional:"
          value={address?.additionalInformation}
          isEditable={isEditable}
          border={isEditable ? 'default' : 'none'}
          getValue={(value) =>
            setAddress({ ...address, additionalInformation: value })
          }
          errorText="El campo no puede estar vacío"
          backgroundColor={isEditable ? Colors.textWhite : undefined}
        />
        <Input
          label="Punto de referencia:"
          value={address?.referencePoint}
          isEditable={isEditable}
          border={isEditable ? 'default' : 'none'}
          getValue={(value) =>
            setAddress({ ...address, referencePoint: value })
          }
          errorText="El campo no puede estar vacío"
          backgroundColor={isEditable ? Colors.textWhite : undefined}
        />
      </View>

      {/* Botón de editar al final */}
      {!isEditable ? (
        <Button title="Editar" onPress={() => setIsEditable(true)} />
      ) : (
        <Button
          title="Guardar Cambios"
          onPress={() => submitAddress()}
          loading={loading}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
  },
  alertContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -162,
    top: 20,
    right: 0,
    zIndex: 1000,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.primary,
  },
  profileInfo: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  bottomEditButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
    width: '50%',
    alignItems: 'center',
  },
});

export default ChangeDirectionScreen;
