import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';
import { CategoryService } from '../../services/category';

export default function CategoriesScreen() {
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await CategoryService.getCategories(1, 100);
      if (categories.success) {
        console.log(categories.data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <PoppinsText>Pantalla Categorías</PoppinsText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
});
