"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Corrected: Use `useTransform()` instead of `.to()`
  const strokeOffset = useTransform(smoothProgress, [0, 1], [100, 0]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100); // Show button after 100px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-5">
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="h-12 relative flex w-12 items-center justify-center rounded-full bg-none p-2 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.svg
            className="absolute inset-0"
            width="100%"
            height="100%"
            viewBox="0 0 36 36"
          >
            <motion.circle
              cx="18"
              cy="18"
              r="14"
              stroke="#f85f14"
              strokeWidth="1"
              fill="transparent"
              strokeDasharray="100"
              // ✅ Corrected this
              strokeDashoffset={strokeOffset}
            />
          </motion.svg>
          <span className="text-lg font-bold text-cetera-mono-orange">↑</span>
        </motion.button>
      )}
    </div>
  );
}
