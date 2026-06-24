import { useState, useEffect } from 'react';
import {Sun, Moon } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabS8StimulusResponseProps {
  onExit?: () => void;
}

interface Termite {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export default function LabS8StimulusResponse({ onExit }: LabS8StimulusResponseProps) {
  const [isCovered, setIsCovered] = useState(false);
  const [termites, setTermites] = useState<Termite[]>([]);

  // Initialize termites randomly
  useEffect(() => {
    resetTermites();
  }, []);

  const resetTermites = () => {
    const initial = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      targetX: 10 + Math.random() * 80,
      targetY: 10 + Math.random() * 80,
    }));
    setTermites(initial);
    setIsCovered(false);
  };

  // Movement loop
  useEffect(() => {
    const interval = window.setInterval(() => {
      setTermites(current => current.map(t => {
        let newTargetX = t.targetX;
        let newTargetY = t.targetY;

        // If they reach target, pick a new one
        if (Math.abs(t.x - t.targetX) < 5 && Math.abs(t.y - t.targetY) < 5) {
          if (isCovered) {
            // Dark preference: Target the right half (dark half: x > 50)
            newTargetX = 55 + Math.random() * 40;
            newTargetY = 10 + Math.random() * 80;
          } else {
            // Random everywhere
            newTargetX = 10 + Math.random() * 80;
            newTargetY = 10 + Math.random() * 80;
          }
        }

        // Move towards target
        const dx = newTargetX - t.x;
        const dy = newTargetY - t.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const speed = 1.5;
        const moveX = dist > 0 ? (dx / dist) * speed : 0;
        const moveY = dist > 0 ? (dy / dist) * speed : 0;

        return {
          ...t,
          x: t.x + moveX,
          y: t.y + moveY,
          targetX: newTargetX,
          targetY: newTargetY,
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isCovered]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Act 2.1: Stimulus Response" subtitle="Observe termite behavior towards light vs dark" />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Left Column: Interactive */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
          
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setIsCovered(false)}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${!isCovered ? 'bg-amber-100 text-amber-700 border-2 border-amber-400' : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'}`}
            >
              <Sun className="w-5 h-5" /> Uncovered (Full Light)
            </button>
            <button 
              onClick={() => setIsCovered(true)}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isCovered ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400' : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'}`}
            >
              <Moon className="w-5 h-5" /> Cover Right Half
            </button>
          </div>

          <div className="relative w-80 h-80 rounded-full border-4 border-slate-300 bg-amber-50/50 shadow-inner overflow-hidden mx-auto">
            
            {/* The petri dish division */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full flex items-center justify-center">
                <span className="text-amber-200 font-bold opacity-50 select-none">LIGHT</span>
              </div>
              <div className={`w-1/2 h-full flex items-center justify-center transition-colors duration-1000 ${isCovered ? 'bg-slate-900/90' : ''}`}>
                <span className={`font-bold opacity-50 select-none ${isCovered ? 'text-slate-600' : 'text-amber-200'}`}>
                  {isCovered ? 'DARK' : 'LIGHT'}
                </span>
              </div>
            </div>

            {/* Termites */}
            {termites.map(t => (
              <div 
                key={t.id}
                className="absolute w-3 h-2 bg-amber-800 rounded-full transition-all duration-75"
                style={{ 
                  left: `${t.x}%`, 
                  top: `${t.y}%`,
                  transform: `translate(-50%, -50%) rotate(${Math.atan2(t.targetY - t.y, t.targetX - t.x)}rad)`
                }}
              >
                {/* Ant antennae */}
                <div className="absolute -right-1 -top-1 w-1.5 h-0.5 bg-amber-900 rotate-45" />
                <div className="absolute -right-1 -bottom-1 w-1.5 h-0.5 bg-amber-900 -rotate-45" />
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-200">
              <div className="text-sm font-bold text-amber-700">Light Side</div>
              <div className="text-2xl font-bold text-amber-800">
                {termites.filter(t => t.x <= 50).length}
              </div>
            </div>
            <div className={`p-4 rounded-xl text-center border transition-colors ${isCovered ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-amber-50 border-amber-200'}`}>
              <div className={`text-sm font-bold ${isCovered ? 'text-slate-400' : 'text-amber-700'}`}>
                {isCovered ? 'Dark Side' : 'Light Side'}
              </div>
              <div className={`text-2xl font-bold ${isCovered ? 'text-white' : 'text-amber-800'}`}>
                {termites.filter(t => t.x > 50).length}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Biological Response</h3>
            <p className="text-sm text-blue-800 mb-4">
              Animals naturally respond to environmental changes (stimuli) to survive.
            </p>
            <p className="text-sm text-blue-800">
              When half the petri dish is covered, you will notice the termites gradually migrate to the darker side and stay there. Termites prefer dark, moist environments (negative phototaxis) to protect themselves from predators and dehydration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
