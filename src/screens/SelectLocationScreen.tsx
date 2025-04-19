import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'; // Importa el tipo Region
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';

const SelectLocationScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState<string>('Cargando dirección...');
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    latitude: 10.0678, // Coordenadas iniciales (Barquisimeto)
    longitude: -69.3467,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  // Solicitar permisos y obtener la ubicación del usuario
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const { status: newStatus } =
            await Location.requestForegroundPermissionsAsync();
          if (newStatus !== 'granted') {
            Alert.alert(
              'Permiso denegado',
              'No se pudo obtener la ubicación. El mapa cargará en la región predeterminada.',
            );
            return;
          }
        }

        const location = await Location.getCurrentPositionAsync({});
        const userRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setInitialRegion(userRegion);
        setSelectedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        mapRef.current?.animateToRegion(userRegion, 1000);
        fetchAddress(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        Alert.alert(
          'Error',
          'Hubo un problema al obtener la ubicación. El mapa cargará en la región predeterminada.',
        );
      }
    };

    getUserLocation();
  }, []);

  // Obtener la dirección desde la API de Google Maps
  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDo6tMJUrZsd-LsNNnUDJ95ZGZfUrYMmgU`,
      );
      const data = await response.json();

      if (data.plus_code) {
        const plusCode = data.plus_code.compound_code || 'Código no disponible';
        setAddress(plusCode);
      } else if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress('No se pudo obtener la dirección.');
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setAddress('Error al obtener la dirección.');
    }
  };

  const handleRegionChange = (region: Region) => {
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    fetchAddress(region.latitude, region.longitude);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log('Coordenadas seleccionadas:', selectedLocation); // Log para verificar las coordenadas
      console.log('Navegando a createDirection con:', {
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
      });
      router.push({
        pathname: '/createDirection',
        params: {
          latitude: selectedLocation.latitude.toString(),
          longitude: selectedLocation.longitude.toString(),
        },
      });
    } else {
      console.log('No se seleccionó ninguna ubicación'); // Log para verificar si no hay ubicación seleccionada
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con input para mostrar la dirección */}
      <View style={styles.header}>
        <TextInput
          style={styles.addressInput}
          value={address}
          editable={false}
        />
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChange}
      />
      {/* Marker siempre centrado */}
      <View style={styles.markerFixed}>
        <MapPinIcon size={40} color={Colors.primary} />
      </View>
      {/* Footer con mensajes y botón */}
      <View style={styles.footer}>
        <PoppinsText style={styles.footerTitle}>Fija el marcador</PoppinsText>
        <PoppinsText style={styles.footerSubtitle}>
          Arrastra el mapa e indica la dirección exacta con el marcador
        </PoppinsText>
        <Button
          title="Confirmar ubicación"
          onPress={handleConfirmLocation}
          variant="primary"
          size="medium"
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.textWhite,
    padding: 10,
    zIndex: 1000,
  },
  addressInput: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.stroke,
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textMain,
    marginLeft: 48,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.textWhite,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  footerTitle: {
    fontSize: FontSizes.b1.size,
    lineHeight: FontSizes.b1.lineHeight,
    fontWeight: 'bold',
    color: Colors.textMain,
    marginBottom: 12,
  },
  footerSubtitle: {
    fontSize: FontSizes.label.size,
    lineHeight: FontSizes.label.lineHeight,
    color: Colors.textLowContrast,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default SelectLocationScreen;
