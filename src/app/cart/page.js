"use client";

import Link from "next/link";
import { MAX_CART_QUANTITY, useCart } from "../../context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className={styles.cartPage}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link href="/">Browse products</Link>
        </p>
      ) : (
        <>
          {cartItems.map((product) => (
            <div key={product.id} className={styles.cartItem}>
              <Link href={`/products/${product.id}`}>
                <img src={product.image} alt={product.title} />
              </Link>

              <div className={styles.cartItemInfo}>
                <h2>
                  <Link href={`/products/${product.id}`}>{product.title}</Link>
                </h2>
                <p>Price: ${product.price.toFixed(2)}</p>
                <label className={styles.quantityControl}>
                  Quantity:
                  <select
                    value={product.quantity}
                    onChange={(event) =>
                      updateQuantity(product.id, Number(event.target.value))
                    }
                    aria-label={`Quantity for ${product.title}`}
                  >
                    {Array.from({ length: MAX_CART_QUANTITY }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <p>Subtotal: ${(product.price * product.quantity).toFixed(2)}</p>
              </div>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeFromCart(product.id)}
                aria-label={`Remove ${product.title} from cart`}
              >
                Remove
              </button>
            </div>
          ))}
          <p className={styles.cartTotal}>Total: ${cartTotal.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}
