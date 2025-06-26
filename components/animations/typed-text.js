"use client"; // Required for Next.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TypedText = ({ texts, speed = 100, delay = 1000, typedClass }) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[index];

    if (isDeleting) {
      if (charIndex > 0) {
        setTimeout(() => setCharIndex((prev) => prev - 1), speed / 2);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      if (charIndex < currentText.length) {
        setTimeout(() => setCharIndex((prev) => prev + 1), speed);
      } else {
        setTimeout(() => setIsDeleting(true), delay);
      }
    }
  }, [charIndex, isDeleting, index, texts, speed, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={typedClass + " text-4xl font-bold"}
    >
      {text + texts[index].substring(0, charIndex)}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.7 }}
        className="text-cetera-orange"
      >
        |
      </motion.span>
    </motion.div>
  );
};

export default TypedText;
