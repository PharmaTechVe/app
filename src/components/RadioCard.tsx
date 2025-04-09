import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';

interface RadioCardProps {
  label: string;
  icon: React.ReactNode;
}

const RadioCard: React.FC<RadioCardProps> = ({ label, icon }) => {
  const [selected, setSelected] = useState(false);

  const handlePress = () => {
    setSelected(!selected);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
      onPress={handlePress}
    >
      <View style={styles.radioCircle}>
        {selected && <View style={styles.radioCircleInner} />}
      </View>
      <Text
        style={[
          styles.label,
          selected ? styles.selectedLabel : styles.unselectedLabel,
        ]}
      >
        {label}
      </Text>
      <View style={styles.icon}>{icon}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70, // Altura estándar
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    width: '100%', // Asegura que ocupe todo el ancho disponible
  },
  selectedContainer: {
    borderColor: Colors.primary_600,
    backgroundColor: '#ECEFFA', // Color primario con opacidad (20%)
  },
  unselectedContainer: {
    borderColor: Colors.gray_100,
    backgroundColor: Colors.secondaryWhite,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.gray_100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondaryWhite, // Círculo interno blanco
  },
  label: {
    flex: 1,
    fontSize: FontSizes.b1.size,
    fontFamily: 'Poppins_500Medium',
  },
  selectedLabel: {
    color: Colors.textMain,
  },
  unselectedLabel: {
    color: Colors.textLowContrast,
  },
  icon: {
    marginLeft: 12,
  },
});

export default RadioCard;
