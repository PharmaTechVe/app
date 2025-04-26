// src/redux/slices/checkoutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PurchaseOption = 'pickup' | 'delivery' | null;
export type PaymentOption =
  | 'punto_de_venta'
  | 'efectivo'
  | 'transferencia'
  | 'pago_movil'
  | null;

interface CheckoutState {
  step: number;
  option: PurchaseOption;
  payment: PaymentOption;
  locationId: string | null;
  paymentInfoValid: boolean;
  couponDiscount: number;
  couponApplied: boolean;
}

const initialState: CheckoutState = {
  step: 1,
  option: 'pickup',
  payment: null,
  locationId: null,
  paymentInfoValid: false,
  couponDiscount: 0,
  couponApplied: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    setOption(state, action: PayloadAction<PurchaseOption>) {
      state.option = action.payload;
    },
    setPayment(state, action: PayloadAction<PaymentOption>) {
      state.payment = action.payload;
    },
    setLocationId(state, action: PayloadAction<string | null>) {
      state.locationId = action.payload;
    },
    setPaymentInfoValid(state, action: PayloadAction<boolean>) {
      state.paymentInfoValid = action.payload;
    },
    setCouponDiscount(state, action: PayloadAction<number>) {
      state.couponDiscount = action.payload;
    },
    setCouponApplied(state, action: PayloadAction<boolean>) {
      state.couponApplied = action.payload;
    },
    resetCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setStep,
  setOption,
  setPayment,
  setLocationId,
  setPaymentInfoValid,
  setCouponDiscount,
  setCouponApplied,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
