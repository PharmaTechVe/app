import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCartIcon } from 'react-native-heroicons/outline';
import Logo from '../assets/images/logos/PharmaTech_Logo.svg';
import SearchInput from './SearchInput';
import { Colors } from '../styles/theme';
import { useRouter } from 'expo-router';
import Avatar from './Avatar';

const TopBar = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    // Search logic
    console.log('Texto de búsqueda:', searchText);
  };

  return (
    <View style={styles.container}>
      {/* Upper section */}
      <View style={styles.topSection}>
        {/* Left user icon */}
        <TouchableOpacity style={styles.iconButton}>
          <Avatar />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo width={118} height={48} />
        </View>

        {/* Right cart icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            router.push('/cart');
          }}
        >
          <ShoppingCartIcon size={26} color={Colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearchPress={handleSearch}
        style={styles.searchInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    paddingRight: 4,
  },
  searchInput: {
    backgroundColor: Colors.menuWhite,
    borderWidth: 1,
    borderColor: Colors.stroke,
    height: 32,
    borderRadius: 50,
  },
});

export default TopBar;
