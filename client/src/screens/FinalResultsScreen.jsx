import React from 'react';
import { motion } from 'framer-motion';

const FinalResultsScreen = ({ scores }) => {
  if (!scores) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-lg mt-4 relative z-10"
    >
      {/* Confetti effect placeholder / ambient background */}
      <div className="absolute -inset-10 bg-gradient-to-b from-amber-500/20 via-indigo-500/20 to-transparent rounded-[3rem] blur-2xl opacity-70 pointer-events-none"></div>

      <div className="glass-card p-10 rounded-3xl text-center border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold font-accent text-amber-500 mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Auction Closed</h2>
          <p className="text-amber-400/80 mb-10 uppercase tracking-[0.3em] text-xs font-bold">Final Standings</p>
        </motion.div>
        
        <div className="space-y-4 relative z-10">
          {scores.map((player, index) => (
            <motion.div 
              key={player.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 + (index * 0.1) }}
              className={`flex items-center p-5 rounded-2xl shadow-lg border relative overflow-hidden ${
                index === 0 
                  ? 'bg-gradient-to-r from-amber-900/40 to-slate-800/80 border-amber-500/50' 
                  : index === 1
                    ? 'bg-slate-800/80 border-slate-400/30'
                    : index === 2
                      ? 'bg-slate-800/80 border-orange-800/30'
                      : 'bg-slate-900/60 border-slate-700/50'
              }`}
            >
              {index === 0 && <div className="absolute inset-0 bg-amber-500/5 animate-pulse"></div>}
              
              <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl mr-5 relative z-10 ${
                index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                : index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900'
                : index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-slate-900'
                : 'bg-slate-800 text-slate-400 border border-slate-600'
              }`}>
                #{index + 1}
              </div>
              
              <img src={player.avatar} alt="Avatar" className={`w-14 h-14 rounded-full border-2 mr-5 relative z-10 ${index === 0 ? 'border-amber-400' : 'border-slate-600'}`} />
              
              <div className="flex-1 text-left relative z-10">
                <p className={`font-bold text-xl tracking-wide ${index === 0 ? 'text-white' : 'text-slate-200'}`}>{player.name}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">{player.artworksWon} Artworks Won</p>
              </div>
              
              <div className="text-right relative z-10">
                <p className={`font-bold text-3xl font-accent ${index === 0 ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'text-white'}`}>
                  ${player.cash}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="mt-12 w-full bg-slate-800 border border-slate-600 hover:border-amber-500 text-slate-200 py-4 rounded-xl font-bold hover:bg-slate-700 hover:text-white transition uppercase tracking-widest text-sm relative z-10"
        >
          Attend Another Auction
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FinalResultsScreen;
