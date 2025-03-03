// app/(tabs)/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/styles/theme';
import PoppinsText from '../../src/components/PoppinsText';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary, // Puedes reemplazarlo por Colors.primary o el color de tu design system
        tabBarStyle: { backgroundColor: Colors.secondaryWhite }, // Ajusta el fondo según el design system
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ color }) => (
            <PoppinsText style={{ color: color, fontSize: 10 }}>
              Home
            </PoppinsText>
          ),
          headerShown: false,
          title: 'home',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="categorias"
        options={{
          tabBarLabel: ({ color }) => (
            <PoppinsText style={{ color: color, fontSize: 10 }}>
              Categorías
            </PoppinsText>
          ),
          headerShown: false,
          title: 'Categorías',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="th-list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sucursales"
        options={{
          tabBarLabel: ({ color }) => (
            <PoppinsText style={{ color: color, fontSize: 10 }}>
              Sucursales
            </PoppinsText>
          ),
          title: 'Sucursales',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="map-marker" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ofertas"
        options={{
          tabBarLabel: ({ color }) => (
            <PoppinsText style={{ color: color, fontSize: 10 }}>
              Ofertas
            </PoppinsText>
          ),
          title: 'Ofertas',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="tags" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="soporte"
        options={{
          tabBarLabel: ({ color }) => (
            <PoppinsText style={{ color: color, fontSize: 10 }}>
              Soporte
            </PoppinsText>
          ),
          title: 'Soporte',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="life-ring" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
