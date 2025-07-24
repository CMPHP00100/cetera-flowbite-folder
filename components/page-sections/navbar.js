"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCartShopping } from "react-icons/fa6";
import "../custom-styles/navbar.css";
import { useShoppingCart } from "@/context/CartContext";
import { PiHouseLineLight } from "react-icons/pi";
import { IoPersonSharp, IoCalendarNumberOutline } from "react-icons/io5";
import { BsInfoCircle, BsBoxSeam } from "react-icons/bs";
import { GoFileMedia } from "react-icons/go";
import { HiMenu, HiX } from "react-icons/hi";
import { GiVibratingSmartphone } from "react-icons/gi";
import { IoPersonOutline } from "react-icons/io5";



import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", label: "Home", className:"mobile-home-nav-item", icon: <PiHouseLineLight className="text-lg mr-0" /> },
  //{ href: "/moodboard", label: "Moodboard" },
  { href: "/products", label: "Products", icon: <BsBoxSeam className="text-md mr-0" /> },
  { href: "/calendar", label: "Calendar", icon: <IoCalendarNumberOutline className="text-md mr-0" /> },
  { href: "/media", label: "Media Gallery", icon: <GoFileMedia className="text-md mr-0" /> },
  { href: "/about", label: "About", icon: <BsInfoCircle className="text-md mr-0" /> },
  { href: "/contact", label: "Contact", icon: <GiVibratingSmartphone className="text-lg mr-0" /> },
];

const CustomNav = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cart } = useShoppingCart();
  const totalItems = Object.values(cart).reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-cetera-dark-blue">
      {/*<div className="mx-auto max-w-7xl py-2 md:px-6 l:px-10">*/}
      <div className="mx-auto px-6 md:ps-8 md:pe-[6rem] max-w-8xl py-2">
        <div className="flex h-16 items-center justify-between">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logos/CM_logo_MonoOrange.svg"
                className="h-6 sm:h-9 mr-3 w-20"
                alt="Cétera Marketing"
                width={192}
                height={96}
              />
              {/*<span className="hidden md:bock lg:block xl:block self-center whitespace-nowrap text-xl text-white">
                Cétera Marketing
              </span>*/}
            </Link>
          </div>

          {/* Desktop Navigation Links and Icons */}
          <div className="hidden lg:flex items-center space-x-3">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-2 py-2 text-[15px] font-small transition-colors duration-200 ${
                    isActive 
                      ? "text-cetera-mono-orange hover:text-cetera-light-gray hover:transition-transform hover:duration-200" 
                      : "text-cetera-light-gray hover:text-cetera-mono-orange"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            
            {/* Account and Cart Icons */}
            <div className="flex items-center space-x-2 ml-4 border-l border-cetera-mono-orange pl-4">
              <Link 
                href="/account" 
                className="text-cetera-light-gray hover:text-cetera-mono-orange transition-colors duration-200 p-2"
                title="Account"
              >
                <IoPersonSharp className="text-lg hover:text-cetera-mono-orange" />
              </Link>
              <Link
                href="/cart"
                className="relative text-cetera-light-gray hover:text-cetera-mono-orange transition-colors duration-200 p-2"
                title="Shopping Cart"
              >
                <FaCartShopping className="text-lg hover:text-cetera-mono-orange" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-cetera-dark-blue text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              className="relative text-white hover:text-cetera-mono-orange transition-colors duration-200 py-2 ps-2 pe-1"
            >
              <FaCartShopping className="text-lg hover:text-cetera-mono-orange" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-cetera-mono-orange transition-colors duration-200 py-2 ps-3 pe-0 border-l border-mono-cetera-orange ml-4"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-light-gray">
          {NAV_ITEMS.map(({ href, label, icon, className }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-small text-cetera-dark-blue hover:text-cetera-mono-orange transition-colors duration-200 ${
                  isActive 
                    ? "text-cetera-mono-orange" 
                    : "text-cetera-dark-blue hover:text-cetera-mono-orange"
                 } ${className || ''}`}
              >
                {icon}
                <span className="px-2">{label}</span>
              </Link>
            );
          })}
          {/* Account Icon */}
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-account-nav-item flex items-center px-3 py-2 rounded-md text-base font-small transition-colors duration-200 text-cetera-dark-blue hover:text-cetera-mono-orange"
            >
              <IoPersonOutline className="mr-0 text-lg" /> <span className="px-2">Account</span>
            </Link>
        </div>
      </div>
    </nav>
  );
};

export default CustomNav;