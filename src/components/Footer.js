import Link from "next/link";
import styles from "./Footer.module.css";

const links = [
  { href: "/terms", label: "Conditions of Use" },
  { href: "/privacy", label: "Privacy Notice" },
  { href: "/ads", label: "Interest-Based Ads" },
];

export default function Footer() {
  return (
    <footer className={styles.wrapper}>
      <div className={styles.inner}>
        <ul className={styles.links}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={styles.link}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Your Company, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
}
