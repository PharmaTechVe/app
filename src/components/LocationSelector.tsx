import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Dropdown from './Dropdown';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';
import { BranchService } from '../services/branches';
import { extractErrorMessage } from '../utils/errorHandler';
import { MapPinIcon } from 'react-native-heroicons/solid';
import BranchMapModal from './BranchMapModal';
import { UserService } from '../services/user';

type Branch = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const LocationSelector = ({
  selectedOption,
  onSelect,
  setSelectedBranch,
}: {
  selectedOption: 'pickup' | 'delivery';
  onSelect: (value: string | null) => void;
  setSelectedBranch: (branch: Branch | null) => void;
}) => {
  const router = useRouter();
  const [pickupBranches, setPickupBranches] = useState<Branch[]>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    { id: string; address: string }[]
  >([]);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(
    null,
  );
  const [noAddresses, setNoAddresses] = useState(false);

  useEffect(() => {
    const resetState = async () => {
      setDropdownKey((prev) => prev + 1);
      onSelect(null);
      setSelectedBranchState(null);

      if (selectedOption === 'pickup') {
        try {
          const response = await BranchService.findAll({});

          // Mapear las sucursales al formato esperado
          const branches = response.results.map((branch) => ({
            id: branch.id,
            name: branch.name,
            latitude: branch.latitude,
            longitude: branch.longitude,
          }));

          setPickupBranches(branches);
        } catch (error) {
          console.error(
            'Error al obtener sucursales:',
            extractErrorMessage(error),
          );
          setPickupBranches([]); // Asegúrate de limpiar el estado en caso de error
        }
      } else if (selectedOption === 'delivery') {
        try {
          const response = await UserService.getUserDirections();

          if (!response.success || response.data.length === 0) {
            setNoAddresses(true);
            setDeliveryAddresses([]);
          } else {
            setNoAddresses(false);
            const addresses = response.data.map((address) => ({
              id: address.id,
              address: address.adress,
            }));
            setDeliveryAddresses(addresses);
          }
        } catch (error) {
          console.error(
            'Error al obtener direcciones:',
            extractErrorMessage(error),
          );
          setNoAddresses(true);
          setDeliveryAddresses([]);
        }
      }
    };

    resetState();
  }, [selectedOption]);

  const options =
    selectedOption === 'pickup'
      ? pickupBranches.map((branch) => branch.name)
      : deliveryAddresses.map((item) => item.address);

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.label}>
        {selectedOption === 'pickup'
          ? 'Seleccione la sucursal'
          : noAddresses
            ? 'No se encontraron direcciones registradas'
            : 'Seleccione la dirección de entrega'}
      </PoppinsText>

      {selectedOption === 'pickup' && pickupBranches.length > 0 && (
        <Dropdown
          key={dropdownKey}
          options={options}
          placeholder="Selecciona una opción"
          onSelect={(val) => {
            const branch = pickupBranches.find((b) => b.name === val);
            setSelectedBranch(branch || null);
            setSelectedBranchState(branch || null);
            onSelect(branch ? branch.id : null);
          }}
          borderColor={Colors.gray_100}
        />
      )}

      {!noAddresses && selectedOption === 'delivery' && (
        <Dropdown
          key={dropdownKey}
          options={options}
          placeholder="Selecciona una opción"
          onSelect={(val) => {
            const selectedAddress = deliveryAddresses.find(
              (item) => item.address === val,
            );
            onSelect(selectedAddress ? selectedAddress.id : null);
          }}
          borderColor={Colors.gray_100}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          selectedOption === 'pickup'
            ? setModalVisible(true)
            : router.push({
                pathname: '/selectLocation',
                params: { fromCheckout: 'true' },
              })
        }
        disabled={selectedOption === 'pickup' && !selectedBranch}
      >
        {selectedOption === 'pickup' && (
          <MapPinIcon
            size={20}
            color={selectedBranch ? Colors.primary : Colors.gray_500}
          />
        )}
        <PoppinsText
          style={[
            styles.buttonText,
            selectedOption === 'pickup' && styles.textWithIcon,
          ]}
        >
          {selectedOption === 'pickup'
            ? 'Ver Ubicación en el Mapa'
            : 'Agregar nueva dirección'}
        </PoppinsText>
      </TouchableOpacity>

      <BranchMapModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        branchName={selectedBranch?.name || null}
        branchCoordinates={
          selectedBranch
            ? {
                latitude: selectedBranch.latitude,
                longitude: selectedBranch.longitude,
              }
            : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    color: Colors.textMain,
  },
  button: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.primary,
  },
  textWithIcon: {
    marginLeft: 6,
  },
  disabledText: {
    color: Colors.gray_500,
  },
});

export default LocationSelector;
