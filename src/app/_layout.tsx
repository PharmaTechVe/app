import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router/stack';
import { ChevronLeftIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { Colors } from '../styles/theme';
import { NotificationsProvider } from '../hooks/useNotifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
        setIsAppReady(true); // Marca la app como lista
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NotificationsProvider>
      <Provider store={store}>
        <Stack
          screenOptions={({ navigation }) => ({
            headerBackVisible: false,
            headerStyle: {
              backgroundColor: Colors.bgColor, // Color específico para esta pantalla
            },
            headerShadowVisible: false,
            headerLeft: () =>
              navigation.canGoBack() ? (
                <TouchableOpacity
                  onPress={navigation.goBack}
                  style={{
                    padding: 12, // Aumentado
                    marginLeft: -12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <ChevronLeftIcon width={28} height={28} color="#000" />
                </TouchableOpacity>
              ) : null,
            headerBackTitleVisible: false,
          })}
        >
          {/* Cambia la pantalla inicial al SplashScreen personalizado */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="products" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerTitle: '' }} />
          <Stack.Screen
            name="notifications"
            options={{
              headerShown: false,
              headerTransparent: false,
              headerTitle: '',
            }}
          />
          <Stack.Screen
            name="menu"
            options={{
              headerTitle: '',
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen name="direction" options={{ headerTitle: '' }} />
          <Stack.Screen
            name="selectLocation"
            options={{ headerTitle: '', headerShown: false }}
          />
          <Stack.Screen name="createDirection" options={{ headerTitle: '' }} />
          <Stack.Screen name="orders" options={{ headerTitle: '' }} />
          <Stack.Screen name="order" options={{ headerTitle: '' }} />
          <Stack.Screen name="change-direction" options={{ headerTitle: '' }} />
          <Stack.Screen
            name="register"
            options={{ headerTitle: '', headerTransparent: true }}
          />
          <Stack.Screen
            name="passwordRecovery"
            options={{ headerTitle: '', headerTransparent: true }}
          />
          <Stack.Screen
            name="loggedInPasswordRecovery"
            options={{ headerTitle: '' }}
          />
          <Stack.Screen
            name="success"
            options={{ headerTitle: '', headerTransparent: true }}
          />
          <Stack.Screen
            name="cart"
            options={({ navigation }) => ({
              headerTitle: '',
              headerLeft: undefined,
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <XMarkIcon width={24} height={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="change-password" options={{ headerTitle: '' }} />
          <Stack.Screen
            name="(delivery-tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="deliveryDetail"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="branchDetail" options={{ headerShown: false }} />
          <Stack.Screen
            name="categoryDetail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="deliveryHistoryDetail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="checkout"
            options={({ navigation }) => ({
              headerTitle: '',
              headerTransparent: true,
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{
                    padding: 12,
                    marginLeft: -12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <ChevronLeftIcon width={28} height={28} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="in-progress-order"
            options={{
              headerTitle: '',
              headerTransparent: true,
              headerLeft: undefined,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="active-orders"
            options={{
              headerTitle: '',
            }}
          />
        </Stack>
      </Provider>
    </NotificationsProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
