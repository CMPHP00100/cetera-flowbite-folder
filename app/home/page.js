import HeroSection from "../components/hero";
import CtaLeft from "../components/cta-left";
import CtaRight from "../components/cta-right";

export default function Home() {
  return (
    <div>
      <HeroSection
        heading="Home Page"
        description="Description for the home page goes here..."
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        heroImage="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
        heroAlt="Home Page Alt Text"
      />
      <CtaLeft />
      <CtaRight />
    </div>
  );
}
