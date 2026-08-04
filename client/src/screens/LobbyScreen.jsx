import React from 'react';
import { motion } from 'framer-motion';

const LobbyScreen = ({ playerInfo, roomCode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, type: 'spring' }}
      className="w-full max-w-md mt-10 text-center relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-amber-500/20 rounded-[2rem] blur-xl opacity-50 animate-pulse"></div>
      
      <div className="glass-card p-10 rounded-3xl relative z-10 border border-slate-700/50 shadow-2xl">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-2 font-accent text-white">Welcome, <span className="text-amber-400">{playerInfo?.name}</span></h2>
          <p className="text-slate-400 text-sm mb-8">You are registered as a VIP bidder.</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          className="mb-8 flex justify-center relative"
        >
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-pulse"></div>
          <img 
            src={playerInfo?.avatar} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-[3px] border-amber-500 bg-slate-800 p-2 shadow-[0_0_15px_rgba(245,158,11,0.5)] relative z-10"
          />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/60 rounded-2xl p-6 mb-8 border border-slate-700"
        >
          <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-2 font-semibold">Event Code</p>
          <p className="text-5xl font-bold tracking-[0.2em] text-white drop-shadow-md">{roomCode}</p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 text-slate-300 bg-slate-800/40 py-3 px-6 rounded-full border border-slate-700/50">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold tracking-wide">Awaiting Host...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LobbyScreen;
