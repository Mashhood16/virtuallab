import { useState, useEffect } from 'react';
import { RefreshCw, Flame } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const MATERIALS = [
  { id: 'cu', name: 'Copper Rod', type: 'metal', color: 'bg-orange-500', conducts: true },
  { id: 'wood', name: 'Wooden Stick', type: 'non-metal', color: 'bg-amber-800', conducts: false },
  { id: 'glass', name: 'Glass Rod', type: 'non-metal', color: 'bg-cyan-100', conducts: false },
];

export default function LabS8ThermalConductivity({ onExit }: LabProps) {
  const [selected, setSelected] = useState(MATERIALS[0]);
  const [heating, setHeating] = useState(false);
  const [temp, setTemp] = useState(0); // 0 to 100

  useEffect(() => {
    if (!heating) return;
    
    const interval = setInterval(() => {
      setTemp(t => {
        if (t >= 100) {
          setHeating(false);
          return 100;
        }
        return t + (selected.conducts ? 4 : 0.5);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [heating, selected.conducts]);

  const reset = () => {
    setHeating(false);
    setTemp(0);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Act 5.6: Thermal Conductivity" subtitle="Observe how heat travels through materials" rightContent={<>{rightJsx}</>} />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Selection */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <h3 className="font-bold text-slate-700 mb-2">Select Rod</h3>
          {MATERIALS.map(m => (
            <button 
              key={m.id}
              onClick={() => { setSelected(m); reset(); }}
              className={`p-3 text-left rounded-lg font-bold transition-all border-2 ${selected.id === m.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'}`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Action Area */}
        <div className="flex-1 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          
          <div className="relative w-full max-w-lg h-64 flex items-center justify-center">
            
            {/* Burner */}
            <div className="absolute left-10 bottom-10 w-16 h-24 bg-zinc-700 rounded-t-lg z-0 flex flex-col items-center">
              {heating && (
                <div className="absolute -top-12 text-orange-500 animate-pulse">
                  <Flame className="w-16 h-16 fill-orange-500" />
                </div>
              )}
            </div>

            {/* The Rod */}
            <div className="absolute left-16 right-20 h-6 flex items-center z-10 perspective-[500px]">
              
              {/* Base material color */}
              <div className={`absolute inset-0 ${selected.color} rounded-full shadow-lg border border-white/10`} />
              
              {/* Heat gradient overlay */}
              <div 
                className="absolute inset-0 rounded-full transition-all duration-[50ms]"
                style={{
                  background: `linear-gradient(90deg, rgba(239,68,68,0.9) 0%, rgba(249,115,22,0.8) ${temp / 2}%, transparent ${temp}%)`,
                  opacity: temp > 0 ? 1 : 0
                }}
              />

              {/* Wax pieces (drop when heat reaches them) */}
              {[30, 60, 90].map((pos, i) => {
                const isMelted = temp > pos;
                return (
                  <div 
                    key={i}
                    className={`absolute w-4 h-6 bg-slate-200 rounded-sm shadow-md transition-all duration-500 ${isMelted ? 'opacity-0 translate-y-16 scale-y-150 bg-slate-300/50' : ''}`}
                    style={{ left: `${pos}%`, top: isMelted ? '20px' : '-4px' }}
                  >
                    {!isMelted && <div className="absolute -bottom-2 w-full h-2 bg-slate-200 clip-path-triangle" />}
                  </div>
                );
              })}

            </div>

            {/* Hand holding the other end */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-1000 ${temp > 80 ? 'bg-red-500/20' : 'bg-transparent'}`}>
                <span className="text-4xl select-none" style={{ filter: temp > 80 ? 'sepia(1) hue-rotate(-50deg) saturate(3)' : 'none' }}>
                  {temp > 80 ? '🥵' : '🧤'}
                </span>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center h-24">
            {!heating && temp === 0 ? (
              <button 
                onClick={() => setHeating(true)}
                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 text-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-2 mx-auto transition-transform active:scale-95"
              >
                🔥 Turn on Burner
              </button>
            ) : (
              <div className={`px-6 py-4 rounded-xl border border-slate-700 animate-fade-in ${temp >= 95 ? (selected.conducts ? 'bg-red-900/50 text-red-200' : 'bg-slate-800 text-slate-300') : 'bg-slate-800 text-slate-300'}`}>
                <h3 className="font-bold text-lg mb-1">{selected.name} is a {selected.type.toUpperCase()}</h3>
                <p className="text-sm">
                  {selected.conducts 
                    ? "The heat traveled quickly! Metals are GOOD conductors of heat." 
                    : "The heat barely traveled. Non-metals are POOR conductors (insulators)."}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .clip-path-triangle {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}} />
    </div>
  );
}
