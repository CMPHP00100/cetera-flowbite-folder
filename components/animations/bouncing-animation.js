"use client";

import { motion } from "framer-motion";
import { BsChevronDoubleDown } from "react-icons/bs";

export default function BouncingAnimation({ bounceClass }) {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0], // Move up and down
      }}
      transition={{
        duration: 0.6, // Speed of bounce
        repeat: Infinity, // Loop animation
        repeatType: "loop",
        ease: "easeInOut", // Smooth bounce
      }}
      className={bounceClass}
    >
      <BsChevronDoubleDown />
    </motion.div>
  );
}
