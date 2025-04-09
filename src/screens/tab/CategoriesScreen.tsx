import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';
import RadioCard from '../../components/RadioCard';
import { ShoppingBagIcon } from 'react-native-heroicons/outline';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Categorías</PoppinsText>
      <RadioCard
        label="Categoría 1"
        icon={<ShoppingBagIcon color={Colors.textMain} />}
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
