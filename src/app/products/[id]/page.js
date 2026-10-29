import { Suspense } from "react";
import ProductDetails from "../../../components/ProductDetails";

async function ProductContent({ params }) {
  const { id } = await params;
  return <ProductDetails key={id} productId={id} />;
}

export default function ProductPage({ params }) {
  return (
    <Suspense fallback={<p role="status">Loading product...</p>}>
      <ProductContent params={params} />
    </Suspense>
  );
}
