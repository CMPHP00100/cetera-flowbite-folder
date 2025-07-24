import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { TbArrowBigDownLinesFilled } from "react-icons/tb";
import MosaicProductGrid from "@/components/page-sections/mosaic-product-grid";

export default function ScrollingBannerPage() {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Track scroll direction
  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [lastScrollY]);
  
  // Transform scroll position to scale values
  const scale = useTransform(scrollY, [0, 300], [1, 1.5]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  
  // Transform for parallax effect on banner
  const bannerY = useTransform(scrollY, [0, 400], [0, -100]);
  
  // Directional animation variants
  const sectionVariants = {
    hiddenDown: {
      opacity: 0,
      y: 100,
      scale: 0.9,
      rotateX: 15
    },
    hiddenUp: {
      opacity: 0,
      y: -100,
      scale: 0.9,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0
    }
  };

  const cardVariants = {
    hiddenDown: {
      opacity: 0,
      y: 50,
      rotateY: -15,
      scale: 0.8
    },
    hiddenUp: {
      opacity: 0,
      y: -50,
      rotateY: 15,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      scale: 1
    }
  };

  const textVariants = {
    hiddenDown: {
      opacity: 0,
      y: 30,
      x: -20
    },
    hiddenUp: {
      opacity: 0,
      y: -30,
      x: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0
    }
  };
  
  return (
    <div className="relative">
      {/* Navbar Spacer */}
      
      {/* Fixed Banner */}
      <motion.div 
        className="top-20 left-0 w-full h-[80vh] bg-light-gray flex items-center justify-center z-10 rounded-3xl"
        style={{ y: bannerY }}
      >
        <motion.div
          className="text-center text-white px-8"
          style={{ scale, opacity }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-2 text-cetera-dark-yellow bg-clip-text"
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            SCROLL
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl font-light tracking-wide text-cetera-dark-yellow"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Experience directional motion
          </motion.p>
          <motion.div 
            className="mt-8 text-sm opacity-70"
            animate={{ 
              y: scrollDirection === 'down' ? [50, 20, 50] : [50, -40, 50],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <TbArrowBigDownLinesFilled className="text-cetera-dark-yellow text-3xl text-center ms-[8rem] md:ms-[10rem]" />
            {/*Scrolling {scrollDirection}*/}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Spacer for navbar and banner */}
      <div className="h-screen mt-0" />

      {/* Scrollable Content */}
      <div className="relative z-20 bg-none">
        {/* Section 1 */}
        <motion.section 
          className="h-[80vh] bg-light-gray mt-[-3.5rem] mb-3 p-0 pt-0 flex items-center justify-center rounded-3xl"
          initial={scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp'}
          whileInView="visible"
          exit={scrollDirection === 'down' ? 'hiddenUp' : 'hiddenDown'}
          variants={sectionVariants}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          viewport={{ once: false, amount: 0.3 }}
        >
            <MosaicProductGrid />

          {/*<div className="max-w-4xl text-center">
            <motion.h2 
              className="text-5xl font-bold text-gray-800 mb-6"
              variants={textVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Smooth Animations
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed"
              variants={textVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Watch how elements animate differently based on scroll direction. 
              Scrolling down creates one effect, scrolling up creates another.
            </motion.p>
          </div>*/}
        </motion.section>

        {/* Section 2 */}
        <motion.section 
          className="h-[80vh] bg-light-gray mt-[2.5rem] rounded-3xl mb-3 p-8 pt-24 flex items-center justify-center"
          initial={scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp'}
          whileInView="visible"
          exit={scrollDirection === 'down' ? 'hiddenUp' : 'hiddenDown'}
          variants={sectionVariants}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 80,
            damping: 15
          }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="max-w-4xl">
            <motion.h2 
              className="text-3xl md:text-4xl xl:text-5xl font-bold text-indigo-800 mb-6"
              variants={textVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Directional Effects
            </motion.h2>
            <motion.p 
              className="text-md md:text-l xl:text-xl text-indigo-600 leading-relaxed mb-8"
              variants={textVariants}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Each card rotates and scales differently based on your scroll direction.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp'}
                  whileInView="visible"
                  variants={cardVariants}
                  transition={{ 
                    duration: 0.6, 
                    delay: item * 0.15,
                    type: "spring",
                    stiffness: 120,
                    damping: 12
                  }}
                  viewport={{ once: false, amount: 0.5 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: scrollDirection === 'down' ? 5 : -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-light-gray rounded-full mb-4 flex items-center justify-center"
                    animate={{
                      rotate: scrollDirection === 'down' ? 360 : -360
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <span className="text-white font-bold">{item}</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Feature {item}
                  </h3>
                  <p className="text-gray-600">
                    Directional animations create engaging experiences.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section 
          className="h-[80vh] bg-light-gray mt-[2.5rem] rounded-3xl mb-3 p-8 pt-24 flex items-center justify-center"
          initial={scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp'}
          whileInView="visible"
          exit={scrollDirection === 'down' ? 'hiddenUp' : 'hiddenDown'}
          variants={sectionVariants}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 90,
            damping: 18
          }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="max-w-4xl text-center">
            <motion.h2 
              className="text-5xl font-bold text-purple-800 mb-6"
              variants={textVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Interactive Design
            </motion.h2>
            <motion.p 
              className="text-xl text-purple-600 leading-relaxed mb-8"
              variants={textVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Elements respond to both scroll direction and user interaction.
            </motion.p>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                rotateZ: scrollDirection === 'down' ? 2 : -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section 
          className="h-[80vh] bg-gradient-to-br from-gray-900 to-black mt-[2.5rem] p-8 pt-24 flex items-center justify-center rounded-3xl"
          initial={scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp'}
          whileInView="visible"
          exit={scrollDirection === 'down' ? 'hiddenUp' : 'hiddenDown'}
          variants={sectionVariants}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            type: "spring",
            stiffness: 70,
            damping: 20
          }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="max-w-4xl text-center">
            <motion.h2 
              className="text-5xl font-bold text-white mb-6"
              variants={textVariants}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Bidirectional Magic
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 leading-relaxed"
              variants={textVariants}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Scroll up and down to see how each element reverses its animation based on direction.
            </motion.p>
            <motion.div 
              className="mt-8 grid grid-cols-3 gap-4"
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                  animate={{
                    scaleX: scrollDirection === 'down' ? [1, 1.1, 1] : [1, 0.9, 1],
                    backgroundColor: scrollDirection === 'down' 
                      ? ["#8b5cf6", "#ec4899", "#8b5cf6"] 
                      : ["#ec4899", "#8b5cf6", "#ec4899"]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: item * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}