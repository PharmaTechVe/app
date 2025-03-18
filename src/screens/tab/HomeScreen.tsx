import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors, FontSizes } from '../../styles/theme';
import Carousel from '../../components/Carousel';

type ProductCardType = {
  imageUrl: string;
  name: string;
  category: string;
  originalPrice: string;
  discount: string;
  finalPrice: string;
  getQuantity?: (count: number) => void;
};

const products: ProductCardType[] = [
  {
    imageUrl: 'https://example.com/images/product1.jpg',
    name: 'Smartphone X',
    category: 'Electronics',
    originalPrice: '799',
    discount: '20',
    finalPrice: '639',
    getQuantity: (count: number) => console.log(`Quantity selected: ${count}`),
  },
  {
    imageUrl: 'https://example.com/images/product2.jpg',
    name: 'Wireless Headphones',
    category: 'Audio',
    originalPrice: '199',
    discount: '15',
    finalPrice: '169',
  },
  {
    imageUrl: 'https://example.com/images/product3.jpg',
    name: 'Smart Watch',
    category: 'Wearables',
    originalPrice: '249',
    discount: '10',
    finalPrice: '224',
  },
  {
    imageUrl: 'https://example.com/images/product4.jpg',
    name: 'Laptop Pro',
    category: 'Computers',
    originalPrice: '1499',
    discount: '25',
    finalPrice: '1124',
    getQuantity: (count: number) => console.log(`Quantity selected: ${count}`),
  },
  {
    imageUrl: 'https://example.com/images/product5.jpg',
    name: 'Tablet Mini',
    category: 'Tablets',
    originalPrice: '399',
    discount: '30',
    finalPrice: '279',
  },
];
import React from 'react';
import { View, StyleSheet /* Alert */ } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
//import Button from '../../components/Button';
//import { useRouter } from 'expo-router';
import { Colors } from '../../styles/theme';
//import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  useEffect(() => {
    try {
      const k = 1;
      console.log(k);
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }; */

  return (
    <View testID="home-screen" style={styles.container}>
      <View>
        <PoppinsText style={styles.title}>Ofertas especiales</PoppinsText>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Carousel cards={products} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: Colors.bgColor,
  },
  title: {
    fontSize: FontSizes.s1.size,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});
