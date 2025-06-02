"use client"; // Ensure this is a client component

import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
//import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import "@/components/custom-styles/banner-carousel.css";
import BouncingAnimation from "@/components/animations/bouncing-animation";

export function BannerSlider({ CustomComponent }) {
  useEffect(() => {
    // Import Bootstrap JS only when the component mounts (client-side)
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) =>
      console.error("Bootstrap failed to load:", err),
    );
  }, []);
  return (
    <>
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        {/* Slides */}
        <div className="carousel-inner">
          <div className="carousel-item active relative min-h-[400px] overflow-visible">
            <video className="d-block w-100" autoPlay loop muted>
              <source
                src="../../uploads/slide-movie-1.mp4"
                type="video/mp4"
                alt="Slide 1"
              />
            </video>

            <div className="carousel-caption d-none d-md-block hero-text-container mr-auto lg:col-span-7">
              <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
                Payments tool for software companies
              </h1>
              <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
                From checkout to global sales tax compliance, companies around
                the world use Flowbite to simplify their payment stack.
              </p>
              <a
                href="#"
                className="mr-3 inline-flex rounded-lg bg-primary-700 px-5 py-3 text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Get started
                <svg
                  class="h-5 -mr-1 ml-2 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
            {CustomComponent}

            {/* Overlay */}
            <div className="overlay"></div>

            <div className="carousel-caption">
              <BouncingAnimation bounceClass="h-10 flex w-full items-center justify-center text-4xl text-white" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
