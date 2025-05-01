import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Config } from '../config';

interface DeliveryMapProps {
  deliveryState: number;
  branchLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  deliveryState,
  branchLocation,
  customerLocation,
}) => {
  const [deliveryLocation, setDeliveryLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [customerRouteCoordinates, setCustomerRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  // Solicitar permisos y obtener la ubicación del delivery
  useEffect(() => {
    const getDeliveryLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const { status: newStatus } =
            await Location.requestForegroundPermissionsAsync();
          if (newStatus !== 'granted') {
            Alert.alert(
              'Permiso denegado',
              'No se pudo obtener la ubicación del delivery.',
            );
            return;
          }
        }

        const location = await Location.getCurrentPositionAsync({});
        setDeliveryLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Obtener la ruta desde la ubicación del delivery hasta la sucursal
        fetchRoute(
          location.coords.latitude,
          location.coords.longitude,
          branchLocation.latitude,
          branchLocation.longitude,
          setRouteCoordinates,
        );
      } catch (error) {
        console.error('Error al obtener la ubicación del delivery:', error);
        Alert.alert(
          'Error',
          'Hubo un problema al obtener la ubicación del delivery.',
        );
      }
    };

    getDeliveryLocation();
  }, []);

  // Obtener la ruta desde Google Maps Directions API
  const fetchRoute = async (
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    setRoute: React.Dispatch<
      React.SetStateAction<{ latitude: number; longitude: number }[]>
    >,
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${Config.googleMapsApiKey}`,
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRoute(points);
      } else {
        console.error('No se pudo obtener la ruta.');
      }
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
    }
  };

  // Obtener la ruta hacia el cliente cuando el estado sea el correspondiente
  useEffect(() => {
    if (
      deliveryState >= 3 && // Estado "Ir a destino de entrega" o posterior
      deliveryLocation
    ) {
      fetchRoute(
        deliveryLocation.latitude,
        deliveryLocation.longitude,
        customerLocation.latitude,
        customerLocation.longitude,
        setCustomerRouteCoordinates,
      );

      // Limpiar la ruta hacia la sucursal
      setRouteCoordinates([]);
    }
  }, [deliveryState, deliveryLocation]);

  // Decodificar la polyline de Google Maps
  const decodePolyline = (encoded: string) => {
    const points: { latitude: number; longitude: number }[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: branchLocation.latitude,
          longitude: branchLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Mostrar la ubicación del delivery */}
        {deliveryLocation && (
          <Marker
            coordinate={deliveryLocation}
            title="Tu ubicación"
            pinColor="red"
          />
        )}

        {/* Mostrar la ubicación de la sucursal */}
        <Marker
          coordinate={branchLocation}
          title="Sucursal de origen"
          pinColor="blue"
        />

        {/* Mostrar la ubicación del cliente */}
        <Marker
          coordinate={customerLocation}
          title="Ubicación del cliente"
          pinColor="green"
        />

        {/* Mostrar la ruta hacia la sucursal */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="blue"
            strokeWidth={4}
          />
        )}

        {/* Mostrar la ruta hacia el cliente solo si el estado es el correspondiente */}
        {deliveryState >= 3 && customerRouteCoordinates.length > 0 && (
          <Polyline
            coordinates={customerRouteCoordinates}
            strokeColor="green"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
});

export default DeliveryMap;
