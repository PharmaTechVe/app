import React, { useEffect } from 'react';
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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack
        screenOptions={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () =>
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={navigation.goBack}>
                <ChevronLeftIcon width={24} height={24} color="#000" />
              </TouchableOpacity>
            ) : null,
          headerBackTitleVisible: false,
        })}
      >
        <Stack.Screen name="index" redirect={true} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="productDetail" options={{ headerShown: false }} />
        <Stack.Screen
          name="register"
          options={{ headerTitle: '', headerTransparent: true }}
        />
        <Stack.Screen
          name="passwordRecovery"
          options={{ headerTitle: '', headerTransparent: true }}
        />
        <Stack.Screen
          name="success"
          options={{ headerTitle: '', headerTransparent: true }}
        />
        <Stack.Screen
          name="cart"
          options={({ navigation }) => ({
            headerTitle: '',
            headerTransparent: true,
            headerLeft: undefined,
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <XMarkIcon width={24} height={24} color="#000" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="change-password"
          options={{ headerTitle: '', headerTransparent: true }}
        />
      </Stack>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
