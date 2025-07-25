import Image from "next/image";

export default function CtaLeft({}) {
  return (
    <div>
      <section className="bg-gray-900 mt-[2.5rem]">
        <div className="mx-auto max-w-screen-xl items-center gap-8 px-4 py-8 sm:py-16 md:grid md:grid-cols-2 lg:px-6 xl:gap-16">
          <Image
            className="w-full dark:hidden"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
            alt="dashboard image"
            width={864}
            height={672}
          />
          <Image
            className="hidden w-full dark:block"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg"
            alt="dashboard image"
            layout="intrinsic"
            width={864}
            height={672}
          />
          <div className="mt-4 md:mt-0">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-500">
              Let&lsquo;s create more tools and ideas that brings us together.
            </h2>
            <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
              Flowbite helps you connect with friends and communities of people
              who share your interests. Connecting with your friends and family
              as well as discovering new ones is easy with features like Groups.
            </p>
            <a
              href="#"
              className="inline-flex items-center rounded-lg bg-cetera-orange px-5 py-2.5 text-center text-sm font-medium text-white"
            >
              Get started
              <svg
                className="h-5 -mr-1 ml-2 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
