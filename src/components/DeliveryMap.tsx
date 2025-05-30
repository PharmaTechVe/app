import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, ViewStyle } from 'react-native';
import { Config } from '../config';
import { Colors } from '../styles/theme';
import PoppinsText from '../components/PoppinsText';

interface DeliveryMapProps {
  deliveryState: number;
  branchLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
  deliveryLocation: { latitude: number; longitude: number } | null; // NUEVO
  style?: ViewStyle;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  deliveryState,
  branchLocation,
  customerLocation,
  deliveryLocation,
  style,
}) => {
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [customerRouteCoordinates, setCustomerRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [, setIsLoading] = useState(true); // Estado de carga

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

  // Obtener la ruta hacia la sucursal
  useEffect(() => {
    if (
      deliveryLocation &&
      branchLocation.latitude !== 0 &&
      branchLocation.longitude !== 0
    ) {
      fetchRoute(
        deliveryLocation.latitude,
        deliveryLocation.longitude,
        branchLocation.latitude,
        branchLocation.longitude,
        setRouteCoordinates,
      );
    }
  }, [deliveryLocation, branchLocation]);

  // Obtener la ruta hacia el cliente cuando el estado sea el correspondiente
  useEffect(() => {
    if (
      deliveryState >= 3 &&
      deliveryLocation &&
      customerLocation.latitude !== 0 &&
      customerLocation.longitude !== 0
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
  }, [deliveryState, deliveryLocation, customerLocation]);

  // Verificar si todos los datos necesarios están disponibles
  useEffect(() => {
    if (
      deliveryLocation &&
      branchLocation.latitude !== 0 &&
      branchLocation.longitude !== 0 &&
      customerLocation.latitude !== 0 &&
      customerLocation.longitude !== 0
    ) {
      setIsLoading(false); // Finalizar la carga cuando todos los datos estén disponibles
    }
  }, [deliveryLocation, branchLocation, customerLocation]);

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

  if (
    // Solo espera si faltan datos críticos
    branchLocation.latitude === 0 ||
    branchLocation.longitude === 0 ||
    customerLocation.latitude === 0 ||
    customerLocation.longitude === 0
  ) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Mostrar el mapa aunque deliveryLocation sea null
  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: branchLocation.latitude || 0,
          longitude: branchLocation.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Mostrar la ubicación del delivery si existe */}
        {deliveryLocation && (
          <Marker
            coordinate={deliveryLocation}
            title="Repartidor"
            pinColor="red"
          />
        )}

        {/* Mostrar la ubicación de la sucursal */}
        {branchLocation.latitude !== 0 && branchLocation.longitude !== 0 && (
          <Marker
            coordinate={branchLocation}
            title="Sucursal de origen"
            pinColor="blue"
          />
        )}

        {/* Mostrar la ubicación del cliente */}
        {customerLocation.latitude !== 0 &&
          customerLocation.longitude !== 0 && (
            <Marker
              coordinate={customerLocation}
              title="Ubicación del cliente"
              pinColor="green"
            />
          )}

        {/* Mostrar la ruta hacia la sucursal */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="blue"
            strokeWidth={4}
          />
        )}

        {/* Mostrar la ruta hacia el cliente */}
        {deliveryState >= 3 && customerRouteCoordinates.length > 0 && (
          <Polyline
            coordinates={customerRouteCoordinates}
            strokeColor="green"
            strokeWidth={4}
          />
        )}
      </MapView>
      {!deliveryLocation && (
        <View
          style={{
            position: 'absolute',
            bottom: 32,
            left: 16,
            right: 16,
            alignItems: 'center',
            backgroundColor: Colors.textWhite,
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <PoppinsText style={{ color: Colors.primary }}>
            Esperando ubicación del repartidor...
          </PoppinsText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permitir que el mapa ocupe todo el espacio disponible
  },
  loadingContainer: {
    flex: 1, // Asegura que el indicador de carga ocupe todo el espacio disponible
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeliveryMap;
