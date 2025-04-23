import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ListRenderItem,
} from 'react-native';
import PoppinsText from '../../components/PoppinsText';
import { Colors } from '../../styles/theme';
import Alert from '../../components/Alerts';
import { CategoryService } from '../../services/category';
import { CategoryResponse } from '@pharmatech/sdk';
import CategoryDefaultImg from '../../assets/images/defaults/category.png';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categories = await CategoryService.getCategories(1, 100);
        if (categories.success) setCategories(categories.data.results);
      } catch (error) {
        console.log(error);
        setErrorMessage('Ocurrio un error');
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const renderItem: ListRenderItem<CategoryResponse> = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => console.log('Category selected:', item)}
    >
      <Image source={CategoryDefaultImg} />
      <PoppinsText style={styles.categoryText}>{item.name}</PoppinsText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.alertContainer}>
        {showErrorAlert && (
          <Alert
            type="error"
            title="Error"
            message={errorMessage}
            onClose={() => setShowErrorAlert(false)}
            borderColor
          />
        )}
      </View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
    flex: 1,
  },
  alertContainer: {
    position: 'absolute',
    width: 326,
    left: '50%',
    marginLeft: -162,
    top: 20,
    right: 0,
    zIndex: 1000,
  },
  listContainer: {
    marginHorizontal: 10,
  },
  gridItem: {
    flex: 1,
    margin: 10,
    maxWidth: 150,
    padding: 15,
    borderRadius: 15,
    backgroundColor: Colors.textWhite,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray_100,
  },
  categoryText: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
});
