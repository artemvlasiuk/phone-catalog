/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product } from '../types/Product';
import { saveState } from './utils';

export interface CartState {
  cart: Product[];
  totalInCart: number;
  totalPrice: number;
  quantities: { [key: string]: number };
}

const initialCart = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart') as string)
  : [];

const initialTotalInCart = localStorage.getItem('totalInCart')
  ? JSON.parse(localStorage.getItem('totalInCart') as string)
  : 0;

const initialTotalPrice = localStorage.getItem('totalPrice')
  ? JSON.parse(localStorage.getItem('totalPrice') as string)
  : 0;

const initialQuantities = localStorage.getItem('quantities')
  ? JSON.parse(localStorage.getItem('quantities') as string)
  : {};

const initialState: CartState = {
  cart: initialCart,
  totalInCart: initialTotalInCart,
  totalPrice: initialTotalPrice,
  quantities: initialQuantities,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const itemIndex = state.cart.findIndex(
        item => item.itemId === action.payload.itemId,
      );

      if (itemIndex < 0) {
        state.cart.push(action.payload);
        state.quantities[action.payload.itemId] = 1;
      } else {
        state.quantities[action.payload.itemId] += 1;
      }

      state.totalInCart += 1;
      state.totalPrice += action.payload.price;
      saveState(state);
    },
    removeFromCart: (state, action: PayloadAction<Product['itemId']>) => {
      const index = state.cart.findIndex(
        item => item.itemId === action.payload,
      );

      if (index >= 0) {
        const quantity = state.quantities[state.cart[index].itemId];

        state.totalPrice -= state.cart[index].price * quantity;
        delete state.quantities[state.cart[index].itemId];
        state.cart.splice(index, 1);
        state.totalInCart -= quantity;
        saveState(state);
      }
    },
    increaseQuantity: (state, action: PayloadAction<Product['itemId']>) => {
      if (state.quantities[action.payload]) {
        const foundItem = state.cart.find(
          item => item.itemId === action.payload,
        );

        if (foundItem) {
          state.quantities[action.payload] += 1;
          state.totalPrice += foundItem.price;
          state.totalInCart += 1;
        }
      }

      saveState(state);
    },
    decreaseQuantity: (state, action: PayloadAction<Product['itemId']>) => {
      if (
        state.quantities[action.payload] &&
        state.quantities[action.payload] > 1
      ) {
        const foundItem = state.cart.find(
          item => item.itemId === action.payload,
        );

        if (foundItem) {
          state.quantities[action.payload] -= 1;
          state.totalPrice -= foundItem.price;
          state.totalInCart -= 1;
        }
      }

      saveState(state);
    },
    clearCart: state => {
      state.cart = [];
      state.totalInCart = 0;
      state.totalPrice = 0;
      state.quantities = {};
      saveState(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
