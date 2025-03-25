import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  count?: number | string;
}

const Badge: React.FC<BadgeProps> = ({ count }) => {
  if (count === undefined || count === null) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 16,
    height: 16,
    borderRadius: 8, // Para que sea completamente circular
    backgroundColor: '#E10000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Badge;
