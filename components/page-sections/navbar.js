"use client";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCartShopping } from "react-icons/fa6";
import "../custom-styles/navbar.css";
import { useShoppingCart } from "@/context/CartContext";
import { IoPersonSharp } from "react-icons/io5";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";
import { PiCashRegisterLight } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/moodboard", label: "Moodboard" },
  { href: "/product", label: "Products" },
  { href: "/calendar", label: "Calendar" },
  { href: "/media", label: "Media Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  //{ href: "register", label: "Register" },
];

const CustomNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { cart, totalPrice } = useShoppingCart();
  // Calculate total items in the cart
  const totalItems = Object.values(cart).reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  return (
    <>
      <Navbar fluid className="bg-gray-800">
        <Navbar.Brand href="/">
          <img
            src="/assets/logos/CM_logo_Orange.svg"
            className="h-6 sm:h-9 mr-3 w-20"
            alt="Cétera Marketing"
          />
          <span className="self-center whitespace-nowrap text-xl text-white">
            Cétera Marketing
          </span>
        </Navbar.Brand>
        <Navbar.Collapse className="block">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`${isActive ? "text-cetera-orange" : "text-white"} pe-6 hover:text-cetera-orange hover:brightness-50`}
              >
                {label}
              </Link>
            );
          })}
          <Link href="/account" className="rounded text-cetera-gray ">
            <IoPersonSharp className="me-6 mt-[2px] text-white" />
          </Link>
          <Link
            href="/cart"
            style={{ position: "relative", marginRight: "1rem" }}
          >
            <FaCartShopping
              className="cart-icon me-4 mt-0 text-lg"
              //onClick={openModal}
            />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "3px 7px",
                  fontSize: "12px",
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
export default CustomNav;
