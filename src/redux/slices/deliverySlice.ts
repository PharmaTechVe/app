import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderDeliveryDetailedResponse } from '@pharmatech/sdk';

interface DeliveryState {
  orders: Record<string, OrderDeliveryDetailedResponse>; // Almacenar múltiples órdenes por ID
  deliveryState: Record<string, number>; // Estado de entrega por ID de orden
}

const initialState: DeliveryState = {
  orders: {},
  deliveryState: {},
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setOrderDetails(
      state,
      action: PayloadAction<{
        id: string;
        details: OrderDeliveryDetailedResponse;
      }>,
    ) {
      state.orders[action.payload.id] = action.payload.details;
    },
    setDeliveryState(
      state,
      action: PayloadAction<{ id: string; state: number }>,
    ) {
      state.deliveryState[action.payload.id] = action.payload.state;
    },
    resetOrderState(state, action: PayloadAction<string>) {
      delete state.orders[action.payload];
      delete state.deliveryState[action.payload];
    },
  },
});

export const { setOrderDetails, setDeliveryState, resetOrderState } =
  deliverySlice.actions;
export default deliverySlice.reducer;
