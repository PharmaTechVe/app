// src/screens/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/theme';
import ProductCard from '../../components/Card';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View testID="home-screen" style={styles.container}>
      <PoppinsText>Pantalla Home</PoppinsText>
      <Button
        title="Go to login"
        onPress={() => router.push('/login')}
        variant="primary"
        mode="filled"
        size="large"
      />
      <Button
        title="Go to register"
        onPress={() => router.push('/register')}
        variant="secondary"
        mode="filled"
        size="large"
      />
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <ProductCard
          imageUrl="https://www.hola.com/horizon/landscape/ec878ddab16b-cuidardgatito-t.jpg?im=Resize=(640),type=downsize"
          name="Acetaminofén 500mg x 10..."
          category="Medicamento"
          originalPrice="50.00"
          discount="-20"
          finalPrice="40.00"
        />
        <ProductCard
          imageUrl="https://www.hola.com/horizon/landscape/ec878ddab16b-cuidardgatito-t.jpg?im=Resize=(640),type=downsize"
          name="Otro Medicamento"
          originalPrice="50.00"
          finalPrice="40.00"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
});
