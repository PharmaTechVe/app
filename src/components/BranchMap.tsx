import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import PoppinsText from './PoppinsText';

type Branch = {
  id: string;
  name: string;
  address: string;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  stockQuantity: number;
};

type BranchMapProps = {
  branches: Branch[];
};

const BranchMap: React.FC<BranchMapProps> = ({ branches }) => {
  console.log('Branches received in BranchMap:', branches); // Log para inspeccionar las sucursales recibidas

  // Filtrar sucursales con coordenadas válidas
  const validBranches = branches.filter(
    (branch) =>
      branch.latitude !== null &&
      branch.latitude !== undefined &&
      branch.longitude !== null &&
      branch.longitude !== undefined,
  );

  console.log('Valid branches after filtering:', validBranches); // Log para inspeccionar las sucursales válidas

  // Configurar la región inicial del mapa
  const initialRegion =
    validBranches.length > 0
      ? {
          latitude: validBranches[0].latitude!,
          longitude: validBranches[0].longitude!,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }
      : {
          latitude: 37.7749, // Coordenadas predeterminadas (San Francisco)
          longitude: -122.4194,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };

  console.log('Initial region for the map:', initialRegion); // Log para inspeccionar la región inicial del mapa

  return (
    <View style={styles.container}>
      {validBranches.length > 0 ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
        >
          {validBranches.map((branch) => {
            console.log('Rendering Marker for branch:', branch); // Log para inspeccionar cada sucursal
            return (
              <Marker
                key={branch.id}
                coordinate={{
                  latitude: branch.latitude!,
                  longitude: branch.longitude!,
                }}
                title={branch.name}
                description={`Stock: ${branch.stockQuantity ?? 'No disponible'}`} // Manejar undefined
              />
            );
          })}
        </MapView>
      ) : (
        <PoppinsText style={styles.noDataText}>
          No hay sucursales disponibles para mostrar en el mapa.
        </PoppinsText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que el mapa ocupe todo el espacio disponible
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Hace que el mapa ocupe todo el espacio del contenedor
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default BranchMap;
