"use client";

//import { useState } from "react";
//import Modal from "@/components/page-sections/modal";
//import Home from "@/pages/home/page";
//import ProductList from "@/components/shop-sections/product-list";
//import Cart from "@/components/shop-sections/cart";
//import { CartProvider } from "@/context/CartContext";
import { BannerSlider } from "@/components/page-sections/banner-carousel";
import CtaLeft from "@/components/page-sections/cta-left";
import FadeInSection from "@/components/animations/fadein-animation";
import TypedText from "@/components/animations/typed-text";
import ProductSlider from "@/components/page-sections/product-carousel";

export default function App() {
  return (
    <div className="min-h-screen bg-light-gray p-10">
      <BannerSlider
        CustomComponent={
          <TypedText
            typedClass="carousel-caption d-none d-md-block typed-text"
            texts={[
              "Hello Friend!",
              "welcome to my store...",
              "let's start shopping...",
              "please look around.",
            ]}
          />
        }
      />

      <FadeInSection>
        <ProductSlider />
      </FadeInSection>
      <CtaLeft />
    </div>
  );
}
