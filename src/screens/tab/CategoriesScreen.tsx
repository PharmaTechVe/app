import React from 'react';
import { View } from 'react-native';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6FAFF',
      }}
    >
      <Button
        title="Cambio de Contraseña"
        onPress={() => router.push('/change-password')}
        variant="primary"
        mode="filled"
        size="large"
      />
    </View>
  );
}
