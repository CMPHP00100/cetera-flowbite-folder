"use client";

import { lazy, Suspense } from "react";

// Lazy-loaded components
const HomeBanner = lazy(() => import("@/components/page-sections/home-banner.js"));
const FeaturedProducts = lazy(() => import("@/components/page-sections/featured-products.js"));
const CategoryProducts = lazy(() => import("@/components/page-sections/category-products.js"));
const ContactFormHome = lazy(() => import("@/components/page-sections/contact-form-home.js"));
const ScrollToTop = lazy(() => import("@/components/animations/scroll-to-top.js"));

export default function App() {
  return (
    <div className="min-h-screen bg-cetera-light-gray">
      <Suspense fallback={null}>
        <HomeBanner />
      </Suspense>
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={null}>
        <CategoryProducts />
      </Suspense>
      <Suspense fallback={null}>
        <ContactFormHome />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
}
