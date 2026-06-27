import { useState, useEffect, useRef } from 'react';
import { Hand, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabS8ReflexTimeProps {
  onExit?: () => void;
}

export default function LabS8ReflexTime({ onExit }: LabS8ReflexTimeProps) {
  const [gameState, setGameState] = useState<'ready' | 'falling' | 'caught' | 'missed'>('ready');
  const [rulerY, setRulerY] = useState(0); // 0 to 400 (pixels dropped)
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  
  const dropStartTime = useRef<number>(0);
  const fallAnimationRef = useRef<number>(0);

  const GRAVITY = 2.0; // m/s^2 artificially lowered for easier catching
  const PIXELS_PER_CM = 10;

  const startDrop = () => {
    // Random delay between 1-4 seconds
    setGameState('ready');
    setRulerY(0);
    setReactionTimeMs(null);

    const delay = 1000 + Math.random() * 3000;
    setTimeout(() => {
      setGameState('falling');
      dropStartTime.current = performance.now();
      animateFall();
    }, delay);
  };

  const animateFall = () => {
    const timeNow = performance.now();
    const tSeconds = (timeNow - dropStartTime.current) / 1000;
    
    // Distance = 0.5 * g * t^2 (in meters)
    const distanceMeters = 0.5 * GRAVITY * tSeconds * tSeconds;
    const distanceCm = distanceMeters * 100;
    const distancePixels = distanceCm * PIXELS_PER_CM;

    setRulerY(distancePixels);

    if (distancePixels < 500) {
      fallAnimationRef.current = requestAnimationFrame(animateFall);
    } else {
      setGameState('missed');
    }
  };

  const handleCatch = () => {
    if (gameState === 'falling') {
      if (fallAnimationRef.current) cancelAnimationFrame(fallAnimationRef.current);
      const catchTime = performance.now() - dropStartTime.current;
      setReactionTimeMs(catchTime);
      setGameState('caught');
    }
  };

  useEffect(() => {
    return () => {
      if (fallAnimationRef.current) cancelAnimationFrame(fallAnimationRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans">
      <LabHeader onExit={onExit} title="Act 2.3: Reflex Action Time" subtitle="Measure human reaction time" />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Left Column: Interactive */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6 flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-6">
            <button 
              onClick={startDrop} 
              disabled={gameState === 'falling'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Start Trial
            </button>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
              <p className={`font-bold ${gameState === 'caught' ? 'text-green-600' : gameState === 'missed' ? 'text-red-600' : 'text-slate-800 dark:text-slate-100'}`}>
                {gameState.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="relative w-32 h-[500px] border border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-xl overflow-hidden flex justify-center mt-4" style={{backgroundColor: 'rgb(var(--slate-50))'}}>
            
            {/* The Ruler */}
            <div 
              className="absolute w-12 bg-yellow-400 border-x-2 border-yellow-600 h-[400px] z-10"
              style={{
                top: `${-rulerY}px`
              }}
            >
              {/* Ruler markings */}
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-full h-0 border-b border-yellow-700 opacity-50" style={{ marginTop: '13.3px' }}>
                  <span className="text-[8px] font-bold ml-1">{i+1}</span>
                </div>
              ))}
            </div>

            {/* The catching hand line */}
            <div className="absolute top-[300px] w-full border-t-2 border-red-500 border-dashed z-10 pointer-events-none" />
            <Hand className="absolute top-[300px] -right-16 w-12 h-12 text-slate-400 -mt-6 z-10" />

            {/* Catch Button Overlay */}
            <button 
              onMouseDown={handleCatch}
              className="absolute inset-0 w-full h-full cursor-pointer z-20 outline-none"
              aria-label="Click here to catch"
            />
          </div>

          <div className="mt-6 text-center font-medium" style={{color: 'rgb(var(--slate-600))'}}>
            Click the RULER area to catch it when it drops!
          </div>

        </div>

        {/* Right Column */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-slate-800 dark:bg-slate-800 rounded-2xl shadow-sm text-white p-6">
            <h3 className="font-bold mb-4 text-slate-300">Results</h3>
            
            <div className="mb-4">
              <p className="text-sm text-slate-400">Distance Dropped</p>
              <p className="text-3xl font-bold font-mono">
                {gameState === 'caught' ? (rulerY / PIXELS_PER_CM).toFixed(1) : '-.--'} cm
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400">Reaction Time</p>
              <p className="text-3xl font-bold font-mono text-green-400">
                {reactionTimeMs ? `${(reactionTimeMs / 1000).toFixed(3)} s` : '-.--- s'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" /> The Math
            </h3>
            <p className="text-sm text-blue-800 mb-2">
              Unlike a knee-jerk reflex, catching a ruler is a voluntary action processed by the brain. It takes time for the eye to see it drop, the brain to process it, and a signal to reach the hand muscles.
            </p>
            <p className="text-xs text-blue-700 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-blue-200 font-mono text-center">
              t = √(2d / g)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
