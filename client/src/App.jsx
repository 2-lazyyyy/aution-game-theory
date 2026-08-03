import React, { useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { AnimatePresence } from 'framer-motion';

// Screens
import JoinScreen from './screens/JoinScreen';
import LobbyScreen from './screens/LobbyScreen';
import DrawingScreen from './screens/DrawingScreen';
import WaitingScreen from './screens/WaitingScreen';
import AuctionScreen from './screens/AuctionScreen';
import RoundResultScreen from './screens/RoundResultScreen';
import FinalResultsScreen from './screens/FinalResultsScreen';
import HostScreen from './screens/HostScreen';

function App() {
  const socket = useSocket();
  const [gameState, setGameState] = useState('join'); // 'join', 'lobby', 'drawing', 'waitingAuction', 'bidding', 'result', 'finalResults', 'host'
  const [playerInfo, setPlayerInfo] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  
  // Game Data
  const [prompts, setPrompts] = useState([]);
  const [auctionData, setAuctionData] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [finalScores, setFinalScores] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Determine if we are on host route
    if (window.location.pathname === '/host') {
      setGameState('host');
    }

    socket.on('join_success', (data) => {
      setPlayerInfo(data.playerInfo);
      setRoomCode(data.roomCode);
      setGameState('lobby');
      setErrorMsg('');
    });

    socket.on('error', (data) => {
      setErrorMsg(data.message);
      // alert(`Error: ${data.message}`);
    });

    socket.on('receive_prompts', (data) => {
      setPrompts(data.prompts);
      setGameState('drawing');
    });

    socket.on('start_auction_round', (data) => {
      setAuctionData(data);
      setGameState('bidding');
    });

    socket.on('round_result', (data) => {
      setRoundResult(data);
      setGameState('result');
    });

    socket.on('game_over', (data) => {
      setFinalScores(data.scores);
      setGameState('finalResults');
    });

    socket.on('room_closed', () => {
      alert("Room closed by host.");
      setGameState('join');
      setPlayerInfo(null);
      setRoomCode('');
    });

    return () => {
      socket.off('join_success');
      socket.off('error');
      socket.off('receive_prompts');
      socket.off('start_auction_round');
      socket.off('round_result');
      socket.off('game_over');
      socket.off('room_closed');
    };
  }, [socket]);

  // Error toast
  const dismissError = () => setErrorMsg('');

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center p-4 sm:p-8 font-primary">
      {errorMsg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center gap-4">
          <span>{errorMsg}</span>
          <button onClick={dismissError} className="font-bold">&times;</button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {gameState === 'join' && <JoinScreen key="join" />}
        {gameState === 'lobby' && <LobbyScreen key="lobby" playerInfo={playerInfo} roomCode={roomCode} />}
        {gameState === 'drawing' && <DrawingScreen key="drawing" prompts={prompts} setGameState={setGameState} />}
        {gameState === 'waitingAuction' && <WaitingScreen key="waitingAuction" />}
        {gameState === 'bidding' && <AuctionScreen key="bidding" auctionData={auctionData} />}
        {gameState === 'result' && <RoundResultScreen key="result" result={roundResult} />}
        {gameState === 'finalResults' && <FinalResultsScreen key="finalResults" scores={finalScores} />}
        {gameState === 'host' && <HostScreen key="host" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
