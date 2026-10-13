import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome</h1>
      <ul>
        <li>
          <Link href="/products">Browse products</Link>
        </li>
        <li>
          <Link href="/profile">View your profile</Link>
        </li>
        <li>
          <Link href="/cart">Open your cart</Link>
        </li>
      </ul>
    </main>
  );
}
