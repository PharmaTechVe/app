import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Promo } from '@pharmatech/sdk';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount?: number;
  promo?: Promo;
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
      const existing = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existing) {
        existing.quantity = action.payload.quantity;
        existing.price = action.payload.price;
        existing.discount = action.payload.discount;
        existing.promo = action.payload.promo;
      } else {
        state.items.push({ ...action.payload });
      }
      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
        discount?: number;
        price?: number;
        promo?: Promo;
      }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (typeof action.payload.discount === 'number') {
          item.discount = action.payload.discount;
        }
        if (typeof action.payload.price === 'number') {
          item.price = action.payload.price;
        }
        if (action.payload.promo) {
          item.promo = action.payload.promo;
        }
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
