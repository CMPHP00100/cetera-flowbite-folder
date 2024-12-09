import ShopHero from "../../components/shop-hero";
import BentoGrid from "../../components/bento-grid";

export default function Services() {
  return (
    <div>
      <ShopHero
        heading="Shop Page"
        description="Description for the shop page goes here..."
        callToActionButtonLink="#"
        callToActionButtonText="Shop Now"
        heroImage="https://flowbite.s3.amazonaws.com/blocks/e-commerce/girl-shopping-list-dark.svg"
        heroAlt="Shop Hero Alt Text"
      />
      <BentoGrid />
    </div>
  );
}
