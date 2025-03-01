// App.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import PoppinsText from './components/PoppinsText';
import { Colors, FontSizes } from './styles/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
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

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <PoppinsText
        weight="regular"
        style={{ fontSize: 20, color: Colors.secondary }}
      >
        Open up App.tsx to start working on your app!
      </PoppinsText>
      <PoppinsText weight="semibold" style={{ fontSize: 20, color: 'black' }}>
        Esto es Poppins semibold.
      </PoppinsText>
      {/* Para aplicar colores y tamaños del design system, puedes usar style y/o tus tokens */}
      <PoppinsText
        weight="semibold"
        style={{
          fontSize: FontSizes.h1.size,
          lineHeight: FontSizes.h1.lineHeight,
          color: Colors.secondaryLight,
        }}
      >
        Texto con color secundario claro y tamaño h1
      </PoppinsText>
      <PoppinsText weight="semibold" style={styles.title}>
        Esto es una prueba
      </PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.semanticDanger,
    fontSize: FontSizes.h3.size,
    lineHeight: FontSizes.h3.lineHeight,
  },
});
