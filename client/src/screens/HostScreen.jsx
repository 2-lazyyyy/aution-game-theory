import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../SocketContext';

const HostScreen = () => {
  const socket = useSocket();
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY, DRAWING, BIDDING, RESULT, GAMEOVER
  const [artworksSubmitted, setArtworksSubmitted] = useState(0);
  const [totalExpected, setTotalExpected] = useState(0);
  
  // Auction specific state
  const [auctionData, setAuctionData] = useState(null);

  useEffect(() => {
    // Create room when host mounts
    socket.emit('create_room');

    socket.on('room_created', (data) => {
      setRoomCode(data.roomCode);
    });

    socket.on('room_update', (data) => {
      setPlayers(Object.values(data.players || {}));
    });

    socket.on('phase_change', (data) => {
      setGameState(data.phase);
    });

    socket.on('artwork_submitted', (data) => {
      setArtworksSubmitted(data.totalSubmitted);
      setTotalExpected(data.totalExpected);
    });

    socket.on('start_auction_round', (data) => {
      setAuctionData({
        ...data.artwork,
        roundNumber: data.roundNumber,
        totalRounds: data.totalRounds,
        currentBid: 0,
        highestBidder: 'None',
        timeLeft: 15
      });
      setGameState('BIDDING');
    });

    socket.on('auction_update', (data) => {
      setAuctionData(prev => ({
        ...prev,
        currentBid: data.currentBid,
        highestBidder: data.highestBidder,
        timeLeft: data.timeLeft
      }));
    });

    socket.on('timer_update', (data) => {
      setAuctionData(prev => prev ? { ...prev, timeLeft: data.timeLeft } : null);
    });

    socket.on('round_result', () => {
      setGameState('RESULT');
    });

    socket.on('game_over', () => {
      setGameState('GAMEOVER');
    });

    return () => {
      socket.off('room_created');
      socket.off('room_update');
      socket.off('phase_change');
      socket.off('artwork_submitted');
      socket.off('start_auction_round');
      socket.off('auction_update');
      socket.off('timer_update');
      socket.off('round_result');
      socket.off('game_over');
    };
  }, [socket]);

  const startGame = () => {
    if (players.length < 2) {
      alert("Need at least 2 players!");
      return;
    }
    socket.emit('start_drawing');
  };

  const startAuction = () => {
    socket.emit('start_auction');
  };

  const nextRound = () => {
    // Server handles this automatically after 5 seconds, but we can leave the button as a dummy or add server support later.
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold font-accent text-white tracking-wide drop-shadow-lg">Auction Desk</h1>
          <p className="text-amber-400/80 uppercase tracking-[0.2em] text-sm mt-2 font-semibold">Room Code: <span className="text-white text-2xl ml-2 tracking-widest bg-slate-800/50 px-3 py-1 rounded-lg border border-amber-500/30">{roomCode}</span></p>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex flex-col items-center min-w-[120px]">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">VIP Guests</p>
          <p className="text-3xl font-bold text-white">{players.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-10 rounded-2xl min-h-[450px] flex flex-col justify-center items-center text-center relative overflow-hidden">
            
            {gameState === 'LOBBY' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 flex flex-col items-center z-10">
                <div className="relative">
                  <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping"></div>
                  <div className="w-32 h-32 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-3xl font-accent text-white">The lobby is open...</h2>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 px-10 py-4 rounded-xl font-bold text-xl uppercase tracking-wider hover:from-amber-500 hover:to-amber-400 transition shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]"
                >
                  Commence Event
                </motion.button>
              </motion.div>
            )}

            {gameState === 'DRAWING' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-md mx-auto z-10">
                <h2 className="text-4xl font-accent font-bold text-white mb-2">Creation Phase</h2>
                <p className="text-slate-400 mb-8">Artists are preparing their masterpieces.</p>
                
                <div className="w-full bg-slate-800 rounded-full h-6 mb-2 border border-slate-600 overflow-hidden p-1">
                  <div 
                    className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-700 ease-out relative" 
                    style={{ width: `${totalExpected ? (artworksSubmitted / totalExpected) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <p className="font-bold text-slate-300 tracking-wider"><span className="text-amber-400 text-xl">{artworksSubmitted}</span> / {totalExpected} Appraisals Ready</p>
                
                <div className="mt-12 pt-8 border-t border-slate-700">
                  <button 
                    onClick={startAuction}
                    className="text-slate-400 hover:text-white border border-slate-600 hover:border-amber-500 px-6 py-2 rounded-lg font-semibold text-sm transition"
                  >
                    Force Skip to Auction
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'BIDDING' && auctionData && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full z-10">
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-2xl font-accent font-bold text-slate-300">Lot {auctionData.roundNumber} <span className="text-slate-500 text-lg">of {auctionData.totalRounds}</span></h2>
                  <motion.div 
                    animate={auctionData.timeLeft <= 5 ? { scale: [1, 1.1, 1], color: ['#F59E0B', '#EF4444', '#F59E0B'] } : {}}
                    transition={{ repeat: auctionData.timeLeft <= 5 ? Infinity : 0, duration: 1 }}
                    className={`px-4 py-2 rounded-lg font-bold text-3xl font-accent border ${auctionData.timeLeft <= 5 ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-slate-800/50 border-amber-500/50 text-amber-500'}`}
                  >
                    {auctionData.timeLeft}s
                  </motion.div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 flex justify-center border-[8px] border-slate-800 relative">
                  {/* Ornate corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>
                  <img src={auctionData.imageData} alt="Current Auction" className="max-h-64 object-contain" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-xl border border-slate-600 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Current Bid</p>
                    <p className="text-4xl font-bold text-white font-accent">${auctionData.currentBid}</p>
                  </div>
                  <div className="glass-card p-6 rounded-xl border border-slate-600">
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Highest Bidder</p>
                    <p className="text-3xl font-bold text-amber-400 truncate">{auctionData.highestBidder || '---'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'RESULT' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 z-10">
                <h2 className="text-5xl font-accent font-bold text-white">Lot Sold!</h2>
                <p className="text-slate-400 text-lg">VIPs are reviewing their acquisitions.</p>
                {/* Dummy button, next round is automated */}
                <div className="inline-block mt-8 opacity-50">
                   <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto animate-pulse"></div>
                   <p className="text-xs text-slate-500 uppercase mt-4 tracking-widest">Preparing next lot...</p>
                </div>
              </motion.div>
            )}

            {gameState === 'GAMEOVER' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10">
                <h2 className="text-6xl font-accent font-bold text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Gavel Down</h2>
                <p className="text-slate-300 text-xl tracking-wider">The auction has concluded. Behold the final standings.</p>
              </motion.div>
            )}

          </div>
        </div>

        {/* Right Column: Player List */}
        <div className="glass-card p-6 rounded-2xl h-fit">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
            <h3 className="font-bold uppercase tracking-widest text-sm text-amber-400">Registry</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          
          {players.length === 0 ? (
            <p className="text-slate-500 italic text-center py-8">Waiting for attendees...</p>
          ) : (
            <div className="space-y-4">
              {players.map((player, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={player.socketId || idx} 
                  className="flex items-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors group"
                >
                  <div className="relative">
                    <img src={player.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-slate-600 bg-slate-800 mr-4 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(245,158,11,0)] group-hover:shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-shadow"></div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-slate-200 truncate tracking-wide">{player.name}</p>
                    <p className="text-sm font-semibold text-amber-400/80">${player.cash}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostScreen;
