import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import { useRouter } from 'expo-router';

const AvatarWithMenu: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('menu')}>
        <Avatar />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -15,
    left: 0,
    zIndex: 100,
  },
});

export default AvatarWithMenu;
