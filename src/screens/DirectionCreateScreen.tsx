import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserService } from '../services/user';
import { CreateUserAddressRequest } from '@pharmatech/sdk';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { validateRequiredFields } from '../utils/validators';
import Alert from '../components/Alerts';
import { StateService } from '../services/state';
import { State, CityResponse } from '../types/api';
import Dropdown from '../components/Dropdown';

const DirectionCreateScreen = () => {
  const { latitude, longitude, fromCheckout } = useLocalSearchParams();

  console.log('Parámetros recibidos en DirectionCreateScreen:', {
    latitude,
    longitude,
  });

  const [address, setAddress] = useState<CreateUserAddressRequest>({
    adress: '',
    additionalInformation: '',
    referencePoint: '',
    latitude: latitude ? parseFloat(latitude as string) : null,
    longitude: longitude ? parseFloat(longitude as string) : null,
    cityId: '',
  });

  console.log('Estado inicial de address:', address);

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
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

  const submitAddress = async () => {
    if (!validateRequiredFields([address.adress])) {
      setShowErrorAlert(true);
      setErrorMessage('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!address.latitude || !address.longitude) {
      console.log('Coordenadas faltantes:', {
        latitude: address.latitude,
        longitude: address.longitude,
      });
      setShowErrorAlert(true);
      setErrorMessage('Las coordenadas de la dirección son obligatorias');
      return;
    }

    setLoading(true);
    try {
      const newAddress: CreateUserAddressRequest = {
        adress: address.adress,
        latitude: address.latitude,
        longitude: address.longitude,
        cityId: selectedCity,
        additionalInformation: address.additionalInformation || null,
        referencePoint: address.referencePoint || null,
      };

      console.log('Datos enviados a la API:', newAddress);

      const response = await UserService.saveDirection(newAddress);

      if (response.success) {
        setShowSuccessAlert(true);
        setTimeout(() => {
          if (fromCheckout === 'true') {
            router.dismiss(2);
            router.replace('/checkout');
          } else {
            router.replace('/direction');
          }
        }, 2000);
      } else {
        setShowErrorAlert(true);
        setErrorMessage('Error al guardar la dirección');
      }
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
      setShowErrorAlert(true);
      setErrorMessage('Ocurrió un error al intentar guardar la dirección');
    } finally {
      setLoading(false);
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
            onClose={() => setShowSuccessAlert(false)}
            borderColor
          />
        )}
      </View>
      <View style={styles.addressHeader}>
        <PoppinsText style={{ fontSize: FontSizes.s1.size, marginBottom: 10 }}>
          Agregar Dirección
        </PoppinsText>
      </View>

      {/* Información de direccion */}
      <View style={styles.addressInfo}>
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
        <Input
          label="Dirección: (Ubicación actual)"
          value={address?.adress}
          getValue={(value) => setAddress({ ...address, adress: value })}
          errorText="El campo no puede estar vacío"
          backgroundColor={Colors.textWhite}
        />
        <Input
          label="Información adicional:"
          value={address?.additionalInformation ?? undefined}
          getValue={(value) =>
            setAddress({ ...address, additionalInformation: value })
          }
          backgroundColor={Colors.textWhite}
        />
        <Input
          label="Punto de referencia:"
          value={address?.referencePoint ?? undefined}
          getValue={(value) =>
            setAddress({ ...address, referencePoint: value })
          }
          backgroundColor={Colors.textWhite}
        />
      </View>

      {/* Botón de guardar */}
      <Button
        title="Guardar Dirección"
        onPress={() => submitAddress()}
        loading={loading}
      />
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
    marginLeft: -163,
    top: 20,
    zIndex: 1000,
    transform: [{ translateX: 20 }],
  },
  addressHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  addressInfo: {
    marginBottom: 20,
  },
});

export default DirectionCreateScreen;
