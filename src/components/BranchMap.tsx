import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../styles/theme';
import { MapPinIcon } from 'react-native-heroicons/solid';
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

// Componente Marker personalizado con React.memo
const CustomMarker = React.memo(({ branch }: { branch: Branch }) => (
  <Marker
    key={branch.id}
    coordinate={{
      latitude: branch.latitude!,
      longitude: branch.longitude!,
    }}
    title={branch.name}
    description={`Stock: ${branch.stockQuantity ?? 'No disponible'}`}
  >
    <View style={styles.customMarker}>
      <MapPinIcon size={32} color={Colors.primary} />
    </View>
  </Marker>
));

CustomMarker.displayName = 'CustomMarker';

const BranchMap: React.FC<BranchMapProps> = ({ branches }) => {
  // Memorizar las sucursales válidas
  const validBranches = useMemo(
    () =>
      branches.filter(
        (branch) =>
          branch.latitude !== null &&
          branch.latitude !== undefined &&
          branch.longitude !== null &&
          branch.longitude !== undefined,
      ),
    [branches],
  );

  const initialRegion = useMemo(
    () =>
      validBranches.length > 0
        ? {
            latitude: validBranches[0].latitude!,
            longitude: validBranches[0].longitude!,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }
        : {
            latitude: 10.0678, // Coordenadas de Barquisimeto, estado Lara, Venezuela
            longitude: -69.3467,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          },
    [validBranches],
  );

  return (
    <View style={styles.container}>
      {validBranches.length > 0 ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
        >
          {validBranches.map((branch) => (
            <CustomMarker key={branch.id} branch={branch} />
          ))}
        </MapView>
      ) : (
        <View style={styles.noDataContainer}>
          <PoppinsText style={styles.noDataText}>
            No hay sucursales disponibles para mostrar en el mapa.
          </PoppinsText>
        </View>
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BranchMap;
