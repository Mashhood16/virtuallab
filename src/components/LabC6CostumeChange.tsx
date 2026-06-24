import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6CostumeChange({ onExit }: LabProps) {
  const [costume, setCostume] = useState<'flying' | 'standing'>('flying');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key.toLowerCase());
      if (e.key.toLowerCase() === 'c') {
        setCostume(prev => prev === 'flying' ? 'standing' : 'flying');
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Costume Change Event" />

        <h1 className="text-3xl font-bold mb-2">Costume Change Event</h1>
        <p className="text-slate-600 mb-8">Press the 'c' key on your keyboard to trigger the event and change the Rocket's costume.</p>

        <div className="flex gap-8 flex-1">
          {/* Blocks Editor (Mock) */}
          <div className="w-80 bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-amber-500 text-white font-bold p-3 text-sm">Events & Looks</div>
            <div className="flex-1 p-6 flex flex-col gap-2 bg-slate-50/50">
              
              <div className="bg-amber-400 rounded-lg shadow-sm border border-amber-500 p-4 w-full text-amber-900 font-bold text-sm rounded-b-none pb-6 relative z-10">
                <div className="absolute top-0 left-4 w-12 h-3 bg-amber-500 rounded-b-full"></div>
                when [ c ] key pressed
              </div>
              <div className="bg-purple-500 rounded-lg shadow-sm border border-purple-600 p-4 w-full text-white font-bold text-sm -mt-4 relative z-20 ml-2">
                next costume
              </div>

              <div className={`mt-12 p-4 rounded-xl border-2 text-center transition-colors ${pressedKey === 'c' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                {pressedKey === 'c' ? 'Event Triggered!' : "Waiting for 'c' key..."}
              </div>

            </div>
          </div>

          {/* Stage Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-50 rounded-t-xl shadow-sm border border-slate-200 border-b-0 p-3 flex justify-between items-center bg-slate-100">
              <span className="font-bold text-sm text-slate-600">Scratch Stage</span>
              <span className="font-bold text-xs text-slate-400">Current Costume: {costume}</span>
            </div>
            
            <div className="bg-slate-50 flex-1 rounded-b-xl shadow-sm border border-slate-200 relative overflow-hidden flex items-center justify-center">
              
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-indigo-900">
                {/* Stars */}
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 140px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0))', backgroundSize: '200px 200px' }} />
              </div>

              {/* Sprite (Rocket) */}
              <div className="relative transform scale-150 transition-all duration-300">
                {costume === 'flying' ? (
                  <div className="flex flex-col items-center animate-bounce">
                    <Rocket className="w-24 h-24 text-white" fill="#ef4444" strokeWidth={1} />
                    {/* Engine Fire */}
                    <div className="w-4 h-12 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full blur-sm mt-1 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Rocket className="w-24 h-24 text-white" fill="#ef4444" strokeWidth={1} />
                    {/* Landing Legs */}
                    <div className="flex gap-8 -mt-4">
                      <div className="w-2 h-16 bg-slate-400 transform -rotate-45 rounded-full" />
                      <div className="w-2 h-16 bg-slate-400 transform rotate-45 rounded-full" />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
