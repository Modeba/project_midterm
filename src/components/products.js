export async function fetchProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  const data = await response.json();

  return data;
}

export async function fetchProduct(productId, { signal } = {}) {
  if (!/^[1-9]\d*$/.test(productId)) {
    return null;
  }

  const response = await fetch(
    `https://fakestoreapi.com/products/${productId}`,
    { signal }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load this product. Please try again later.");
  }

  const body = await response.text();
  return body.trim() ? JSON.parse(body) : null;
}
