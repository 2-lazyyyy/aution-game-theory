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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mt-4"
    >
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <h2 className="text-2xl font-bold font-accent text-center mb-4">Place Your Bid</h2>
        
        {artwork.isYourArt && (
          <div className="bg-gold text-white text-center py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-max mx-auto">
            This is your artwork
          </div>
        )}

        <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg border-2 border-white/50">
          <img src={artwork.imageData} alt="Artwork" className="w-full h-auto object-contain bg-white" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3 text-white">
            <p className="text-xs uppercase tracking-widest text-gray-300">Artist</p>
            <p className="font-bold">{artwork.artistName}</p>
          </div>
        </div>

        {!artwork.isYourArt && artwork.hint && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/60 p-4 rounded-xl mb-6 border border-gray-200"
          >
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Market Analysis</h4>
            <p className="text-charcoal font-medium">{artwork.hint}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/60 p-4 rounded-xl text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Current Bid</p>
            <motion.p 
              key={currentBid}
              initial={{ scale: 1.2, color: '#D4AF37' }}
              animate={{ scale: 1, color: '#1A1A1A' }}
              className="text-2xl font-bold font-accent text-charcoal"
            >
              ${currentBid}
            </motion.p>
          </div>
          <div className="bg-white/60 p-4 rounded-xl text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Time Left</p>
            <motion.p 
              key={timeLeft}
              animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 1 }}
              className={`text-2xl font-bold font-accent ${timeLeft <= 5 ? 'text-red-500' : 'text-charcoal'}`}
            >
              {timeLeft}s
            </motion.p>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Highest Bidder: <span className="font-bold text-charcoal">{highestBidder}</span></p>
          <div className="mt-2 bg-charcoal text-white inline-block px-4 py-2 rounded-full">
            <span className="text-xs uppercase tracking-widest opacity-80 mr-2">Your Cash</span>
            <span className="font-bold">${yourCash}</span>
          </div>
        </div>

        {/* Bidding Controls */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => placeBidAmount(100)} className="flex-1 bg-charcoal text-white py-3 rounded-lg font-bold hover:bg-black transition">+$100</button>
          <button onClick={() => placeBidAmount(500)} className="flex-1 bg-gray-200 text-charcoal py-3 rounded-lg font-bold hover:bg-gray-300 transition">+$500</button>
          <button onClick={() => placeBidAmount(1000)} className="flex-1 bg-transparent border-2 border-gold text-gold py-3 rounded-lg font-bold hover:bg-gold hover:text-white transition">+$1000</button>
        </div>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={customBid}
            onChange={(e) => setCustomBid(e.target.value)}
            placeholder="Total Bid (e.g. 2500)"
            className="flex-2 w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold bg-white"
          />
          <button onClick={placeCustomBid} className="flex-1 bg-gold text-white py-3 px-4 rounded-lg font-bold hover:bg-yellow-600 transition">BID</button>
        </div>

      </div>
    </motion.div>
  );
};

export default AuctionScreen;
