import HeroSection from "../../components/page-sections/hero";
import CtaLeft from "../../components/page-sections/cta-left";
import CtaRight from "../../components/page-sections/cta-right";
//import GetUsers from "../../components/get-users";
//import CreatEvent from "../../components/create-event";

export default function Home() {
  return (
    <div>
      <HeroSection
        id="registerModal"
        heading="Home Page"
        description="Description for the home page goes here..."
        dataModalTarget="registerModal"
        data-modal-toggle="registerModal"
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        callToActionButtonClass="fixed hidden mr-3 inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
        heroImage="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
        heroAlt="Home Page Alt Text"
      />
      {/* Main modal */}

      <CtaLeft />
      <CtaRight />
      {/*<GetUsers />*/}
      {/*<CreatEvent />*/}
    </div>
  );
}
