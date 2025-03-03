// app/(tabs)/categories.tsx
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Categorías</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
