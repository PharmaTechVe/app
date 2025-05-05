import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

export default function BranchDetailLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () =>
          navigation.canGoBack() ? (
            <View style={styles.iconContainer}>
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
