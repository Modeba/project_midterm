import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.js";

export function makeStore() {
  return configureStore({
    reducer: { cart: cartReducer },
  });
}
