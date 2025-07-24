import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.8, duration: 0.4, ease: "backOut" },
    },
  };

  const underlineVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: { delay: 1.2, duration: 0.8, ease: "easeInOut" },
    },
  };

  const letters = "CéteraMarketing".split("");

  return (
    <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[50vh] px-4 bg-cetera-dark-blue overflow-hidden">
      <motion.div
        className="relative w-full max-w-7xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="flex flex-wrap justify-center">
          <motion.div className="flex flex-wrap justify-center items-baseline space-x-0.5 sm:space-x-1">
            {/* Cétera */}
            {letters.slice(0, 6).map((letter, index) => (
              <motion.span
                key={`cetera-${index}`}
                variants={letterVariants}
                className="font-cetera-josefin text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-cetera-mono-orange inline-block"
                style={{ transformOrigin: "center bottom" }}
              >
                {letter}
              </motion.span>
            ))}

            {/* Dot */}
            <motion.div
              variants={dotVariants}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cetera-mono-orange mx-1 mb-3"
            />

            {/* Marketing */}
            {letters.slice(6).map((letter, index) => (
              <motion.span
                key={`marketing-${index}`}
                variants={letterVariants}
                className="font-cetera-josefin text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-cetera-mono-orange inline-block"
                style={{ transformOrigin: "center bottom" }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Underline */}
        <motion.div
          variants={underlineVariants}
          className="h-1 mt-4 bg-cetera-mono-orange rounded-full mx-auto w-24 sm:w-32 md:w-48"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-center text-sm sm:text-base md:text-lg lg:text-xl mt-6 font-light tracking-wide font-cetera-josefin text-cetera-light-gray px-2"
        >
          Your Ultimate Gifting Destination
        </motion.p>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cetera-mono-orange rounded-full opacity-30"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 100) - 50,
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 100) - 50,
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              y: [0, -50, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              delay: 2 + i * 0.2,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-lg blur-xl -z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
        />
      </motion.div>

      {/* Background particles */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cetera-dark-blue rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 300),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 200),
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              delay: Math.random() * 3,
              duration: 3,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
