import React from 'react';
import { motion } from 'framer-motion';

const LobbyScreen = ({ playerInfo, roomCode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mt-10 text-center"
    >
      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 font-accent">Welcome, {playerInfo?.name}</h2>
        
        <div className="mb-6 flex justify-center">
          <img 
            src={playerInfo?.avatar} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-gold bg-white p-1"
          />
        </div>

        <div className="bg-white/60 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Room Code</p>
          <p className="text-3xl font-bold tracking-[0.2em] text-charcoal">{roomCode}</p>
        </div>

        <div className="flex items-center justify-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p>Waiting for host to start...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LobbyScreen;
