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
      <ProductCard
        name="Otro Medicamento"
        originalPrice="50.00"
        discount="20"
        finalPrice="40.00"
      />
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
