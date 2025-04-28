import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

// Define los tipos para las props del componente
type BadgeProps = {
  status: string;
};

// Mapeo de estados en inglés a colores y etiquetas en español
const STATUS_COLORS: Record<string, string> = {
  requested: Colors.semanticDanger,
  ready_for_pickup: Colors.semanticInfo,
  completed: Colors.semanticSuccess,
  canceled: Colors.semanticDanger,
  in_progress: Colors.secondaryGray,
  approved: Colors.secondary,
};

const STATUS_LABELS: Record<string, string> = {
  requested: 'Pendiente',
  ready_for_pickup: 'A Enviar',
  completed: 'Entregado',
  canceled: 'Cancelado',
  in_progress: 'En Proceso',
  approved: 'Aprobado',
};

const OrderBadge: React.FC<BadgeProps> = ({ status }) => {
  // Normalizamos el estado a minúsculas para evitar problemas de case sensitivity
  const normalizedStatus = status.toLowerCase();

  // Obtener el color y texto correspondiente al estado
  const backgroundColor =
    STATUS_COLORS[normalizedStatus] || STATUS_COLORS.default;
  const label = STATUS_LABELS[normalizedStatus] || STATUS_LABELS.default;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <PoppinsText style={styles.badgeText}>{label}</PoppinsText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    padding: 5,
    borderRadius: 5,
    width: 80,
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: FontSizes.c1.size,
    textAlign: 'center',
  },
});

export default OrderBadge;
