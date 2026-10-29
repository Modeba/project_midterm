"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, MAX_CART_QUANTITY, selectCartItems } from "../store/cartSlice";

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) =>
    selectCartItems(state).find((item) => item.id === product.id)
  );
  const isAtLimit = cartItem?.quantity >= MAX_CART_QUANTITY;

  return (
    <>
      <button
        type="button"
        className="add-to-cart-button"
        onClick={() => dispatch(addToCart(product))}
        disabled={isAtLimit}
      >
        {isAtLimit ? `Limit reached (${MAX_CART_QUANTITY})` : "Add to cart"}
      </button>
      <p role="status" className="cart-status">
        {cartItem ? `${cartItem.quantity} in cart` : ""}
      </p>
    </>
  );
}
