import Link from "next/link";
import styles from "./ProductCard.module.css";

const formatPrice = (value) => `$${value.toFixed(2)}`;

export default function ProductCard({ product }) {
  const {
    id,
    title,
    thumbnail,
    price,
    discountPercentage = 0,
    rating = 0,
    reviews = [],
    shippingInformation,
  } = product;

  // DummyJSON gives the discounted price plus a percentage,
  // so we work backwards to get the original price.
  const originalPrice =
    discountPercentage > 0 ? price / (1 - discountPercentage / 100) : null;

  const ratingPercent = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <Link href={`/products/${id}`} className={styles.link}>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          <img
            className={styles.image}
            src={thumbnail}
            alt={title}
            loading="lazy"
          />
        </div>

        {shippingInformation && (
          <p className={styles.shipping}>{shippingInformation}</p>
        )}

        <h2 className={styles.name}>{title}</h2>

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
          <span className={styles.reviews}>{reviews.length} reviews</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(price)}</span>
          {originalPrice && (
            <span className={styles.oldPrice}>{formatPrice(originalPrice)}</span>
          )}
        </div>
      </article>
    </Link>
  );
}
