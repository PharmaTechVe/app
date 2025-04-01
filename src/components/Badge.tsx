import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from './PoppinsText';

interface BadgeProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const Badge: React.FC<BadgeProps> = ({ text, size = 'medium' }) => {
  // Tamaños predefinidos
  const sizes = {
    small: { width: 8, height: 8, borderRadius: 4, fontSize: 0 }, // Punto sin texto
    medium: { width: 16, height: 16, borderRadius: 8, fontSize: 10 },
    large: { width: 31, height: 16, borderRadius: 8, fontSize: 12 },
  };

  const style = sizes[size];

  return (
    <View style={[styles.badge, style]}>
      {text ? (
        <PoppinsText
          weight="semibold"
          style={[styles.text, { fontSize: style.fontSize }]}
        >
          {text}
        </PoppinsText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#E10000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: 4, // Espaciado para textos largos
  },
  text: {
    color: '#FFFFFF',
  },
});

export default Badge;
