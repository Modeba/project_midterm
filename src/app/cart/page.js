import styles from "./cart.module.css";

export default function CartPage() {
  return (
    <div className={styles.cartPage}>
      <h1>Your Cart</h1>

      <div className={styles.cartItem}>
        <img
          src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
          alt="Product"
        />

        <div className={styles.cartItemInfo}>
          <h2>Sample Product</h2>
          <p>Price: $109.95</p>
          <p>Quantity: 1</p>
        </div>

        <button className={styles.removeButton}>Remove</button>
      </div>
    </div>
  );
}