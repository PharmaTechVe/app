// app/(tabs)/support.tsx
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Soporte</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
