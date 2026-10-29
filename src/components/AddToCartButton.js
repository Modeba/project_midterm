"use client";

import { MAX_CART_QUANTITY, useCart } from "../context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart, cartItems } = useCart();
  const cartItem = cartItems.find((item) => item.id === product.id);
  const isAtLimit = cartItem?.quantity >= MAX_CART_QUANTITY;

  return (
    <>
      <button
        type="button"
        className="add-to-cart-button"
        onClick={() => addToCart(product)}
        disabled={isAtLimit}
      >
        {isAtLimit ? "Maximum quantity reached" : "Add to cart"}
      </button>
      <p role="status" className="cart-status">
        {cartItem ? `${cartItem.quantity} in cart` : ""}
      </p>
    </>
  );
}
