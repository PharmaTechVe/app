import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Dropdown from './Dropdown';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';
import { BranchService } from '../services/branches';
import { extractErrorMessage } from '../utils/errorHandler';
import { MapPinIcon } from 'react-native-heroicons/solid';
import BranchMapModal from './BranchMapModal';
import AddAddressModal from './AddAddressModal';

type Branch = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const LocationSelector = ({
  selectedOption,
  onSelect,
}: {
  selectedOption: 'pickup' | 'delivery' | null;
  onSelect: (value: string | null) => void;
}) => {
  const [pickupBranches, setPickupBranches] = useState<Branch[]>([]);
  const [deliveryData] = useState([
    'Dirección 1',
    'Dirección 2',
    'Dirección 3',
  ]);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const resetState = async () => {
      setDropdownKey((prev) => prev + 1);
      onSelect(null);
      setSelectedBranch(null);

      if (selectedOption === 'pickup') {
        try {
          const response = await BranchService.findAll({});
          if (response.success) {
            setPickupBranches(response.data.results);
          } else {
            console.error('Error fetching branches:', response.error);
          }
        } catch (error) {
          console.error('Error fetching branches:', extractErrorMessage(error));
        }
      }
    };

    resetState();
  }, [selectedOption]);

  const options =
    selectedOption === 'pickup'
      ? pickupBranches.map((branch) => branch.name)
      : deliveryData;

  if (!selectedOption) return null;

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.label}>
        {selectedOption === 'pickup'
          ? 'Seleccione la sucursal'
          : 'Seleccione la dirección de entrega'}
      </PoppinsText>

      <Dropdown
        key={dropdownKey}
        options={options}
        placeholder="Selecciona una opción"
        onSelect={(val) => {
          if (selectedOption === 'pickup') {
            const branch = pickupBranches.find((b) => b.name === val);
            setSelectedBranch(branch || null);
            onSelect(branch ? branch.id : null); // Pass the branch ID (UUID) instead of the name
          } else {
            onSelect(val); // For delivery, pass the selected address
          }
        }}
        borderColor={Colors.gray_100}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          selectedOption === 'pickup'
            ? setModalVisible(true)
            : setAddAddressModalVisible(true)
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
            selectedOption === 'pickup' &&
              !selectedBranch &&
              styles.disabledText,
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

      <AddAddressModal
        visible={addAddressModalVisible}
        onClose={() => setAddAddressModalVisible(false)}
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
