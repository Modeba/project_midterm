"use client";

import Link from "next/link";
import { MAX_CART_QUANTITY, useCart } from "../../context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();

  return (
    <div className={styles.cartPage}>
      <header className={styles.pageHeader}>
        <h1>Your cart <span className={styles.itemCount}>{cartCount}</span></h1>
        <p>Review your items and adjust quantities before you continue.</p>
      </header>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Find something you like and add it to your cart.</p>
          <Link href="/" className={styles.shoppingLink}>Browse products</Link>
        </div>
      ) : (
        <div className={styles.cartLayout}>
          <div className={styles.itemList}>
            {cartItems.map((product) => (
              <div key={product.id} className={styles.cartItem}>
                <Link href={`/products/${product.id}`} className={styles.imageLink}>
                  <img src={product.image} alt={product.title} />
                </Link>

                <div className={styles.cartItemInfo}>
                  <h2>
                    <Link href={`/products/${product.id}`}>{product.title}</Link>
                  </h2>
                  <p className={styles.unitPrice}>${product.price.toFixed(2)} each</p>
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
                </div>

                <div className={styles.itemActions}>
                  <p className={styles.subtotal}>
                    <span>Subtotal</span>
                    <strong>${(product.price * product.quantity).toFixed(2)}</strong>
                  </p>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Remove ${product.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className={styles.summary} aria-labelledby="cart-summary">
            <h2 id="cart-summary">Cart summary</h2>
            <p className={styles.summaryRow}><span>Items</span><span>{cartCount}</span></p>
            <p className={styles.cartTotal}><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></p>
            <Link href="/" className={styles.shoppingLink}>Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
