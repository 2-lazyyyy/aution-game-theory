import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../SocketContext';
import { getStroke } from 'perfect-freehand';

// Helper to render the SVG path from perfect-freehand stroke
const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return '';
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );
  d.push('Z');
  return d.join(' ');
};

const DrawingScreen = ({ prompts, setGameState }) => {
  const socket = useSocket();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [lines, setLines] = useState([]); // Array of { points: [{x,y}], color, size }
  const [currentLine, setCurrentLine] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const svgRef = useRef(null);

  const currentColor = '#000000';
  const brushSize = 5;

  useEffect(() => {
    socket.on('submit_success', (data) => {
      if (data.submittedCount < 2) {
        setCurrentPromptIndex(data.submittedCount);
        setLines([]);
        setIsSubmitting(false);
      } else {
        setGameState('waitingAuction');
      }
    });
    
    socket.on('error', () => {
        setIsSubmitting(false);
    });

    return () => {
      socket.off('submit_success');
      socket.off('error');
    };
  }, [socket, setGameState]);

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ points: [[x, y, e.pressure || 0.5]], color: currentColor, size: brushSize });
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine((prev) => ({
      ...prev,
      points: [...prev.points, [x, y, e.pressure || 0.5]]
    }));
  };

  const handlePointerUp = (e) => {
    setIsDrawing(false);
    if (currentLine) {
      setLines((prev) => [...prev, currentLine]);
      setCurrentLine(null);
    }
  };

  const clearCanvas = () => {
    setLines([]);
    setCurrentLine(null);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const svgElement = svgRef.current;
    
    // Explicitly set width, height and xmlns for proper rasterization
    svgElement.setAttribute('width', svgElement.clientWidth);
    svgElement.setAttribute('height', svgElement.clientHeight);
    if (!svgElement.getAttribute('xmlns')) {
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      socket.emit('submit_drawing', { imageData });
      
      setTimeout(() => {
          setIsSubmitting(false);
      }, 15000);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const prompt = prompts[currentPromptIndex] || 'Loading...';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-lg mt-4 flex flex-col h-[85vh] relative"
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50 pointer-events-none"></div>
      
      <div className="glass-card p-5 rounded-t-3xl text-center border-b-0 relative z-10">
        <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">Commission {currentPromptIndex + 1}/2</p>
        </div>
        <h2 className="text-2xl font-bold font-accent mt-1 text-white tracking-wide">{prompt}</h2>
      </div>

      <div className="flex-1 bg-slate-50 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] border-x-4 border-slate-700 touch-none z-10">
        <svg
          ref={svgRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        >
          {/* Render historical lines */}
          {lines.map((line, i) => {
            const stroke = getStroke(line.points, { size: line.size, thinning: 0.5, smoothing: 0.5, streamline: 0.5 });
            const pathData = getSvgPathFromStroke(stroke);
            return <path key={i} d={pathData} fill={line.color} />;
          })}
          {/* Render current line */}
          {currentLine && (
            <path
              d={getSvgPathFromStroke(getStroke(currentLine.points, { size: currentLine.size, thinning: 0.5, smoothing: 0.5, streamline: 0.5 }))}
              fill={currentLine.color}
            />
          )}
        </svg>
      </div>

      <div className="glass-card p-5 rounded-b-3xl flex gap-4 border-t-0 relative z-10">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas} 
          disabled={isSubmitting}
          className="flex-1 bg-slate-800 text-slate-300 border border-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition uppercase tracking-wider text-sm"
        >
          Clear
        </motion.button>
        <motion.button 
          whileHover={(!isSubmitting && (lines.length > 0 || currentLine)) ? { scale: 1.05 } : {}}
          whileTap={(!isSubmitting && (lines.length > 0 || currentLine)) ? { scale: 0.95 } : {}}
          onClick={handleSubmit} 
          disabled={isSubmitting || (lines.length === 0 && !currentLine)}
          className="flex-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 py-3 px-6 rounded-xl font-bold hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-50 min-w-[150px] shadow-[0_0_15px_rgba(245,158,11,0.3)] uppercase tracking-wider"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Art'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DrawingScreen;
