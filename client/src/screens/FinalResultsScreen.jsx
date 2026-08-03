import React from 'react';
import { motion } from 'framer-motion';

const FinalResultsScreen = ({ scores }) => {
  if (!scores) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mt-4"
    >
      <div className="glass-panel p-6 rounded-2xl text-center">
        <h2 className="text-4xl font-bold font-accent text-gold mb-2">Game Over!</h2>
        <p className="text-gray-500 mb-8 uppercase tracking-widest text-sm">Final Rankings</p>
        
        <div className="space-y-4">
          {scores.map((player, index) => (
            <motion.div 
              key={player.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center p-4 rounded-xl shadow-sm border ${
                index === 0 ? 'bg-gold/10 border-gold/50' : 'bg-white border-gray-100'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg mr-4 ${
                index === 0 ? 'bg-gold text-white shadow-lg' : 'bg-gray-100 text-gray-500'
              }`}>
                #{index + 1}
              </div>
              <img src={player.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white bg-gray-50 mr-4 shadow-sm" />
              <div className="flex-1 text-left">
                <p className="font-bold text-lg text-charcoal">{player.name}</p>
                <p className="text-sm text-gray-500">{player.artworksWon} Artworks Won</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-xl ${index === 0 ? 'text-gold' : 'text-charcoal'}`}>
                  ${player.cash}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="mt-8 w-full bg-charcoal text-white py-4 rounded-xl font-bold hover:bg-black transition"
        >
          Play Again
        </button>
      </div>
    </motion.div>
  );
};

export default FinalResultsScreen;
