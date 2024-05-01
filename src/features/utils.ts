import { CartState } from './cartSlice';

export const saveState = (state: CartState) => {
  localStorage.setItem('cart', JSON.stringify(state.cart));
  localStorage.setItem('totalInCart', JSON.stringify(state.totalInCart));
  localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
  localStorage.setItem('quantities', JSON.stringify(state.quantities));
};
