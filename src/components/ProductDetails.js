"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProduct } from "./Products";
import AddToCartButton from "./AddToCartButton";
import styles from "./ProductDetails.module.css";

export default function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        const data = await fetchProduct(productId, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setProduct(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load this product. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [productId]);

  return (
    <div className={styles.productPage}>
      <Link href="/" className={styles.backLink}>Back to products</Link>

      {isLoading ? (
        <p role="status">Loading product...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : !product ? (
        <h1>Product not found.</h1>
      ) : (
        <article className={styles.product}>
          <img src={product.image} alt={product.title} className={styles.image} />
          <div className={styles.details}>
            <p className={styles.category}>{product.category}</p>
            <h1>{product.title}</h1>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <p>{product.description}</p>
            <AddToCartButton product={product} />
            <Link href="/cart" className={styles.cartLink}>View cart</Link>
          </div>
        </article>
      )}
    </div>
  );
}
