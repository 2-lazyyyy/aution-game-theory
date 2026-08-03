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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mt-10"
    >
      <div className="glass-panel p-8 rounded-2xl text-center">
        <h1 className="font-accent text-5xl font-bold text-charcoal mb-2">Nash Auction</h1>
        <p className="text-gray-500 mb-8 uppercase tracking-widest text-sm">Fine Art & Strategy</p>
        
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold bg-white/50"
              required 
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Room Code" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold uppercase bg-white/50"
              maxLength="4"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-charcoal text-white py-3 rounded-lg font-semibold hover:bg-black transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Joining...' : 'Enter Auction House'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default JoinScreen;
