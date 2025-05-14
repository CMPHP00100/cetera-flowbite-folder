import HeroSection from "@/components/page-sections/hero";
import Moodboard from "@/components/moodboard-sections/moodboard";

export default function Contact() {
  return (
    <div>
      <HeroSection
        heading="Moodboard Page"
        description="Description for the moodboard page goes here..."
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        heroImage="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
        heroAlt="Moodboard Page Alt Text"
      />
      <Moodboard />
    </div>
  );
}
