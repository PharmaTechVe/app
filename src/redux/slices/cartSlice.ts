import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount?: number;
};

type CartState = {
  userId: string | null;
  items: CartItem[];
  total: number;
};

const initialState: CartState = {
  userId: null,
  items: [],
  total: 0,
};

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
      if (!action.payload) {
        state.items = [];
        state.total = 0;
      }
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
        existingItem.discount = action.payload.discount;
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

export const { setUserId, addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
