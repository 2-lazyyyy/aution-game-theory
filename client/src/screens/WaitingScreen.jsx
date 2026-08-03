import React from 'react';
import { motion } from 'framer-motion';

const WaitingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mt-20 text-center"
    >
      <div className="glass-panel p-8 rounded-2xl">
        <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold font-accent mb-2">Art Submitted</h2>
        <p className="text-gray-500 mb-8">Your masterpiece is ready for auction.</p>
        
        <div className="flex items-center justify-center gap-3 text-gray-600 bg-white/50 p-4 rounded-xl">
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Waiting for other artists...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WaitingScreen;
