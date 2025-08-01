"use client";

import { useState } from "react";
import Image from "next/image";

const HeroSection = ({
  id,
  heading,
  subheading,
  description,
  dataModalTarget,
  dataModalToggle,
  callToActionButtonText,
  callToActionButtonLink,
  callToActionButtonClass,
  heroImage,
  heroAlt,
}) => {
  return (
    <div>
      <section className="bg-cetera-dark-blue">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="text-[2.5rem] md:text-[4rem] font-bold text-cetera-light-gray mb-2 font-cetera-libre">
              {heading}
            </h1>
            <h4 className="mb-4 max-w-2xl text-xl leading-none tracking-tight font-cetera-josefin text-white md:text-2xl">
              {subheading}
            </h4>
            {/*<p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              {description}
            </p>*/}
            {/*<a
              id={id}
              data-modal-target={dataModalTarget}
              data-modal-toggle={useState(dataModalToggle)}
              href={callToActionButtonLink}
              className={callToActionButtonClass}
            >
              {callToActionButtonText}
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
            </a>*/}
          </div>
          <div className="hidden lg:col-span-5 lg:mt-0 lg:flex opacity-[0.7]">
            <Image src={heroImage} alt={heroAlt} width={1920} height={1080} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
