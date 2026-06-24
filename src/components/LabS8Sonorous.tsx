import { useState, useEffect } from 'react';
import { BellRing } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const MATERIALS = [
  { id: 'steel', name: 'Steel Plate', type: 'metal', color: 'bg-slate-300', soundType: 'ring' },
  { id: 'wood', name: 'Wooden Block', type: 'non-metal', color: 'bg-amber-800', soundType: 'thud' },
  { id: 'brass', name: 'Brass Bell', type: 'metal', color: 'bg-yellow-500', soundType: 'ring' },
  { id: 'plastic', name: 'Plastic Box', type: 'non-metal', color: 'bg-blue-400', soundType: 'thud' },
];

export default function LabS8Sonorous({ onExit }: LabProps) {
  const [selected, setSelected] = useState(MATERIALS[0]);
  const [isStriking, setIsStriking] = useState(false);
  const [waves, setWaves] = useState<number[]>([]);

  const strike = () => {
    setIsStriking(true);
    setTimeout(() => {
      setIsStriking(false);
      
      // Generate sound waves based on material type
      if (selected.soundType === 'ring') {
        // Many waves for ringing metal
        setWaves([1, 2, 3, 4, 5]);
      } else {
        // Just one dull wave for thud
        setWaves([1]);
      }
      
    }, 150);
  };

  // Clear waves after animation
  useEffect(() => {
    if (waves.length > 0) {
      const timer = setTimeout(() => {
        setWaves([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [waves]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Act 5.7: Sonorous Nature" subtitle="Strike materials to hear if they produce a ringing sound" />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Selection */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <h3 className="font-bold text-slate-700 mb-2">Select Material</h3>
          {MATERIALS.map(m => (
            <button 
              key={m.id}
              onClick={() => { setSelected(m); setWaves([]); }}
              className={`p-3 text-left rounded-lg font-bold transition-all border-2 ${selected.id === m.id ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'}`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Action Area */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            
            {/* Sound Waves */}
            {waves.map((w, i) => (
              <div 
                key={w}
                className="absolute rounded-full border border-purple-400 pointer-events-none"
                style={{
                  width: '100%',
                  height: '100%',
                  animation: `ripple ${selected.soundType === 'ring' ? '2s' : '0.5s'} ease-out forwards`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}

            {/* The Material Object */}
            <div className={`w-32 h-32 ${selected.color} shadow-lg flex items-center justify-center relative z-10 ${selected.id === 'brass' ? 'rounded-full rounded-b-sm' : 'rounded-lg'} ${waves.length > 0 && selected.soundType === 'ring' ? 'animate-[shake_0.1s_linear_infinite]' : ''}`}>
              <span className="text-4xl opacity-50 mix-blend-overlay font-bold">
                {selected.id.substring(0, 2).toUpperCase()}
              </span>
            </div>

            {/* Mallet */}
            <div 
              className="absolute right-0 top-0 w-24 h-24 origin-bottom-right z-20"
              style={{
                transform: isStriking ? 'rotate(-60deg)' : 'rotate(0deg)',
                transition: 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div className="absolute top-4 right-4 w-16 h-4 bg-amber-200 rounded-full rotate-45" />
              <div className="absolute top-0 right-16 w-8 h-8 bg-slate-700 rounded-full" />
            </div>

          </div>

          <div className="text-center w-full max-w-md">
            <button 
              onClick={strike}
              disabled={isStriking || waves.length > 0}
              className="w-full bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 text-xl shadow-lg flex justify-center items-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
            >
              <BellRing className="w-6 h-6" /> Strike
            </button>

            {waves.length > 0 && (
              <div className={`mt-6 px-6 py-4 rounded-xl border-2 animate-fade-in ${selected.soundType === 'ring' ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
                <h3 className="font-bold text-lg mb-1">{selected.name} is a {selected.type.toUpperCase()}</h3>
                <p className="text-sm">
                  {selected.soundType === 'ring' 
                    ? "TIIING! It produces a ringing sound. Metals are SONOROUS." 
                    : "THUD. It produces a dull sound. Non-metals are NON-SONOROUS."}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          25% { transform: translate(-1px, -2px) rotate(-1deg); }
          50% { transform: translate(-3px, 0px) rotate(1deg); }
          75% { transform: translate(3px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -1px) rotate(0deg); }
        }
      `}} />
    </div>
  );
}
