import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Dropdown from './Dropdown';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';
import { BranchService } from '../services/branches';
import { extractErrorMessage } from '../utils/errorHandler';

const LocationSelector = ({
  selectedOption,
  onSelect,
}: {
  selectedOption: 'pickup' | 'delivery' | null;
  onSelect: (value: string | null) => void;
}) => {
  const [pickupData, setPickupData] = useState<string[]>([]);
  const [deliveryData] = useState([
    'Dirección 1',
    'Dirección 2',
    'Dirección 3',
  ]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [dropdownKey, setDropdownKey] = useState(0); // Forzar reinicio del Dropdown

  useEffect(() => {
    const resetState = async () => {
      // Reset value y forzar reinicio visual
      setSelectedValue(null);
      setDropdownKey((prev) => prev + 1); // Cambiar key para forzar remount
      onSelect(null); // Notificar al padre

      if (selectedOption === 'pickup') {
        try {
          const response = await BranchService.findAll({});
          if (response.success) {
            setPickupData(response.data.results.map((branch) => branch.name));
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

  const options = selectedOption === 'pickup' ? pickupData : deliveryData;

  if (!selectedOption) return null;

  return (
    <View style={styles.container}>
      <PoppinsText style={styles.label}>
        {selectedOption === 'pickup'
          ? 'Seleccione la sucursal'
          : 'Seleccione la dirección de entrega'}
      </PoppinsText>
      <Dropdown
        key={dropdownKey} // Forzar remount del Dropdown cuando cambia pickup/delivery
        options={options}
        placeholder="Selecciona una opción"
        onSelect={(val) => {
          setSelectedValue(val);
          onSelect(val);
        }}
        selectedValue={selectedValue}
        borderColor={Colors.gray_100}
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
});

export default LocationSelector;
