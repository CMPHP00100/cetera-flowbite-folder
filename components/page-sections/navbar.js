"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaCartShopping, FaCrown } from "react-icons/fa6";
import "../custom-styles/navbar.css";
import { useShoppingCart } from "@/context/CartContext";
import { PiHouseLineLight } from "react-icons/pi";
import { IoPersonSharp, IoCalendarNumberOutline } from "react-icons/io5";
import { BsInfoCircle, BsBoxSeam } from "react-icons/bs";
import { GoFileMedia } from "react-icons/go";
import { HiMenu, HiX } from "react-icons/hi";
import { GiVibratingSmartphone } from "react-icons/gi";
import { IoPersonOutline } from "react-icons/io5";
import { RiVipCrownFill } from "react-icons/ri";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", label: "Home", className:"mobile-home-nav-item", icon: <PiHouseLineLight className="text-lg mr-0" /> },
  { href: "/products", label: "Products", icon: <BsBoxSeam className="text-md mr-0" /> },
  { href: "/blog", label: "Blog", icon: <IoCalendarNumberOutline className="text-md mr-0" /> },
  { href: "/media", label: "Media Gallery", icon: <GoFileMedia className="text-md mr-0" /> },
  { href: "/about", label: "About", icon: <BsInfoCircle className="text-md mr-0" /> },
  { href: "/contact", label: "Contact", icon: <GiVibratingSmartphone className="text-lg mr-0" /> },
];

const CustomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState(null);

  const { cart } = useShoppingCart();
  const totalItems = Object.values(cart).reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const { user, logout } = useAuth();

  // Helper function to check if user is premium
  const isPremiumUser = () => {
    return role === 'PREMIUM' || role === 'PREMIUM_USER';
  };

  // Helper function to get user's display name
  const getUserDisplayName = () => {
    return user?.name || 'User';
  };

  // Keep mobile menu behavior identical
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper: read user from localStorage (fallback if context isn't populated)
  const readUserFromStorage = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  };

  // Initial role set + react to context changes
  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
      return;
    }
    // Fallback to localStorage if context has no user
    const stored = readUserFromStorage();
    if (stored?.role) setRole(stored.role);
  }, [user]);

  // Stay in sync if localStorage changes (other tabs) or app fires a custom event
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        const stored = readUserFromStorage();
        setRole(stored?.role || null);
      }
    };
    const onAuthUpdated = () => {
      const stored = readUserFromStorage();
      setRole(stored?.role || null);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-updated", onAuthUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-updated", onAuthUpdated);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear both context (if provided) and local storage fallbacks
    try {
      logout && logout();
    } catch {}
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // let anyone listening know auth changed
      window.dispatchEvent(new Event("auth-updated"));
    } catch {}
    router.push("/account");
  };

  return (
    <nav className={`${isPremiumUser() 
      ? 'bg-cetera-dark-blue' 
      : 'bg-cetera-dark-blue'
    }`}>
      <div className="mx-auto px-6 md:ps-8 md:pe-[6rem] max-w-8xl py-2">
        <div className="flex h-16 items-center justify-between">
          {/* Brand/Logo with Premium Enhancement */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/assets/logos/CM_logo_MonoOrange.svg"
                  className="h-6 sm:h-9 mr-3 w-20 transition-transform group-hover:scale-105"
                  alt="Cétera Marketing"
                  width={192}
                  height={96}
                />
              </div>
              <span className="hidden md:block lg:block xl:block self-center whitespace-nowrap text-xl text-white">
                Cétera Marketing
              </span>
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
                  className={`px-2 py-2 text-[15px] font-small transition-all duration-200 relative group ${
                    isActive 
                      ? isPremiumUser()
                        ? "text-amber-400 hover:text-cetera-light-gray"
                        : "text-cetera-mono-orange hover:text-cetera-light-gray"
                      : isPremiumUser()
                        ? "text-cetera-light-gray hover:text-amber-400"
                        : "text-cetera-light-gray hover:text-cetera-mono-orange"
                  }`}
                >
                  {label}
                  {/* Premium users get a subtle glow effect */}
                  {isPremiumUser() && (
                    <div className="absolute inset-0 bg-amber-400/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                  )}
                </Link>
              );
            })}

            {/* Premium User Welcome */}
            {isPremiumUser() && user && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-full border border-amber-500/30">
                <RiVipCrownFill className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">
                  Welcome, {getUserDisplayName()}
                </span>
              </div>
            )}

            {/* Account Role Indicator (Enhanced) */}
            {role && (
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium transition-all duration-200 ${
                  isPremiumUser()
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 animate-pulse"
                    : "bg-gray-500 text-white"
                }`}
              >
                {isPremiumUser() ? (
                  <span className="flex items-center space-x-1">
                    <RiVipCrownFill className="h-3 w-3" />
                    <span>Premium</span>
                  </span>
                ) : (
                  "Standard"
                )}
              </span>
            )}
            
            {/* Account and Cart Icons */}
            <div className={`flex items-center space-x-2 ml-4 border-l pl-4 ${
              isPremiumUser() ? 'border-amber-500/50' : 'border-cetera-mono-orange'
            }`}>
              <Link 
                href="/account"
                className={`transition-all duration-200 p-2 rounded-lg relative group ${
                  isPremiumUser() 
                    ? 'text-cetera-light-gray hover:text-cetera-mono-orange' 
                    : 'text-cetera-light-gray hover:text-cetera-mono-orange'
                }`}
                title={isPremiumUser() ? "Premium Account" : "Account"}
              >
                <div className="relative">
                  <IoPersonSharp className="text-lg" />
                  {isPremiumUser() && (
                    <RiVipCrownFill className="absolute -top-3 -right-[-3] h-3 w-3 text-amber-400" />
                  )}
                </div>
              </Link>
              
              <Link
                href="/cart"
                className="relative text-cetera-light-gray hover:text-cetera-mono-orange p-2"
                title="Shopping Cart"
              >
                <FaCartShopping className="text-lg" />
                {totalItems > 0 && (
                  <span className={`absolute -top-2 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${
                    isPremiumUser() 
                      ? 'bg-red-500 text-cetera-dark-blue' 
                      : 'bg-red-500 text-cetera-dark-blue'
                  }`}>
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Enhanced Logout Button */}
              {role && (
                <button
                  onClick={handleLogout}
                  className={`px-3 py-1 rounded transition-all duration-200 text-sm font-medium ${
                    isPremiumUser()
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu section (Enhanced) */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile Premium Indicator */}
            {isPremiumUser() && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-full border border-amber-500/30">
                <RiVipCrownFill className="h-3 w-3 text-amber-400" />
                <span className="text-amber-400 text-xs font-medium">VIP</span>
              </div>
            )}

            {/* Mobile Cart Icon (Enhanced) */}
            <Link
              href="/cart"
              className={`relative transition-all duration-200 py-2 ps-2 pe-1 ${
                isPremiumUser() 
                  ? 'text-white hover:text-amber-400' 
                  : 'text-white hover:text-cetera-mono-orange'
              }`}
            >
              <FaCartShopping className="text-lg" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${
                  isPremiumUser() 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black animate-pulse' 
                    : 'bg-red-500 text-white'
                }`}>
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Enhanced Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`transition-all duration-200 py-2 ps-3 pe-0 border-l ml-4 ${
                isPremiumUser()
                  ? 'text-white hover:text-amber-400 border-amber-500/50'
                  : 'text-white hover:text-cetera-mono-orange border-mono-cetera-orange'
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu */}
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
          isPremiumUser() 
            ? 'bg-gradient-to-b from-light-gray to-amber-50/20' 
            : 'bg-light-gray'
        }`}>
          {/* Premium Mobile Header */}
          {isPremiumUser() && user && (
            <div className="flex items-center justify-center space-x-2 px-3 py-2 mb-2 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg border border-amber-500/30">
              <RiVipCrownFill className="h-5 w-5 text-amber-600" />
              <span className="text-amber-700 font-bold">Premium Member: {getUserDisplayName()}</span>
            </div>
          )}

          {NAV_ITEMS.map(({ href, label, icon, className }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-small transition-all duration-200 relative ${
                  isActive 
                    ? isPremiumUser()
                      ? "text-amber-700 bg-amber-100/50" 
                      : "text-cetera-mono-orange"
                    : isPremiumUser()
                      ? "text-cetera-dark-blue hover:text-amber-700 hover:bg-amber-50/30"
                      : "text-cetera-dark-blue hover:text-cetera-mono-orange"
                 } ${className || ''}`}
              >
                {icon}
                <span className="px-2">{label}</span>
                {/* Premium glow effect on mobile */}
                {isPremiumUser() && isActive && (
                  <div className="absolute right-2">
                    <RiVipCrownFill className="h-4 w-4 text-amber-600" />
                  </div>
                )}
              </Link>
            );
          })}
          
          {/* Mobile Account Section (Enhanced) */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-md ${
            isPremiumUser() ? 'bg-amber-50/30 border border-amber-300/50' : ''
          }`}>
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-account-nav-item flex items-center px-3 py-2 rounded-md text-base font-small transition-all duration-200 ${
                isPremiumUser()
                  ? 'text-cetera-dark-blue hover:text-amber-700'
                  : 'text-cetera-dark-blue hover:text-cetera-mono-orange'
              }`}
            >
              <div className="relative">
                <IoPersonOutline className="mr-0 text-lg" />
                {isPremiumUser() && (
                  <RiVipCrownFill className="absolute -top-1 -right-1 h-3 w-3 text-amber-600" />
                )}
              </div>
              <span className="px-2">Account</span>
            </Link>
            
            {/* Enhanced Mobile Role Badge */}
            {role && (
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  isPremiumUser()
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md animate-pulse"
                    : "bg-cetera-dark-yellow text-white"
                }`}
              >
                {isPremiumUser() ? (
                  <span className="flex items-center space-x-1">
                    <RiVipCrownFill className="h-2 w-2" />
                    <span>Premium</span>
                  </span>
                ) : (
                  "Free"
                )}
              </span>
            )}
          </div>
          
          {/* Enhanced Mobile Logout */}
          {role && (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className={`w-full py-2 rounded mt-2 transition-all duration-200 font-medium ${
                isPremiumUser()
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Logout
              {isPremiumUser() && (
                <span className="ml-2 text-xs opacity-75">Premium Account</span>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomNav;