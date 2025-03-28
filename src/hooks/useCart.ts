import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addItem,
  removeItem,
  updateQuantity,
  CartItem,
} from '../redux/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);

  const addToCart = (item: CartItem) => {
    dispatch(addItem(item));
  };

  const removeFromCart = (id: string) => {
    dispatch(removeItem(id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const getItemQuantity = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    total,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getItemQuantity,
  };
};
