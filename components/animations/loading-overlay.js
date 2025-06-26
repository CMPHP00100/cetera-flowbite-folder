import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Inline Motion Spinners - Copy & Paste
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Rotating Spinner */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Rotating Spinner</h3>
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{`<motion.div
  className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full"
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }}
/>`}</pre>
            </div>
          </div>

          {/* Pulsing Dot */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Pulsing Dot</h3>
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-8 h-8 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{`<motion.div
  className="w-8 h-8 bg-blue-600 rounded-full"
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>`}</pre>
            </div>
          </div>

          {/* Three Dots */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Three Dots</h3>
            <div className="flex justify-center space-x-2 mb-4">
              <motion.div
                className="w-3 h-3 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: 0,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="w-3 h-3 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: 0.2,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="w-3 h-3 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: 0.4,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{`<div className="flex space-x-2">
  <motion.div
    className="w-3 h-3 bg-blue-600 rounded-full"
    animate={{
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1],
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      delay: 0,
      ease: "easeInOut"
    }}
  />
  <motion.div
    className="w-3 h-3 bg-blue-600 rounded-full"
    animate={{
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1],
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      delay: 0.2,
      ease: "easeInOut"
    }}
  />
  <motion.div
    className="w-3 h-3 bg-blue-600 rounded-full"
    animate={{
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1],
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      delay: 0.4,
      ease: "easeInOut"
    }}
  />
</div>`}</pre>
            </div>
          </div>

          {/* Bouncing Bar */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Bouncing Bar</h3>
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-1 h-8 bg-blue-600 rounded-full"
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{`<motion.div
  className="w-1 h-8 bg-blue-600 rounded-full"
  animate={{
    scaleY: [1, 2, 1],
    opacity: [0.5, 1, 0.5],
  }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>`}</pre>
            </div>
          </div>

          {/* Morphing Square */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Morphing Square</h3>
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-8 h-8 bg-blue-600"
                animate={{
                  borderRadius: ["0%", "50%", "0%"],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{`<motion.div
  className="w-8 h-8 bg-blue-600"
  animate={{
    borderRadius: ["0%", "50%", "0%"],
    rotate: [0, 180, 360],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>`}</pre>
            </div>
          </div>

          {/* Spiral */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Spiral</h3>
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-8 h-8 border-4 border-transparent border-t-blue-600 border-r-blue-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{`<motion.div
  className="w-8 h-8 border-4 border-transparent border-t-blue-600 border-r-blue-400 rounded-full"
  animate={{ rotate: 360 }}
  transition={{
    duration: 0.8,
    repeat: Infinity,
    ease: "linear"
  }}
/>`}</pre>
            </div>
          </div>

        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Usage Examples in Your Component</h3>
          <div className="space-y-4">
            
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-medium mb-2">Example 1: Loading Button</h4>
              <pre className="text-sm">{`<button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded">
  <motion.div
    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
  <span>Loading...</span>
</button>`}</pre>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-medium mb-2">Example 2: Conditional Loading</h4>
              <pre className="text-sm">{`{isLoading && (
  <motion.div
    className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
)}`}</pre>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-medium mb-2">Example 3: Inline with Text</h4>
              <pre className="text-sm">{`<div className="flex items-center space-x-2">
  <motion.div
    className="w-3 h-3 bg-blue-600 rounded-full"
    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
  <span>Processing your request...</span>
</div>`}</pre>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;