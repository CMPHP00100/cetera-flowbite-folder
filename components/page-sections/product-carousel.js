"use client"; // Ensure this is a client component

import { React, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
//import "@/components/custom-styles/product-carousel.css"; // Import custom CSS

const ProductSlider = () => {
  /* useEffect(() => {
        // Import Bootstrap JS only when the component mounts (client-side)
        import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) =>
            console.error("Bootstrap failed to load:", err),
        );
    }, []); */
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      id: 1,
      image: "../../uploads/slide4.jpg",
      title: "Item 1",
      desc: "This is a description of Item 1",
      price: "$4.00",
    },
    {
      id: 2,
      image: "../../uploads/slide5.jpg",
      title: "Item 2",
      desc: "This is a description of Item 2",
      price: "$6.00",
    },
    {
      id: 3,
      image: "../../uploads/slide6.jpg",
      title: "Item 3",
      desc: "This is a description of Item 3",
      price: "$8.00",
    },
    {
      id: 4,
      image: "../../uploads/slide7.jpg",
      title: "Item 4",
      desc: "This is a description of Item 4",
      price: "$10.00",
    },
    {
      id: 5,
      image: "../../uploads/slide8.jpg",
      title: "Item 5",
      desc: "This is a description of Item 5",
      price: "$12.00",
    },
    {
      id: 6,
      image: "../../uploads/slide9.jpg",
      title: "Item 6",
      desc: "This is a description of Item 6",
      price: "$14.00",
    },
  ];

  return (
    <div
      className={`container-fluid min-h-[400px] p-0 ${
        isHovered ? "cursor-ew-resize" : "cursor-default"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20} // Space between slides
        slidesPerView={1} // Default for mobile
        breakpoints={{
          640: { slidesPerView: 2 }, // 2 slides on small screens
          768: { slidesPerView: 3 }, // 3 slides on tablets
          1024: { slidesPerView: 4 }, // 4 slides on larger screens
        }}
        //navigation
        //pagination={{ clickable: false }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="slider-container w-full">
            <div className="flex h-[400px] w-full items-center justify-center overflow-hidden">
              <img
                src={slide.image}
                alt={slide.text}
                className="h-full w-full rounded-lg object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded bg-black bg-opacity-50 px-3 py-1 text-white">
                {slide.title} - {slide.price}
                {slide.desc}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
