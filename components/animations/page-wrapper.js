"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname(); // Get current route

  return (
    <AnimatePresence mode="wait">
      <motion.div
        // Ensures animation runs on route change
        key={pathname}
        // Slide-in effect
        initial={{ x: "100vw", opacity: 1 }}
        // End position
        animate={{ x: 0, opacity: 1 }}
        // Slide-out effect
        exit={{ x: "-100vw", opacity: 1 }}
        // Smooth animation
        transition={{ type: "tween", duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
