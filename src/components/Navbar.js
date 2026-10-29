"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function NavbarContent({ pathname }) {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const isProductsActive = pathname === "/" || pathname?.startsWith("/products/");

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link
        href="/"
        className="navbar-link navbar-products"
        aria-current={isProductsActive ? (pathname === "/" ? "page" : "location") : undefined}
      >
        Products
      </Link>
      <Link
        href={user ? "/profile" : "/login"}
        className="navbar-link"
        aria-current={pathname === (user ? "/profile" : "/login") ? "page" : undefined}
      >
        {user ? "Profile" : "Log in"}
      </Link>
      <Link
        href="/cart"
        className="navbar-link"
        aria-current={pathname === "/cart" ? "page" : undefined}
        aria-label={`Cart (${cartCount} ${cartCount === 1 ? "item" : "items"})`}
      >
        Cart <span className="navbar-cart-count" aria-hidden="true">{cartCount}</span>
      </Link>
    </nav>
  );
}

function ActiveNavbar() {
  const pathname = usePathname();
  return <NavbarContent pathname={pathname} />;
}

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarContent />}>
      <ActiveNavbar />
    </Suspense>
  );
}
