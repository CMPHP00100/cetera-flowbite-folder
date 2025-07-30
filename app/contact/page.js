"use client";

import HeroSection from "@/components/page-sections/hero";
//import GetUsers from "@/components/user-sections/get-users";
//import D1Products from "@/components/shop-sections/d1-products";
import ContactMap from "@/components/page-sections/contact-map.js";
import ContactForm from "@/components/page-sections/contact-form.js";
import TypedText from "@/components/animations/typed-text";

export default function Contact() {
  return (
    <div>
      <HeroSection
        heading="Contact"
        subheading={
                    <TypedText
                      className="textbase"
                      texts={[
                        "you have any questions?...",
                        "Need help with your order?...",
                        "Contact us please!",
                      ]}
                    />
                  }
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        heroImage="/uploads/phone.svg"
        heroAlt="Contact Page Alt Text"
      />
      {/*<GetUsers />*/}
      {/*<D1Products />*/}
      <ContactMap />
      <div className="contact-page border-b-[1px] border-cetera-light-gray">
        <ContactForm />
      </div>
    </div>
  );
}
