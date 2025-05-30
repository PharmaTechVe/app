import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice'; // Importa el reducer del carrito
import deliveryReducer from './slices/deliverySlice'; // Importa el reducer de entrega
import checkoutReducer from './slices/checkoutSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer, // Conecta el slice del carrito
    delivery: deliveryReducer,
    checkout: checkoutReducer,
  },
  devTools: true, // Habilita Redux DevTools
});

// Tipos para el store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
