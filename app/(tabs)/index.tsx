// app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../src/components/PoppinsText';

export default function HomeScreen() {
  return (
    <View testID="home-screen" style={styles.container}>
      <PoppinsText>Pantalla Home</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
