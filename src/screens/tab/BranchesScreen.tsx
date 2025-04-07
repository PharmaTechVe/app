import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';

export default function BranchesScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Sucursales</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
});
