export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h2>{product.title}</h2>
      <p>${product.price}</p>
      <img src={product.image} alt={product.title} />
    </div>
  );
}