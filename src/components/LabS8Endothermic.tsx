import { useState, useEffect, useRef } from 'react';
import { Snowflake, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8Endothermic({ onExit }: LabProps) {
  const [stage, setStage] = useState<'initial' | 'adding' | 'reaction'>('initial');
  const [temp, setTemp] = useState(25); // Celsius
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (stage === 'reaction' && temp > 15) {
      const timer = setTimeout(() => setTemp(t => t - 1), 200);
      return () => clearTimeout(timer);
    }
  }, [stage, temp]);

  const handleAdd = () => {
    setStage('adding');
    timeoutRef.current = setTimeout(() => setStage('reaction'), 1500);
  };

  const handleReset = () => {
    clearTimeout(timeoutRef.current);
    setStage('initial');
    setTemp(25);
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <LabHeader onExit={onExit} title="Act 6.3: Endothermic Reaction" subtitle="Vinegar + Baking Soda (Absorbs Heat)" rightContent={<button onClick={handleReset} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>} />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 max-w-2xl w-full flex flex-col items-center min-h-[500px]">
          
          <div className="flex gap-12 items-end mt-12 mb-16 relative">
            
            {/* Adding spoon */}
            <div className={`absolute -top-16 left-8 z-20 transition-all duration-1000 ${stage === 'initial' ? 'opacity-0 translate-y-[-20px]' : stage === 'adding' ? 'opacity-100 rotate-[-45deg] translate-y-10' : 'opacity-0'}`}>
              <div className="text-4xl -rotate-45">🥄</div>
              <div className="absolute top-8 left-0 w-4 h-4 bg-slate-50 dark:bg-slate-900 rounded-full shadow blur-[1px] animate-bounce" />
            </div>

            {/* Beaker */}
            <div className="relative w-40 h-48 border-4 border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-b-2xl border-t-0 flex flex-col justify-end bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm shadow-inner z-10">
              <div className="w-full h-1/2 relative overflow-hidden transition-all duration-1000" style={{backgroundColor: 'rgb(var(--slate-100))'}}>
                {stage !== 'initial' && (
                  <div className="absolute inset-0">
                    {/* Bubbles / Gas */}
                    {stage === 'reaction' && Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="absolute w-2 h-2 rounded-full opacity-60 animate-[rise_1s_infinite]" style={{ left: `${Math.random() * 90}%`, animationDelay: `${Math.random() * 1}s`, backgroundColor: 'rgb(var(--slate-100))' }} />
                    ))}
                    {/* Frost Effect on glass */}
                    {temp < 20 && (
                      <div className="absolute inset-0 bg-cyan-100/30 transition-opacity duration-1000" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Thermometer */}
            <div className="w-12 h-64 bg-slate-200 dark:bg-slate-800 rounded-full border-4 border-slate-300 dark:border-slate-700 dark:border-slate-500 p-1 flex flex-col justify-end items-center relative shadow-inner">
              <div className="absolute top-2 w-full text-center text-xs font-bold text-slate-500 dark:text-slate-400">°C</div>
              {/* Markings */}
              {[10, 20, 30].map(m => (
                <div key={m} className="absolute w-full border-b border-slate-400 dark:border-slate-500" style={{ bottom: `${(m/40)*100}%` }}>
                  <span className="absolute -left-6 text-[10px] text-slate-500 dark:text-slate-400 top-[-8px]">{m}</span>
                </div>
              ))}
              <div 
                className="w-4 bg-red-500 rounded-full transition-all duration-300 origin-bottom"
                style={{ height: `${(temp / 40) * 100}%` }}
              />
              <div className="w-8 h-8 rounded-full bg-red-500 absolute -bottom-4 shadow-sm" />
            </div>

          </div>

          <div className="text-center w-full max-w-sm">
            <div className="text-3xl font-mono font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
              {temp}°C
              {temp < 20 && <Snowflake className="w-8 h-8 text-cyan-500 animate-pulse" />}
            </div>

            {stage === 'initial' ? (
              <button 
                onClick={handleAdd}
                className="w-full bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-700 text-xl shadow-lg transition-transform active:scale-95"
              >
                Add Baking Soda
              </button>
            ) : (
              <>
                <div className="bg-cyan-50 border-2 border-cyan-200 px-6 py-4 rounded-xl text-cyan-900 animate-fade-in">
                  <h3 className="font-bold text-lg mb-1">Temperature Decreased!</h3>
                  <p className="text-sm">This is an <strong>Endothermic</strong> reaction. It absorbs heat from its surroundings, making the beaker feel cold.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rise { from { transform: translateY(100%); } to { transform: translateY(-50px); } }
      `}} />
    </div>
  );
}
