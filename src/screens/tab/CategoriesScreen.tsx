// src/screens/CategoriesScreen.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Toggles from '../../components/Toggle';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';

export default function CategoriesScreen() {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6FAFF',
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Toggle is {isToggled ? 'ON' : 'OFF'}
      </Text>
      <Toggles value={isToggled} onChange={setIsToggled} size="medium" />

      {/* Espacio entre los componentes */}
      <View style={{ height: 50 }} />

      {/* Badge de Notificaciones */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Badge Prueba</Text>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: '#ddd',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>🔔</Text>
        <Badge count={3} />
      </View>

      {/* Espacio entre los componentes */}
      <View style={{ height: 50 }} />

      {/* Avatar */}
      <Avatar
        uri="https://randomuser.me/api/portraits/men/1.jpg"
        name="Carlos"
        size="large"
      />
    </View>
  );
}
