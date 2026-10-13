async function getProducts() {
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) {
    throw new Error(`Failed to fetch products (status ${res.status})`);
  }

  const data = await res.json();
  return data.products;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}