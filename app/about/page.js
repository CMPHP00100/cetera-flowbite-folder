import HeroSection from "@/components/page-sections/hero";

export default function About() {
  return (
    <div>
      <HeroSection
        heading="About Page"
        description="Description for the about page goes here..."
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        heroImage="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
        heroAlt="About Page Alt Text"
      />
    </div>
  );
}
