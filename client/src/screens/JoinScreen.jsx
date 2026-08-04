import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../SocketContext';

const JoinScreen = () => {
  const socket = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!playerName || !roomCode) return;
    setLoading(true);
    socket.emit('join_room', { 
      playerName, 
      roomCode: roomCode.toUpperCase() 
    });
    // Loading state is reset in App.jsx via error or success events
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full max-w-md mt-10 relative"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
      
      <div className="glass-card p-10 rounded-2xl text-center relative z-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-accent text-5xl font-bold text-white mb-2 tracking-wide drop-shadow-md">
            Nash Auction
          </h1>
          <p className="text-amber-400 mb-10 uppercase tracking-[0.3em] text-xs font-semibold">Fine Art & Strategy</p>
        </motion.div>
        
        <form onSubmit={handleJoin} className="space-y-6">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Your Name" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-600 bg-slate-800/50 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all peer"
              required 
            />
            <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-amber-500 bg-slate-800/80 px-1 rounded-md transform -translate-y-3 pointer-events-none">
              Your Name
            </label>
          </div>
          
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Room Code" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-600 bg-slate-800/50 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent uppercase transition-all peer"
              maxLength="4"
              required 
            />
            <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-amber-500 bg-slate-800/80 px-1 rounded-md transform -translate-y-3 pointer-events-none">
              Room Code
            </label>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 py-4 rounded-xl font-bold uppercase tracking-wider hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-50 mt-4 shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.8)]"
          >
            {loading ? 'Entering...' : 'Enter Auction House'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default JoinScreen;
