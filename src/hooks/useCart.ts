import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addItem,
  removeItem,
  updateQuantity,
  CartItem,
  setUserId,
} from '../redux/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);
  const userId = useSelector((state: RootState) => state.cart.userId);

  const addToCart = (item: CartItem) => {
    if (item.quantity <= 0) return; // <-- NO agregar si cantidad es 0
    console.log('[addToCart] Item añadido al carrito:', item); // <-- LOG
    dispatch(addItem(item));
  };

  const removeFromCart = (id: string) => {
    dispatch(removeItem(id));
  };

  const updateCartQuantity = (
    id: string,
    quantity: number,
    discount?: number,
    price?: number,
  ) => {
    // Busca el item actual en el carrito
    const item = cartItems.find((item) => item.id === id);
    dispatch(
      updateQuantity({
        id,
        quantity,
        discount: typeof discount === 'number' ? discount : item?.discount,
        price: typeof price === 'number' ? price : item?.price,
      }),
    );
  };

  const getItemQuantity = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const setCartUserId = (id: string | null) => {
    dispatch(setUserId(id));
  };

  return {
    cartItems,
    total,
    userId,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getItemQuantity,
    setCartUserId,
  };
};
