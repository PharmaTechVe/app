import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Alert, ViewStyle } from 'react-native';
import { Config } from '../config';
import { Colors } from '../styles/theme';
import polyline from '@mapbox/polyline';
import { MapPinIcon, UserIcon } from 'react-native-heroicons/solid';
import { FontAwesome5 } from '@expo/vector-icons';

interface HistoryMapProps {
  deliveryLocation: { latitude: number; longitude: number };
  branchLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
  style?: ViewStyle; // Permitir estilos personalizados
}

const HistoryMap: React.FC<HistoryMapProps> = ({
  deliveryLocation,
  branchLocation,
  customerLocation,
  style, // Recibir el estilo como prop
}) => {
  const [routeToBranch, setRouteToBranch] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [routeToCustomer, setRouteToCustomer] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  // Obtener las rutas al cargar el componente
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Ruta desde el delivery hasta la sucursal
        await fetchRoute(
          deliveryLocation.latitude,
          deliveryLocation.longitude,
          branchLocation.latitude,
          branchLocation.longitude,
          setRouteToBranch,
        );

        // Ruta desde la sucursal hasta el cliente
        await fetchRoute(
          branchLocation.latitude,
          branchLocation.longitude,
          customerLocation.latitude,
          customerLocation.longitude,
          setRouteToCustomer,
        );
      } catch (error) {
        console.error('Error al obtener las rutas:', error);
        Alert.alert('Error', 'Hubo un problema al obtener las rutas.');
      }
    };

    fetchRoutes();
  }, [deliveryLocation, branchLocation, customerLocation]);

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
        const decoded = polyline.decode(
          data.routes[0].overview_polyline.points,
        );
        const points = decoded.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }));
        setRoute(points);
      } else {
        console.error('No se pudo obtener la ruta.');
      }
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFillObject} // Asegura que el mapa ocupe todo el contenedor
        initialRegion={{
          latitude: branchLocation.latitude,
          longitude: branchLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Mostrar la ubicación del delivery */}
        <Marker coordinate={deliveryLocation} title="Repartidor">
          <FontAwesome5 name="motorcycle" size={26} color={Colors.primary} />
        </Marker>

        {/* Mostrar la ubicación de la sucursal */}
        <Marker coordinate={branchLocation} title="Sucursal de origen">
          <MapPinIcon size={32} color={Colors.primary} />
        </Marker>

        {/* Mostrar la ubicación del cliente */}
        <Marker coordinate={customerLocation} title="Ubicación del cliente">
          <UserIcon size={32} color={Colors.primary} />
        </Marker>

        {/* Mostrar la ruta hacia la sucursal */}
        {routeToBranch.length > 0 && (
          <Polyline
            coordinates={routeToBranch}
            strokeColor="blue"
            strokeWidth={4}
          />
        )}

        {/* Mostrar la ruta hacia el cliente */}
        {routeToCustomer.length > 0 && (
          <Polyline
            coordinates={routeToCustomer}
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
    flex: 1, // Permitir que el mapa ocupe todo el espacio disponible
  },
});

export default HistoryMap;
