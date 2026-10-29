import { createSlice } from "@reduxjs/toolkit";

export const MAX_CART_QUANTITY = 10;

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + 1, MAX_CART_QUANTITY);
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) {
        return;
      }

      const item = state.items.find((product) => product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + Math.round(item.price * 100) * item.quantity,
    0
  ) / 100;

export default cartSlice.reducer;
