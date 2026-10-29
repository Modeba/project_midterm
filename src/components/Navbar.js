"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <Link href="/">Products</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/cart">Cart ({cartCount})</Link>
    </nav>
  );
}
