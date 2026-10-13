"use client";

import { useState } from "react";
import styles from "./CartList.module.css";

const formatPrice = (value) => `$${value.toFixed(2)}`;

export default function CartList({ initialItems }) {
  const [items, setItems] = useState(initialItems);

  const changeQuantity = (id, delta) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className={styles.cart}>
      <h1 className={styles.title}>Shopping Cart</h1>

      {items.length === 0 ? (
        <p className={styles.empty}>Your cart is empty.</p>
      ) : (
        <>
          <div className={`${styles.row} ${styles.head}`}>
            <span>Product</span>
            <span className={styles.center}>Quantity</span>
            <span className={styles.center}>Price</span>
            <span />
          </div>

          <ul className={styles.list}>
            {items.map(({ id, title, price, quantity, thumbnail }) => (
              <li key={id} className={styles.row}>
                <div className={styles.product}>
                  <img
                    className={styles.image}
                    src={thumbnail}
                    alt={title}
                    width={96}
                    height={96}
                  />
                  <span className={styles.name}>{title}</span>
                </div>

                <div className={styles.quantity}>
                  <button
                    type="button"
                    className={styles.step}
                    onClick={() => changeQuantity(id, -1)}
                    disabled={quantity <= 1}
                    aria-label={`Decrease quantity of ${title}`}
                  >
                    &minus;
                  </button>
                  <span className={styles.count} aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className={styles.step}
                    onClick={() => changeQuantity(id, 1)}
                    aria-label={`Increase quantity of ${title}`}
                  >
                    +
                  </button>
                </div>

                <span className={`${styles.price} ${styles.center}`}>
                  {formatPrice(price * quantity)}
                </span>

                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeItem(id)}
                  aria-label={`Remove ${title} from cart`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13M10 11v6M14 11v6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <p className={styles.total}>
            Total: <strong>{formatPrice(total)}</strong>
          </p>
        </>
      )}
    </section>
  );
}
