import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" legacyBehavior>
              <a className="text-white">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about" legacyBehavior>
              <a className="text-white">About</a>
            </Link>
          </li>
          <li>
            <Link href="/shop" legacyBehavior>
              <a className="text-white">Shop</a>
            </Link>
          </li>
          <li>
            <Link href="/contact" legacyBehavior>
              <a className="text-white">Contact</a>
            </Link>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </>
  );
}
