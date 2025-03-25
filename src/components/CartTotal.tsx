import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Text } from 'react-native';

const CartTotal = () => {
  const total = useSelector((state: RootState) => state.cart.total);

  return <Text>Total del carrito: ${total}</Text>;
};

export default CartTotal;
