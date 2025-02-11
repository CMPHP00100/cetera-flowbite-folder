"use client";
import { Navbar } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/calendar", label: "Calendar" },
  { href: "/items", label: "Items" },
  { href: "/media", label: "Media Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "register", label: "Register" },
];

const CustomNav = () => {
  const pathname = usePathname();

  return (
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
      <Navbar.Collapse>
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`${isActive ? "text-cetera-orange" : "text-white"} hover:text-cetera-orange hover:brightness-50`}
            >
              {label}
            </Link>
          );
        })}
      </Navbar.Collapse>
    </Navbar>
  );
};
export default CustomNav;
