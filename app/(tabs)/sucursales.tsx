// app/(tabs)/sucursales.tsx
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../src/components/PoppinsText';

export default function SucursalesScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Sucursales</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
