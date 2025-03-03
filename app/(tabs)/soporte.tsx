// app/(tabs)/soporte.tsx
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../src/components/PoppinsText';

export default function SoporteScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Soporte</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
