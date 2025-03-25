import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Ofertas</PoppinsText>
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
