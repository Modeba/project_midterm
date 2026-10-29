"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`} className="product-link">
        <img src={product.image} alt={product.title} />
        <h2>{product.title}</h2>
        <p>${product.price.toFixed(2)}</p>
      </Link>
      <AddToCartButton product={product} />
    </div>
  );
}
