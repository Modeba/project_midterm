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
  const product = await getProduct(id);

  const {
    title,
    description,
    category,
    brand,
    price,
    discountPercentage = 0,
    rating = 0,
    stock,
    availabilityStatus,
    shippingInformation,
    warrantyInformation,
    returnPolicy,
    thumbnail,
    images = [],
    reviews = [],
  } = product;

  const originalPrice =
    discountPercentage > 0 ? price / (1 - discountPercentage / 100) : null;

  const ratingPercent = Math.min(100, Math.max(0, (rating / 5) * 100));
  const gallery = images.length > 0 ? images : [thumbnail];

  return (
    <main className={styles.page}>
      <Link href="/products" className={styles.back}>
        &larr; Back to products
      </Link>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            <img className={styles.mainImage} src={gallery[0]} alt={title} />
          </div>
          {gallery.length > 1 && (
            <ul className={styles.thumbs}>
              {gallery.slice(1).map((src) => (
                <li key={src} className={styles.thumb}>
                  <img src={src} alt="" loading="lazy" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.category}>
            {category}
            {brand && ` · ${brand}`}
          </p>
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
            <span className={styles.muted}>{reviews.length} reviews</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(price)}</span>
            {originalPrice && (
              <>
                <span className={styles.oldPrice}>
                  {formatPrice(originalPrice)}
                </span>
                <span className={styles.discount}>
                  -{Math.round(discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <p className={styles.description}>{description}</p>

          <dl className={styles.details}>
            <dt>Availability</dt>
            <dd>
              {availabilityStatus}
              {typeof stock === "number" && ` (${stock} in stock)`}
            </dd>
            {shippingInformation && (
              <>
                <dt>Shipping</dt>
                <dd>{shippingInformation}</dd>
              </>
            )}
            {warrantyInformation && (
              <>
                <dt>Warranty</dt>
                <dd>{warrantyInformation}</dd>
              </>
            )}
            {returnPolicy && (
              <>
                <dt>Returns</dt>
                <dd>{returnPolicy}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      {reviews.length > 0 && (
        <section className={styles.reviews}>
          <h2 className={styles.reviewsTitle}>Customer reviews</h2>
          <ul className={styles.reviewList}>
            {reviews.map((review) => (
              <li
                key={`${review.reviewerEmail}-${review.date}`}
                className={styles.review}
              >
                <p className={styles.reviewHead}>
                  <strong>{review.reviewerName}</strong>
                  <span className={styles.muted}>{review.rating}/5</span>
                </p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
