import CalendarHero from "/components/calendar-hero";
import CalendarApp from "/components/calendar";

export default function Calendar() {
  return (
    <div>
      <CalendarHero
        heading="Calendar Page"
        description="Description for the shop page goes here..."
        callToActionButtonLink="#calendarList"
        callToActionButtonText="See Events..."
        heroImage="https://flowbite.s3.amazonaws.com/blocks/e-commerce/girl-shopping-list-dark.svg"
        heroAlt="Shop Hero Alt Text"
      />
      <CalendarApp />
    </div>
  );
}
