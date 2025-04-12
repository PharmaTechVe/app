import { View, StyleSheet } from 'react-native';
import Dropdown from './Dropdown';
import PoppinsText from './PoppinsText';
import { Colors } from '../styles/theme';

const LocationSelector = ({
  selectedOption,
  onSelect,
}: {
  selectedOption: 'pickup' | 'delivery' | null;
  onSelect: (value: string) => void;
}) => {
  const pickupData = [
    { label: 'Sucursal 1', value: '1' },
    { label: 'Sucursal 2', value: '2' },
    { label: 'Sucursal 3', value: '3' },
  ].map((item) => item.label);

  const deliveryData = [
    { label: 'Dirección 1', value: '1' },
    { label: 'Dirección 2', value: '2' },
    { label: 'Dirección 3', value: '3' },
  ].map((item) => item.label);

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
        options={options}
        placeholder="Selecciona una opción"
        onSelect={(val) => onSelect(val)}
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
