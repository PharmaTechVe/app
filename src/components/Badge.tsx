import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles/theme';

interface BadgeProps {
  count?: number | string;
  color?: string;
  textColor?: string;
  size?: 'small' | 'medium' | 'large';
}

const Badge: React.FC<BadgeProps> = ({
  count,
  color = Colors.semanticDanger,
  textColor = Colors.textWhite,
  size = 'medium',
}) => {
  if (count === undefined || count === null) return null;

  const badgeSizes = {
    small: { width: 16, height: 16, fontSize: 10 },
    medium: { width: 20, height: 20, fontSize: 12 },
    large: { width: 26, height: 26, fontSize: 14 },
  };

  const { width, height, fontSize } = badgeSizes[size];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color, width, height, borderRadius: width / 2 },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default Badge;
