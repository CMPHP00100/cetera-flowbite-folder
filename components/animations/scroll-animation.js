"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ScrollAnimation = ({ scrolledTo, triggerIt }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = { scrolledTo }; // Get vertical scroll position ex. window.scrollY
      const triggerPoint = { triggerIt }; // Change this value based on when you want to trigger the animation ex. 300

      if (scrollPosition > triggerPoint) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start hidden and moved down
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} // Fade in when visible
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto mt-10 w-fit rounded-md bg-blue-500 p-6 text-white shadow-lg"
    >
      <h1 className="text-2xl font-bold">I appear when you scroll!</h1>
    </motion.div>
  );
};

export default ScrollAnimation;
