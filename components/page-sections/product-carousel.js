"use client"; // Ensure this is a client component

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../custom-styles/product-carousel.css";
import Image from "next/image";


const slides = [
  {
    id: 1,
    image: "/uploads/slide4.jpg",
    title: "Item 1",
    desc: "This is a description of Item 1",
    price: "$4.00",
  },
  {
    id: 2,
    image: "/uploads/slide5.jpg",
    title: "Item 2",
    desc: "This is a description of Item 2",
    price: "$6.00",
  },
  {
    id: 3,
    image: "/uploads/slide6.jpg",
    title: "Item 3",
    desc: "This is a description of Item 3",
    price: "$8.00",
  },
  {
    id: 4,
    image: "/uploads/slide7.jpg",
    title: "Item 4",
    desc: "This is a description of Item 4",
    price: "$10.00",
  },
  {
    id: 5,
    image: "/uploads/slide8.jpg",
    title: "Item 5",
    desc: "This is a description of Item 5",
    price: "$12.00",
  },
  {
    id: 6,
    image: "/uploads/slide9.jpg",
    title: "Item 6",
    desc: "This is a description of Item 6",
    price: "$14.00",
  },
];

const ProductSlider = () => {
  return (
    <div className="min-h-[400px] p-0">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        //navigation
        pagination={{ clickable: true }}
        className="swiper mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="swiper-slide">
            <div className="h-[400px] w-full flex items-center justify-center overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                className="rounded-lg object-cover"
                width={384}
                height={384}
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 text-white">
                <div className="font-bold">{slide.title}</div>
                <div>{slide.price}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
