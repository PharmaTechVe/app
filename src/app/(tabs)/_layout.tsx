import {
  HomeIcon,
  ListBulletIcon,
  MapPinIcon,
  TagIcon,
  LifebuoyIcon,
} from 'react-native-heroicons/outline';
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
            tabBarIcon: () => (
              <HomeIcon width={24} height={24} color={Colors.primary} />
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
            tabBarIcon: () => (
              <ListBulletIcon width={24} height={24} color={Colors.primary} />
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
            tabBarIcon: () => (
              <MapPinIcon width={24} height={24} color={Colors.primary} />
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
            tabBarIcon: () => (
              <TagIcon width={24} height={24} color={Colors.primary} />
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
            tabBarIcon: () => (
              <LifebuoyIcon width={24} height={24} color={Colors.primary} />
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
