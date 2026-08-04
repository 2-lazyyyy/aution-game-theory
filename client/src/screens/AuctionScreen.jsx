import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../SocketContext';

const AuctionScreen = ({ auctionData }) => {
  const socket = useSocket();
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState('None');
  const [timeLeft, setTimeLeft] = useState(15);
  const [customBid, setCustomBid] = useState('');

  useEffect(() => {
    socket.on('auction_update', (data) => {
      setCurrentBid(data.currentBid);
      setHighestBidder(data.highestBidder || 'None');
      setTimeLeft(data.timeLeft);
    });

    socket.on('timer_update', (data) => {
      setTimeLeft(data.timeLeft);
    });

    return () => {
      socket.off('auction_update');
      socket.off('timer_update');
    };
  }, [socket]);

  const placeBidAmount = (amount) => {
    socket.emit('place_bid', { amount });
  };

  const placeCustomBid = () => {
    const total = parseInt(customBid, 10);
    if (!isNaN(total) && total > currentBid) {
      socket.emit('place_bid', { totalBid: total });
      setCustomBid('');
    }
  };

  const { artwork, roundNumber, totalRounds, yourCash } = auctionData;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-md mt-4 relative z-10"
    >
      <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-indigo-500/10 to-transparent rounded-[2.5rem] blur-xl opacity-60 pointer-events-none animate-pulse"></div>

      <div className="glass-card p-6 rounded-3xl relative overflow-hidden border border-slate-700/60 shadow-2xl">
        <h2 className="text-3xl font-bold font-accent text-center mb-6 text-white drop-shadow-md">Place Your Bid</h2>
        
        {artwork.isYourArt && (
          <div className="bg-amber-500/20 border border-amber-500/50 text-amber-400 text-center py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-max mx-auto shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            This is your artwork
          </div>
        )}

        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-[6px] border-slate-800 bg-white">
          {/* Ornate corner pieces */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500 z-10"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500 z-10"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500 z-10"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500 z-10"></div>
          
          <img src={artwork.imageData} alt="Artwork" className="w-full h-48 object-contain" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-8 pb-3 px-4 text-white">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold mb-0.5">Artist</p>
            <p className="font-bold text-lg leading-none">{artwork.artistName}</p>
          </div>
        </div>

        {!artwork.isYourArt && artwork.hint && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-800/60 p-4 rounded-2xl mb-8 border border-slate-700/50 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1 ml-2">Market Analysis</h4>
            <p className="text-slate-200 font-medium ml-2">{artwork.hint}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800/40 p-4 rounded-2xl text-center border border-slate-700/50">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Current Bid</p>
            <motion.p 
              key={currentBid}
              initial={{ scale: 1.3, color: '#FDE68A' }}
              animate={{ scale: 1, color: '#F8FAFC' }}
              className="text-3xl font-bold font-accent text-white"
            >
              ${currentBid}
            </motion.p>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl text-center border border-slate-700/50 relative overflow-hidden">
            {timeLeft <= 5 && <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>}
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Time Left</p>
            <motion.p 
              key={timeLeft}
              animate={{ scale: timeLeft <= 5 ? [1, 1.15, 1] : 1 }}
              transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 1 }}
              className={`text-3xl font-bold font-accent relative z-10 ${timeLeft <= 5 ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'text-amber-400'}`}
            >
              {timeLeft}s
            </motion.p>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 px-1">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Highest Bidder</p>
            <p className="font-bold text-white text-lg truncate max-w-[150px]">{highestBidder}</p>
          </div>
          <div className="bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-xl text-right">
            <span className="block text-[10px] uppercase tracking-widest text-amber-400/80 mb-0.5">Available Funds</span>
            <span className="font-bold text-lg">${yourCash}</span>
          </div>
        </div>

        {/* Bidding Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => placeBidAmount(100)} className="flex-1 bg-slate-700/50 border border-slate-600 text-slate-200 py-3.5 rounded-xl font-bold hover:bg-slate-700 transition">+$100</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => placeBidAmount(500)} className="flex-1 bg-slate-700 border border-slate-500 text-white py-3.5 rounded-xl font-bold hover:bg-slate-600 transition shadow-[0_0_10px_rgba(0,0,0,0.2)]">+$500</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => placeBidAmount(1000)} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 py-3.5 rounded-xl font-bold hover:from-amber-500 hover:to-amber-400 transition shadow-[0_0_15px_rgba(245,158,11,0.4)]">+$1000</motion.button>
          </div>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={customBid}
              onChange={(e) => setCustomBid(e.target.value)}
              placeholder="Total Bid (e.g. 2500)"
              className="flex-2 w-full p-3.5 rounded-xl border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <motion.button whileTap={{ scale: 0.95 }} onClick={placeCustomBid} className="flex-1 bg-amber-500 text-slate-900 font-black tracking-wider uppercase py-3.5 px-4 rounded-xl hover:bg-amber-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)]">BID</motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AuctionScreen;
