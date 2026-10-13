import ProductCard from "../../components/ProductCard";
import styles from "./page.module.css";

async function getProducts() {
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) {
    throw new Error(`Failed to fetch products (status ${res.status})`);
  }

  const data = await res.json();
  return data.products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Products</h1>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </main>
  );
}
