"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "../components/Products";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

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
      <h1>Products ({products.length})</h1>

      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
      
      <Footer />

    </div>
  );
}