import HeroSection from "/components/page-sections/hero";
import GetUsers from "../../components/user-sections/get-users";

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
      <h1>Users</h1>
      <GetUsers />
    </div>
  );
}
