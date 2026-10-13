import CartList from "../../components/CartList";

async function getCart() {
  const res = await fetch("https://dummyjson.com/carts/1");

  if (!res.ok) {
    throw new Error(`Failed to fetch cart (status ${res.status})`);
  }

  return res.json();
}

async function getProductDetails(id) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id} (status ${res.status})`);
  }

  return res.json();
}

export default async function CartPage() {
  const cart = await getCart();

  // The cart endpoint doesn't include thumbnails reliably, so we load each
  // product and merge the fields the UI needs.
  const items = await Promise.all(
    cart.products.map(async (item) => {
      const product = await getProductDetails(item.id);
      return {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: product.thumbnail,
        // DummyJSON has no color field. If your real data has one
        // (e.g. { name: "Yellow", hex: "#e8c200" }), pass it here.
        color: null,
      };
    })
  );

  return (
    <main>
      <CartList initialItems={items} />
    </main>
  );
}