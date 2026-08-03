import React from 'react';
import { motion } from 'framer-motion';

const RoundResultScreen = ({ result }) => {
  if (!result) return null;
  const { artwork, profit, newNetWorth } = result;
  
  const profitColor = profit > 0 ? 'text-green-600' : (profit < 0 ? 'text-red-500' : 'text-gray-500');
  const profitPrefix = profit > 0 ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mt-4"
    >
      <div className="glass-panel p-6 rounded-2xl text-center">
        <h2 className="text-3xl font-bold font-accent mb-6 text-charcoal">Round Results</h2>
        
        <div className="bg-white p-4 rounded-xl mb-6 shadow-sm border border-gray-100">
          <img src={artwork.imageData} alt="Artwork" className="w-full h-auto object-contain mb-3 rounded" />
          <h3 className="font-bold font-accent text-xl">{artwork.prompt}</h3>
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">By {artwork.artistName}</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center bg-white/60 p-3 rounded-lg">
            <span className="text-gray-600 font-medium">True Value</span>
            <span className="font-bold text-lg">${artwork.trueValue}</span>
          </div>
          <div className="flex justify-between items-center bg-white/60 p-3 rounded-lg">
            <span className="text-gray-600 font-medium">Sold Price</span>
            <span className="font-bold text-lg">${artwork.soldPrice}</span>
          </div>
          <div className="flex justify-between items-center bg-white/60 p-3 rounded-lg border-l-4 border-charcoal">
            <span className="text-gray-600 font-medium">Winner</span>
            <span className="font-bold text-lg">{artwork.soldToName || 'None'}</span>
          </div>
        </div>

        <div className="bg-charcoal text-white p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Your Round Profit</p>
          <p className={`text-4xl font-bold font-accent ${profitColor} mb-4`}>
            {profitPrefix}${profit}
          </p>
          <div className="h-px bg-white/20 w-full mb-4"></div>
          <div className="flex justify-between items-center">
            <span className="opacity-80">New Cash Balance</span>
            <span className="font-bold text-xl text-gold">${newNetWorth}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoundResultScreen;
