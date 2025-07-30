"use client";

import HeroSection from "@/components/page-sections/hero";
import Product from "@/components/shop-sections/product";
//import { CartProvider } from "@/context/CartContext";
import TypedText from "@/components/animations/typed-text";
import ScrollToTop from "@/components/animations/scroll-to-top";
import dynamic from "next/dynamic";
import { Suspense } from "react";
//import { motion } from "framer-motion";

const LazyProduct = dynamic(
  () => import("@/components/shop-sections/product"),
  {
    suspense: true,
  },
);

export default function ProductsPage() {
  return (
    <>
      {/* <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl font-bold"
      >
        Loading...
      </motion.h1> */}
      <Suspense
        fallback={
          <div className="text-center text-gray-500">Loading products...</div>
        }
      >
        <HeroSection
          heading="Product"
          subheading={
            <TypedText
              className="textbase"
              texts={[
                "Welcome to our product page...",
                "Find the best products for your needs...",
                "Shop Now!",
              ]}
            />
          }
          description="Description for the product page goes here..."
          callToActionButtonLink="#"
          callToActionButtonText="Get started"
          heroImage="/uploads/shopping-bag.svg"
          heroAlt="Product Page Alt Text"
        />
        {/*<LazyProduct />*/}
        <Product />
        <ScrollToTop />
      </Suspense>
      {/* <Product /> */}
    </>
  );
}
