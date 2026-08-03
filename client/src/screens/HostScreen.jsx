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

    socket.on('player_joined', (data) => {
      setPlayers(data.players);
    });

    socket.on('player_left', (data) => {
      setPlayers(data.players);
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
      socket.off('player_joined');
      socket.off('player_left');
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
    socket.emit('host_action', { action: 'start_game' });
  };

  const startAuction = () => {
    socket.emit('host_action', { action: 'start_auction' });
  };

  const nextRound = () => {
    socket.emit('host_action', { action: 'next_round' });
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-accent text-charcoal">Host Dashboard</h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm mt-1">Room Code: <span className="font-bold text-xl text-gold">{roomCode}</span></p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-bold uppercase">Players</p>
          <p className="text-2xl font-bold text-center text-charcoal">{players.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl min-h-[400px] flex flex-col justify-center items-center text-center">
            
            {gameState === 'LOBBY' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="w-24 h-24 mx-auto border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-2xl font-accent">Waiting for players...</h2>
                <button 
                  onClick={startGame}
                  className="bg-charcoal text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg"
                >
                  Start Game
                </button>
              </motion.div>
            )}

            {gameState === 'DRAWING' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-3xl font-accent font-bold text-charcoal mb-2">Drawing Phase</h2>
                <p className="text-gray-600 mb-6">Players are creating their masterpieces.</p>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gold h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${totalExpected ? (artworksSubmitted / totalExpected) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="font-bold">{artworksSubmitted} / {totalExpected} artworks submitted</p>
                
                <div className="mt-8">
                  <button 
                    onClick={startAuction}
                    className="bg-charcoal text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition"
                  >
                    Force Start Auction
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'BIDDING' && auctionData && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                <div className="flex justify-between items-center mb-6 px-4">
                  <h2 className="text-2xl font-accent font-bold">Round {auctionData.roundNumber} / {auctionData.totalRounds}</h2>
                  <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-2xl font-accent">
                    {auctionData.timeLeft}s
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-6 flex justify-center">
                  <img src={auctionData.imageData} alt="Current Auction" className="max-h-64 object-contain" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <p className="text-xs uppercase text-gray-500 font-bold mb-1">Current Bid</p>
                    <p className="text-3xl font-bold text-gold font-accent">${auctionData.currentBid}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <p className="text-xs uppercase text-gray-500 font-bold mb-1">Highest Bidder</p>
                    <p className="text-2xl font-bold text-charcoal truncate">{auctionData.highestBidder}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'RESULT' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-3xl font-accent font-bold text-charcoal">Round Complete</h2>
                <p className="text-gray-600 mb-8">Players are viewing their results.</p>
                <button 
                  onClick={nextRound}
                  className="bg-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition shadow-lg"
                >
                  Start Next Round
                </button>
              </motion.div>
            )}

            {gameState === 'GAMEOVER' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-4xl font-accent font-bold text-gold mb-4">Game Over</h2>
                <p className="text-gray-600">The auction has concluded. Players are viewing final rankings.</p>
              </motion.div>
            )}

          </div>
        </div>

        {/* Right Column: Player List */}
        <div className="glass-panel p-6 rounded-2xl h-fit">
          <h3 className="font-bold uppercase tracking-widest text-sm text-gray-500 mb-4">Connected Players</h3>
          {players.length === 0 ? (
            <p className="text-gray-400 italic text-center py-8">No players yet</p>
          ) : (
            <div className="space-y-3">
              {players.map(player => (
                <div key={player.id} className="flex items-center p-3 bg-white/60 rounded-xl border border-gray-100">
                  <img src={player.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200 bg-white mr-3" />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-charcoal truncate">{player.name}</p>
                    <p className="text-xs text-gray-500">${player.cash}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostScreen;
