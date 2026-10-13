import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

const formatPrice = (value) => `$${value.toFixed(2)}`;

async function getProduct(id) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id} (status ${res.status})`);
  }

  return res.json();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const { title, description, category, price, rating = 0, thumbnail } =
    await getProduct(id);

  const ratingPercent = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <main className={styles.page}>
      <Link href="/products" className={styles.back}>
        &larr; Back to products
      </Link>

      <div className={styles.layout}>
        <div className={styles.imageWrap}>
          <img className={styles.image} src={thumbnail} alt={title} />
        </div>

        <div className={styles.info}>
          <p className={styles.category}>{category}</p>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.ratingRow}>
            <span
              className={styles.stars}
              role="img"
              aria-label={`Rated ${rating.toFixed(1)} out of 5`}
            >
              <span className={styles.starsEmpty}>★★★★★</span>
              <span
                className={styles.starsFilled}
                style={{ width: `${ratingPercent}%` }}
              >
                ★★★★★
              </span>
            </span>
            <span className={styles.ratingValue}>{rating.toFixed(1)} / 5</span>
          </div>

          <p className={styles.price}>{formatPrice(price)}</p>

          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </main>
  );
}
