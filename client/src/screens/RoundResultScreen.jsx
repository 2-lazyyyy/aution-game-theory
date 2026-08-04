import React from 'react';
import { motion } from 'framer-motion';

const RoundResultScreen = ({ result }) => {
  if (!result) return null;
  const { artwork, profit, newNetWorth } = result;
  
  const profitColor = profit > 0 ? 'text-green-600' : (profit < 0 ? 'text-red-500' : 'text-gray-500');
  const profitPrefix = profit > 0 ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-md mt-4 relative z-10"
    >
      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-amber-500/20 rounded-[2rem] blur-xl opacity-60 pointer-events-none"></div>

      <div className="glass-card p-8 rounded-3xl text-center border border-slate-700/60 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <h2 className="text-3xl font-bold font-accent mb-6 text-white drop-shadow-md relative z-10">Lot Results</h2>
        
        <div className="bg-slate-800/80 p-5 rounded-2xl mb-8 shadow-inner border border-slate-700 relative z-10">
          <div className="bg-white p-2 rounded-xl mb-4 border-[4px] border-slate-800 shadow-md">
            <img src={artwork.imageData} alt="Artwork" className="w-full h-32 object-contain" />
          </div>
          <h3 className="font-bold font-accent text-2xl text-white">{artwork.prompt}</h3>
          <p className="text-[10px] text-amber-400 uppercase tracking-widest mt-1">Artist: {artwork.artistName}</p>
        </div>

        <div className="space-y-3 mb-8 relative z-10">
          <div className="flex justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">True Value</span>
            <span className="font-bold text-xl text-white">${artwork.trueValue}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Hammer Price</span>
            <span className="font-bold text-xl text-amber-400">${artwork.soldPrice}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-800/60 p-4 rounded-xl border-l-4 border-amber-500">
            <span className="text-slate-300 font-bold uppercase tracking-wider text-sm">Winning Bidder</span>
            <span className="font-bold text-lg text-white">{artwork.soldToName || 'Unsold'}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl relative overflow-hidden border border-slate-700 shadow-xl z-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 font-bold">Your Transaction Profit</p>
          <p className={`text-5xl font-bold font-accent ${profitColor} mb-6 drop-shadow-md`}>
            {profitPrefix}${profit}
          </p>
          
          <div className="h-px bg-slate-700 w-full mb-4"></div>
          
          <div className="flex justify-between items-end">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">New Balance</span>
            <span className="font-bold text-3xl text-amber-400">${newNetWorth}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoundResultScreen;
