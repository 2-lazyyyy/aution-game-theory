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
    // Convert SVG to PNG Base64 to send to server
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;
    
    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      socket.emit('submit_drawing', { imageData });
      
      // Failsafe
      setTimeout(() => {
          setIsSubmitting(false);
      }, 15000);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const prompt = prompts[currentPromptIndex] || 'Loading...';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md mt-4 flex flex-col h-[85vh]"
    >
      <div className="glass-panel p-4 rounded-t-2xl text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase">Draw This ({currentPromptIndex + 1}/2)</p>
        <h2 className="text-2xl font-bold font-accent mt-1 text-charcoal">{prompt}</h2>
      </div>

      <div className="flex-1 bg-white relative overflow-hidden shadow-inner border-x border-gray-200 touch-none">
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

      <div className="glass-panel p-4 rounded-b-2xl flex gap-4">
        <button 
          onClick={clearCanvas} 
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Clear
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || (lines.length === 0 && !currentLine)}
          className="flex-2 bg-charcoal text-white py-3 px-6 rounded-lg font-semibold hover:bg-black transition disabled:opacity-50 min-w-[140px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Art'}
        </button>
      </div>
    </motion.div>
  );
};

export default DrawingScreen;
