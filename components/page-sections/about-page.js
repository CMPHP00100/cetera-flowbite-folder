
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container-fluid bg-cetera-light-gray font-cetera-josefin text-cetera-dark-blue">
        <div className="mx-auto max-w-screen-xl gap-8 px-4 py-8 sm:py-16 md:grid md:grid-cols-2 lg:px-6 xl:gap-16">
            <Image
                className="w-full rounded-xl"
                src="/uploads/office-meeting.jpg"
                alt="dashboard image"
                width={864}
                height={672}
            />
            <div className="mt-0">
                <p className="mb-6">
                    CéteraMarketing is an award winning, boutique style marketing firm, specializing in uniforms, promotional products, corporate gifts and event branding. Our mission is to protect your brand with tailored campaigns that speak to your target market.
                </p>
                <p className="mb-6">
                    Client and community satisfaction is our number one interest at all times. We win when we serve at the highest level.
                </p>
                <p className="mb-6">
                    Our boutique approach to service, style and saftey testing. Producing innovative, on-tend products, custom gifting experiences and online stores offering digital marketing solutions for the world's top brands in our sandbox.
                </p>
            </div>
        </div>
    </div>
  );
}
