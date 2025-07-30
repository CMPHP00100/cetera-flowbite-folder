import HeroSection from "@/components/page-sections/hero";
import TypedText from "@/components/animations/typed-text";
import AboutPage from "@/components/page-sections/about-page";
import TeamMembers from "@/components/page-sections/team-members";


export default function About() {
  return (
    <>
      <HeroSection
        heading="About"
        subheading={
          <TypedText
            className="textbase"
            texts={[
              "Want to find more about our company?...",
              "Want to see what services we offer?...",
              "Here's a little description about us!",
            ]}
          />
        }
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        heroImage="/uploads/examine.svg"
        heroAlt="About Page Alt Text"
      />
      <AboutPage />
      <TeamMembers />
    </>
  );
}
