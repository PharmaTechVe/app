import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

export default function DeliveryDetailLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () =>
          navigation.canGoBack() ? (
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={navigation.goBack}>
                <ChevronLeftIcon width={24} height={24} color="#000" />
              </TouchableOpacity>
            </View>
          ) : null,
      })}
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginLeft: -8,
  },
});
