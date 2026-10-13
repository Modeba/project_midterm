async function getCart() {
  const res = await fetch("https://dummyjson.com/carts/1");

  if (!res.ok) {
    throw new Error(`Failed to fetch cart (status ${res.status})`);
  }

  return res.json();
}

export default async function CartPage() {
  const cart = await getCart();

  return (
    <main>
      <h1>Cart</h1>
      {cart.products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.products.map((item) => (
              <li key={item.id}>
                <h2>{item.title}</h2>
                <p>
                  ${item.price} × {item.quantity} = ${item.total}
                </p>
              </li>
            ))}
          </ul>
          <p>
            <strong>Total: ${cart.total}</strong>
          </p>
        </>
      )}
    </main>
  );
}
