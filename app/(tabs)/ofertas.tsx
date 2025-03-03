// app/(tabs)/ofertas.tsx
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../src/components/PoppinsText';

export default function OfertasScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Ofertas</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
