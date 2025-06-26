"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCartShopping } from "react-icons/fa6";
import "../custom-styles/navbar.css";
import { useShoppingCart } from "@/context/CartContext";
import { IoPersonSharp } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/moodboard", label: "Moodboard" },
  { href: "/product", label: "Products" },
  { href: "/calendar", label: "Calendar" },
  { href: "/media", label: "Media Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const CustomNav = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cart } = useShoppingCart();
  // Calculate total items in the cart
  const totalItems = Object.values(cart).reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-2 md:px-6 xl:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logos/CM_logo_Orange.svg"
                className="h-6 sm:h-9 mr-3 w-20"
                alt="Cétera Marketing"
                width={192}
                height={96}
              />
              <span className="self-center whitespace-nowrap text-xl text-white">
                Cétera Marketing
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links and Icons - All Right Aligned */}
          <div className="hidden lg:flex items-center space-x-3">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? "text-cetera-orange bg-gray-700" 
                      : "text-white hover:text-cetera-orange hover:bg-gray-700"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            
            {/* Account and Cart Icons */}
            <div className="flex items-center space-x-2 ml-4 border-l border-gray-600 pl-4">
              <Link 
                href="/account" 
                className="text-white hover:text-cetera-orange transition-colors duration-200 p-2"
                title="Account"
              >
                <IoPersonSharp className="text-lg" />
              </Link>
              <Link
                href="/cart"
                className="relative text-white hover:text-cetera-orange transition-colors duration-200 p-2"
                title="Shopping Cart"
              >
                <FaCartShopping className="text-lg" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link
              href="/cart"
              className="relative text-white hover:text-cetera-orange transition-colors duration-200 p-2"
            >
              <FaCartShopping className="text-lg" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-cetera-orange transition-colors duration-200 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive 
                      ? "text-cetera-orange bg-gray-600" 
                      : "text-white hover:text-cetera-orange hover:bg-gray-600"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-cetera-orange hover:bg-gray-600 transition-colors duration-200"
            >
              <IoPersonSharp className="mr-2" />
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomNav;