"use client";

import HeroSection from "@/components/page-sections/hero";
//import GetUsers from "@/components/user-sections/get-users";
//import D1Products from "@/components/shop-sections/d1-products";
import ContactForm from "@/components/page-sections/contact-form.js";

export default function Contact() {
  return (
    <div>
      <HeroSection
        heading="Contact Page"
        description="Description for the contact page goes here..."
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        heroImage="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
        heroAlt="Contact Page Alt Text"
      />
      {/*<GetUsers />*/}
      {/*<D1Products />*/}
      <ContactForm />
    </div>
  );
}
