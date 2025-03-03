// app/(tabs)/offers.tsx
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';

export default function OffersScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Ofertas</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
