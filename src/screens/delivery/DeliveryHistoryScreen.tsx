import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';

export default function DeliveryHistoryScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText style={styles.title}>Historial de Pedidos</PoppinsText>
      {/* Aquí se mostrará el historial de pedidos */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textMain,
    marginBottom: 16,
  },
});
