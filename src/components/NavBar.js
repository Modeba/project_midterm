"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";

const icons = {
  home: (
    <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10M10 19.5v-5h4v5" />
  ),
  dashboards: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M10 4v16M10 11h10" />
    </>
  ),
  segments: (
    <>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M3.5 20c0-3.6 2.9-6 6.5-6 1 0 1.9.2 2.7.5" />
      <circle cx="17.5" cy="17.5" r="3.5" />
      <path d="M17.5 15.7v3.6M15.7 17.5h3.6" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3l1.6 2.3 2.8-.6.9 2.7 2.7.9-.6 2.8L21 12l-2.3 1.6.6 2.8-2.7.9-.9 2.7-2.8-.6L12 21l-1.6-2.3-2.8.6-.9-2.7-2.7-.9.6-2.8L3 12l2.3-1.6-.6-2.8 2.7-.9.9-2.7 2.8.6z" />
    </>
  ),
};

const links = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/dashboards", label: "Dashboards", icon: "dashboards" },
  { href: "/segments", label: "Segments", icon: "segments" },
  { href: "/account", label: "Account", icon: "account" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className={styles.wrapper}>
      <nav className={styles.nav} aria-label="Main">
        <ul className={styles.list}>
          {links.map(({ href, label, icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.link} ${active ? styles.active : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {icons[icon]}
                  </svg>
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
