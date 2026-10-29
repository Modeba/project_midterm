"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "../components/Products";
import ProductCard from "../components/ProductCard";
import styles from "./page.module.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <div>
      <header className={styles.productsHeader}>
        <h1 className={styles.productsTitle}>
          Products
          <span className={styles.productCount}>({products.length})</span>
        </h1>
      </header>

      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
