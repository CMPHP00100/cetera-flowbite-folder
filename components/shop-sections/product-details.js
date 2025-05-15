"use client";
//import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useShoppingCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductDetails({ product }) {
  const { addItem } = useShoppingCart();
  const router = useRouter();

  if (!product) {
    return (
      <p className="text-red-500">Product not found or still loading...</p>
    );
  }

  // Update the query parameter if it's not 1800
  const updateRSParam = (url, newRSValue) => {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    if (params.get("RS") !== newRSValue) {
      params.set("RS", newRSValue); // Set RS to the new value
      urlObj.search = params.toString(); // Update the URL with the new query string
    }
    return urlObj.toString(); // Return the updated URL
  };
  const url = product.thumbPic;
  // If RS is not 1800, update the URL
  const updatedUrl = updateRSParam(url, "1800");

  {
    /*useEffect(() => {
    console.log("ProductDetails Mounted");
  }, []);*/
  }

  return (
    <>
      <div class="bg-white">
        <div class="pt-6">
          <nav aria-label="Breadcrumb">
            <ol
              role="list"
              class="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
            >
              <li>
                <div class="flex items-center">
                  <a href="/" class="mr-2 text-sm font-medium text-gray-900">
                    Home
                  </a>
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    class="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <a
                    href="/product"
                    class="mr-2 text-sm font-medium text-gray-900"
                  >
                    Products
                  </a>
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    class="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>

              <li class="text-sm">
                <a
                  href="#"
                  aria-current="page"
                  class="font-medium text-gray-500 hover:text-gray-600"
                >
                  {product.name} | {product.spc}
                </a>
              </li>
            </ol>
          </nav>
          <div class="mx-auto mt-6 flex max-w-2xl justify-center border-b border-gray-200 sm:px-6 lg:max-w-7xl lg:px-8">
            <div class="flex justify-center">
              <Image
                src={updatedUrl}
                alt="Model wearing plain white basic tee."
                class="aspect-4/5 w-full object-cover sm:rounded-lg lg:aspect-auto"
                style={{ maxWidth: "600px" }}
                width={384}
                height={288}
              />
            </div>
          </div>

          {/*<!-- Product info -->*/}
          <div class="lg:pt-15 mx-auto max-w-2xl px-4 pb-16 pt-9 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pb-24">
            <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <button
                onClick={() => router.back()}
                className="mb-3 ms-[0rem] mt-0 text-cetera-orange"
              >
                ← Back
              </button>
              <h1 class="text-2xl  font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name} {product.spc}
              </h1>
            </div>

            {/*<!-- Options -->*/}
            <div class="mt-4 lg:row-span-3 lg:mt-0">
              <h2 class="sr-only">Product information</h2>
              <p class="text-3xl tracking-tight text-gray-900">{product.prc}</p>

              {/*<!-- Reviews -->*/}
              <div class="mt-6">
                <h3 class="sr-only">Reviews</h3>
                <div class="flex items-center">
                  <div class="flex items-center">
                    {/*<!-- Active: "text-gray-900", Default: "text-gray-200" -->*/}
                    <svg
                      class="size-5 shrink-0 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      class="size-5 shrink-0 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      class="size-5 shrink-0 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      class="size-5 shrink-0 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      class="size-5 shrink-0 text-gray-200"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <p class="sr-only">4 out of 5 stars</p>
                  <a
                    href="#"
                    class="ml-3 text-sm font-medium text-cetera-orange hover:text-cetera-orange"
                  >
                    117 reviews
                  </a>
                </div>
              </div>
              <form class="mt-10">
                {/*<!-- Colors -->*/}
                <div>
                  <p>Add Colors Here...</p>
                </div>
                {/*<!-- Sizes -->*/}
                <div class="mt-10">
                  <p>Add Sizes Here...</p>
                </div>

                <button
                  type="button"
                  class="focus:outline-hidden mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-cetera-gray px-8 py-3 text-base font-medium text-white hover:bg-cetera-orange focus:ring-2 focus:ring-cetera-orange focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent bubbling
                    e.preventDefault(); // Stop page reload (if applicable)
                    addItem(product);
                  }}
                >
                  Add to Cart
                </button>
              </form>
            </div>

            <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/*<!-- Description and details -->*/}
              <div>
                <h3 class="sr-only">Description</h3>

                <div class="space-y-6">
                  <p class="text-base text-gray-900">
                    The Basic Tee 6-Pack allows you to fully express your
                    vibrant personality with three grayscale options. Feeling
                    adventurous? Put on a heather gray tee. Want to be a
                    trendsetter? Try our exclusive colorway: &quot;Black&quot;.
                    Need to add an extra pop of color to your outfit? Our white
                    tee has you covered.
                  </p>
                </div>
              </div>

              <div class="mt-10">
                <h3 class="text-sm font-medium text-gray-900">Highlights</h3>

                <div class="mt-4">
                  <ul role="list" class="list-disc space-y-2 pl-4 text-sm">
                    <li class="text-gray-400">
                      <span class="text-gray-600">
                        Hand cut and sewn locally
                      </span>
                    </li>
                    <li class="text-gray-400">
                      <span class="text-gray-600">
                        Dyed with our proprietary colors
                      </span>
                    </li>
                    <li class="text-gray-400">
                      <span class="text-gray-600">
                        Pre-washed &amp; pre-shrunk
                      </span>
                    </li>
                    <li class="text-gray-400">
                      <span class="text-gray-600">Ultra-soft 100% cotton</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mt-10">
                <h2 class="text-sm font-medium text-gray-900">Details</h2>

                <div class="mt-4 space-y-6">
                  <p class="text-sm text-gray-600">
                    The 6-Pack includes two black, two white, and two heather
                    gray Basic Tees. Sign up for our subscription service and be
                    the first to get new, exciting colors, like our upcoming
                    &quot;Charcoal Gray&quot; limited release.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
