import { useState } from 'react';
import { Lightbulb, Battery, Zap } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6CircuitBuilder({ onExit }: LabProps) {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [batteries, setBatteries] = useState(1);
  const [bulbs, setBulbs] = useState(2);
  const [switchClosed, setSwitchClosed] = useState(false);

  // Simplified physics model for bulb brightness
  // Brightness = Voltage / Resistance. In series, resistance adds up. In parallel, resistance drops.
  const getBrightness = () => {
    if (!switchClosed) return 0;
    const voltage = batteries * 1.5;
    if (circuitType === 'series') {
      return voltage / bulbs;
    } else {
      // In ideal parallel, each branch gets full voltage.
      return voltage; 
    }
  };

  const brightness = getBrightness();

  return (
    <div className="overflow-y-auto flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
      <LabHeader onExit={onExit} title="Unit 9: Electricity - Circuit Builder" />

      <div className="flex-1 flex p-6 gap-6">
        
        {/* Controls */}
        <div className="w-80 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-6 text-yellow-500 dark:text-yellow-400 flex items-center gap-2"><Zap /> Circuit Properties</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Circuit Type</label>
              <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1 border border-slate-300 dark:border-slate-700">
                <button 
                  onClick={() => { setCircuitType('series'); setSwitchClosed(false); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-md ${circuitType === 'series' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >Series</button>
                <button 
                  onClick={() => { setCircuitType('parallel'); setSwitchClosed(false); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-md ${circuitType === 'parallel' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >Parallel</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Number of Batteries (Voltage)</label>
              <input 
                type="range" min="1" max="4" value={batteries} 
                onChange={e => setBatteries(parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <div className="text-right text-yellow-500 font-bold">{batteries} Cells ({batteries * 1.5}V)</div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Number of Bulbs (Resistance)</label>
              <input 
                type="range" min="1" max="3" value={bulbs} 
                onChange={e => setBulbs(parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <div className="text-right text-yellow-500 font-bold">{bulbs} Bulbs</div>
            </div>

            <div className="pt-6 border-t border-slate-700 dark:border-slate-500">
              <button 
                onClick={() => setSwitchClosed(!switchClosed)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${switchClosed ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
              >
                {switchClosed ? 'Open Switch (Turn OFF)' : 'Close Switch (Turn ON)'}
              </button>
            </div>
          </div>

          <div className="mt-auto p-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-900">
            <strong>Observations:</strong>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              {circuitType === 'series' ? (
                <li>Adding bulbs decreases overall brightness (resistance increases).</li>
              ) : (
                <li>Adding branches does not decrease brightness (each gets full voltage).</li>
              )}
              <li>Adding batteries increases overall brightness.</li>
            </ul>
          </div>
        </div>

        {/* Interactive Canvas */}
        <div className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 p-8 flex items-center justify-center relative overflow-hidden bg-slate-900 dark:bg-slate-950">
          
          <div className="relative w-full max-w-2xl h-96 flex flex-col items-center justify-between p-12">
            
            {/* SVG Wiring Background */}
            <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
              {circuitType === 'series' ? (
                <rect x="20%" y="20%" width="60%" height="60%" fill="none" stroke={switchClosed ? "#facc15" : "#475569"} strokeWidth="4" rx="10" />
              ) : (
                <>
                  <rect x="20%" y="20%" width="60%" height="60%" fill="none" stroke={switchClosed ? "#facc15" : "#475569"} strokeWidth="4" rx="10" />
                  {bulbs >= 2 && <line x1="40%" y1="20%" x2="40%" y2="80%" stroke={switchClosed ? "#facc15" : "#475569"} strokeWidth="4" />}
                  {bulbs >= 3 && <line x1="60%" y1="20%" x2="60%" y2="80%" stroke={switchClosed ? "#facc15" : "#475569"} strokeWidth="4" />}
                </>
              )}
            </svg>

            {/* Top Wire Component - Bulbs */}
            <div className={`relative z-10 w-3/5 flex ${circuitType === 'series' ? 'justify-evenly' : 'justify-between'} -mt-8`}>
              {[...Array(bulbs)].map((_, i) => (
                <div key={i} className={`flex flex-col items-center bg-slate-950 p-2 ${circuitType === 'parallel' && i > 0 ? (i === 1 ? 'absolute left-1/3 -translate-x-1/2' : 'absolute left-2/3 -translate-x-1/2') : ''}`}>
                  <div className="relative">
                    <Lightbulb 
                      className="w-12 h-12 transition-colors duration-300 relative z-10" 
                      color={switchClosed ? (brightness > 1.2 ? '#fef08a' : brightness > 0.6 ? '#facc15' : '#ca8a04') : '#475569'} 
                      fill={switchClosed ? (brightness > 1.2 ? '#fef08a' : brightness > 0.6 ? '#facc15' : '#ca8a04') : 'none'}
                    />
                    {switchClosed && brightness > 0 && (
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 blur-xl transition-all duration-300"
                        style={{ width: `${Math.min(brightness * 60, 150)}px`, height: `${Math.min(brightness * 60, 150)}px`, opacity: Math.min(brightness * 0.5, 1) }}
                      ></div>
                    )}
                  </div>
                  <div className="w-6 h-4 bg-slate-600 dark:bg-slate-800 mt-1 rounded"></div>
                </div>
              ))}
            </div>

            {/* Bottom Wire Component - Battery & Switch */}
            <div className="relative z-10 w-3/5 flex justify-between items-center -mb-8">
               <div className="flex items-center gap-1 bg-slate-950 px-4">
                 {[...Array(batteries)].map((_, i) => (
                   <Battery key={i} className="w-8 h-8 text-emerald-500 rotate-90" fill="#10b981" />
                 ))}
               </div>

               {/* Switch */}
               <div className="bg-slate-950 px-2 flex items-center justify-center w-24">
                 <div className="w-4 h-4 rounded-full bg-slate-600 dark:bg-slate-800"></div>
                 <div className={`w-16 h-2 bg-slate-400 dark:bg-slate-800 origin-left transition-transform duration-300 ${switchClosed ? 'rotate-0' : '-rotate-30'}`}></div>
                 <div className="w-4 h-4 rounded-full bg-slate-600 dark:bg-slate-800"></div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
