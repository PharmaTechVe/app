import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../styles/theme';
import PoppinsText from '../../components/PoppinsText';
import {
  HomeIcon,
  ClockIcon,
  LifebuoyIcon,
} from 'react-native-heroicons/outline';
import TopBarDelivery from '../../components/TopBarDelivery';
import { AlertProvider } from '../../components/AlertProvider'; // Importar el AlertProvider

export default function DeliveryTabLayout() {
  return (
    <AlertProvider>
      <View style={styles.container}>
        <TopBarDelivery />
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
              title: 'Home',
              tabBarIcon: () => (
                <HomeIcon width={24} height={24} color={Colors.primary} />
              ),
            }}
          />
          <Tabs.Screen
            name="deliveryHistory"
            options={{
              tabBarLabel: ({ color }) => (
                <PoppinsText style={{ color: color, fontSize: 10 }}>
                  Historial
                </PoppinsText>
              ),
              headerShown: false,
              title: 'Historial',
              tabBarIcon: () => (
                <ClockIcon width={24} height={24} color={Colors.primary} />
              ),
            }}
          />
          <Tabs.Screen
            name="deliverySupport"
            options={{
              tabBarLabel: ({ color }) => (
                <PoppinsText style={{ color: color, fontSize: 10 }}>
                  Soporte
                </PoppinsText>
              ),
              headerShown: false,
              title: 'Soporte',
              tabBarIcon: () => (
                <LifebuoyIcon width={24} height={24} color={Colors.primary} />
              ),
            }}
          />
        </Tabs>
      </View>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
