import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';
import MapViewComponent from '../../components/MapViewComponent';

export default function BranchesScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Sucursales</PoppinsText>
      <View style={styles.mapContainer}>
        <MapViewComponent
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  mapContainer: {
    flex: 1, // Asegura que el mapa ocupe todo el espacio disponible
  },
});
