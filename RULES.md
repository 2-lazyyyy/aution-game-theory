# Nash Auction - Project Rules & Architecture

This document contains critical system details, architecture constraints, and rules to follow when modifying this project.

## 1. Technology Stack
- **Frontend**: React.js, Vite, TailwindCSS v4 (using `@tailwindcss/vite` plugin), Framer Motion. Runs on port `5173`.
- **Backend**: Node.js, Express, Socket.io. Runs on port `3000`.
- **Communication**: Real-time WebSockets via `socket.io`.

## 2. Running the Application
- **NEVER** run the frontend and backend servers separately.
- **ALWAYS** use the single command `npm run dev` from the root directory (`/Nash_Auction_Game`).
- The root `package.json` uses the `concurrently` package to spin up both `nodemon server.js` and `vite` simultaneously.

## 3. UI/UX Aesthetics (Strict Guidelines)
- **Theme**: "High-End Art Auction" / Premium Digital Canvas.
- **Color Palette**: Dark Mode (Deep Obsidian `#0F172A`), Gold/Amber accents (`#F59E0B`), and soft Indigo glowing effects.
- **Components**: Do not use flat white backgrounds. Rely on glassmorphism classes (`.glass-card` defined in `index.css`) which provide heavy backdrop blur, translucent backgrounds, and subtle borders.
- **Animations**: Use `framer-motion` extensively for transitions, hover effects, and layout changes. The UI should feel dynamic and responsive.

## 4. Game Logic & State Machine
- **Host vs Players**: The Host is a passive dashboard that orchestrates the game (`HostScreen.jsx`). Players join via mobile/desktop (`App.jsx` -> various screens).
- **Phases**: `LOBBY` -> `DRAWING` -> `BIDDING` -> `RESULT` -> `GAMEOVER`.
- **Drawing Phase**: Players draw on an SVG canvas. The drawing must be exported with precise width/height attributes or the image will not scale properly.
- **Auction Phase**: Anti-sniping timers reset to 10 seconds upon new bids.

## 5. Socket Payloads & Data Structures (CRITICAL)
- When updating Socket emits, ensure payloads strictly match what the React components expect.
- **`round_result`**: Must be emitted individually to each player (not broadcasted blindly) because `profit` and `newNetWorth` are unique to each player.
- **`game_over`**: The payload must include `scores` (not `results`), mapped carefully with `id`, `avatar`, `name`, `cash`, `portfolioValue`, `netWorth`, and `artworksWon`.

## 6. General Workflows
- **Module Format**: The backend is CommonJS. Test scripts (like `test_game.cjs`) must use the `.cjs` extension if they import CommonJS within the Vite (ESM) workspace.
- **Styling**: Tailwind v4 is used; it does not use a `tailwind.config.js` or `postcss.config.js`. Theme variables are declared in `index.css` via `@theme`.
