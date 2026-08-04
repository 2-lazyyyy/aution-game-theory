const io = require('socket.io-client');
const SERVER_URL = 'http://localhost:3000';

async function runTest() {
  console.log('--- STARTING GAME TEST ---');
  
  const host = io(SERVER_URL);
  let roomCode = '';
  
  host.on('connect', () => {
    console.log('Host connected:', host.id);
    host.emit('create_room');
  });

  host.on('room_created', (data) => {
    roomCode = data.roomCode;
    console.log(`[Host] Room created: ${roomCode}`);
    
    // Now connect players
    connectPlayers(roomCode);
  });

  const p1 = io(SERVER_URL);
  const p2 = io(SERVER_URL);
  
  let p1Submitted = 0;
  let p2Submitted = 0;

  function connectPlayers(code) {
    p1.emit('join_room', { roomCode: code, name: 'Alice' });
    p2.emit('join_room', { roomCode: code, name: 'Bob' });
  }

  p1.on('join_success', (data) => console.log(`[P1] Joined room ${data.roomCode}`));
  p2.on('join_success', (data) => {
    console.log(`[P2] Joined room ${data.roomCode}`);
    // Both joined, host starts drawing
    setTimeout(() => {
      console.log('[Host] Starting drawing phase...');
      host.emit('start_drawing');
    }, 1000);
  });

  const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  p1.on('receive_prompts', (data) => {
    console.log(`[P1] Received prompts:`, data.prompts);
    // Submit drawings
    setTimeout(() => {
      p1.emit('submit_drawing', { imageData: dummyImage });
      setTimeout(() => p1.emit('submit_drawing', { imageData: dummyImage }), 500);
    }, 500);
  });

  p2.on('receive_prompts', (data) => {
    console.log(`[P2] Received prompts:`, data.prompts);
    setTimeout(() => {
      p2.emit('submit_drawing', { imageData: dummyImage });
      setTimeout(() => p2.emit('submit_drawing', { imageData: dummyImage }), 500);
    }, 500);
  });
  
  p1.on('submit_success', (data) => {
    p1Submitted++;
    console.log(`[P1] Submitted artwork ${p1Submitted}/2`);
    checkAllSubmitted();
  });
  
  p2.on('submit_success', (data) => {
    p2Submitted++;
    console.log(`[P2] Submitted artwork ${p2Submitted}/2`);
    checkAllSubmitted();
  });

  function checkAllSubmitted() {
    if (p1Submitted === 2 && p2Submitted === 2) {
      console.log('[Host] All artworks submitted. Forcing auction start...');
      host.emit('start_auction');
    }
  }

  p1.on('start_auction_round', (data) => {
    console.log(`[P1] Auction round ${data.roundNumber} started. Artwork is yours? ${data.artwork.isYourArt}`);
    if (!data.artwork.isYourArt) {
      // Bid on it
      setTimeout(() => {
        console.log('[P1] Placing bid of $500');
        p1.emit('place_bid', { amount: 500 });
      }, 1000);
    }
  });

  p2.on('start_auction_round', (data) => {
    console.log(`[P2] Auction round ${data.roundNumber} started. Artwork is yours? ${data.artwork.isYourArt}`);
    if (!data.artwork.isYourArt) {
      setTimeout(() => {
        console.log('[P2] Placing bid of $1000');
        p2.emit('place_bid', { amount: 1000 });
      }, 2000);
    }
  });

  host.on('round_result', (data) => {
    console.log(`[Host] Round result! Sold to ${data.soldTo} for $${data.soldPrice}`);
    setTimeout(() => {
      console.log('[Host] Starting next round...');
      host.emit('host_action', { action: 'next_round' });
    }, 1000);
  });

  host.on('game_over', (data) => {
    console.log('--- GAME OVER ---');
    console.log('Final Results:');
    data.results.forEach((r, i) => {
      console.log(`${i+1}. ${r.name} - $${r.netWorth}`);
    });
    console.log('Test successful. Exiting...');
    process.exit(0);
  });
  
  // Timeout failsafe
  setTimeout(() => {
      console.error('Test timed out!');
      process.exit(1);
  }, 20000);
}

runTest();
