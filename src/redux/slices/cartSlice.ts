import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  total: number;
};

const initialState: CartState = {
  items: [],
  total: 0,
};

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = calculateTotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
