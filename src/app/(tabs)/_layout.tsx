import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Colors } from '../../styles/theme';
import PoppinsText from '../../components/PoppinsText';
import { View, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <TopBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarStyle: { backgroundColor: Colors.secondaryWhite },
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
          name="categories"
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
          name="branches"
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
          name="offers"
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
          name="support"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
