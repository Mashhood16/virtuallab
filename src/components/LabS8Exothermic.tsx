import { useState, useEffect, useRef } from 'react';
import { Flame, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8Exothermic({ onExit }: LabProps) {
 const [stage, setStage] = useState<'initial' | 'adding' | 'reaction'>('initial');
 const [temp, setTemp] = useState(20); // Celsius
 const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

 useEffect(() => {
 if (stage === 'reaction' && temp < 45) {
  const timer = setTimeout(() => setTemp(t => t + 1), 100);
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
 setTemp(20);
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Act 6.4: Exothermic Reaction" subtitle="Water + Calcium Chloride (Releases Heat)" rightContent={<button onClick={handleReset} className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>} />

  <div className="flex-1 flex flex-col items-center justify-center p-6">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] max-w-2xl w-full flex flex-col items-center min-h-[500px]">
   
   <div className="flex gap-12 items-end mt-12 mb-16 relative">
   
   {/* Adding spoon */}
   <div className={`absolute -top-16 left-8 z-20 transition-all duration-1000 ${stage === 'initial' ? 'opacity-0 translate-y-[-20px]' : stage === 'adding' ? 'opacity-100 rotate-[-45deg] translate-y-10' : 'opacity-0'}`}>
    <div className="text-4xl -rotate-45">🥄</div>
    <div className="absolute top-8 left-0 w-4 h-4 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-sm shadow blur-[1px] animate-pulse" />
   </div>

   {/* Beaker */}
   <div className="relative w-40 h-48 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-2xl border-t-0 flex flex-col justify-end bg-slate-50 dark:bg-[#121212]/50 backdrop-blur-sm shadow-inner z-10">
    <div className="w-full h-1/2 bg-blue-50/80 relative overflow-hidden transition-all duration-1000 dark:bg-teal-950/20 dark:border-teal-900">
    {stage === 'reaction' && (
     <div className="absolute inset-0">
     {/* Dissolving effect */}
     <div className="absolute inset-0 bg-slate-50 dark:bg-[#121212]/20 animate-pulse" />
     {/* Heat Radiating Effect */}
     {temp > 30 && (
      <div className="absolute inset-0 bg-orange-500/10 transition-colors duration-1000" />
     )}
     </div>
    )}
    </div>
    {/* Heat waves escaping top */}
    {temp > 35 && (
    <div className="absolute -top-10 left-0 w-full h-10 flex justify-around opacity-50">
     {['0s','0.5s','1s'].map((d,i) => <div key={i} className="w-1 h-full bg-orange-400 blur-sm animate-[rise_1s_infinite]" style={{animationDelay:d}} />)}
    </div>
    )}
   </div>

   {/* Thermometer */}
   <div className="w-12 h-64 bg-slate-200 dark:bg-[#121212] rounded-full border-4 border-slate-300 dark:border-[#1c1b1b] p-1 flex flex-col justify-end items-center relative shadow-inner">
    <div className="absolute top-2 w-full text-center text-xs font-bold text-slate-500 dark:text-[#71717a]">°C</div>
    {/* Markings */}
    {[10, 20, 30, 40, 50].map(m => (
    <div key={m} className="absolute w-full border-b border-slate-400 dark:border-[#1c1b1b]" style={{ bottom: `${(m/60)*100}%` }}>
     <span className="absolute -left-6 text-[10px] text-slate-500 dark:text-[#71717a] top-[-8px]">{m}</span>
    </div>
    ))}
    <div 
    className="w-4 bg-red-500 rounded-full transition-all duration-300 origin-bottom"
    style={{ height: `${(temp / 60) * 100}%` }}
    />
    <div className="w-8 h-8 rounded-full bg-red-500 absolute -bottom-4 shadow-sm" />
   </div>

   </div>

   <div className="text-center w-full max-w-sm">
   <div className="text-3xl font-mono font-bold mb-6 text-slate-800 dark:text-[#ffffff] flex items-center justify-center gap-2">
    {temp}°C
    {temp > 35 && <Flame className="w-8 h-8 text-orange-500 animate-pulse" />}
   </div>

   {stage === 'initial' ? (
    <button 
    onClick={handleAdd}
    className="w-full bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 text-xl shadow-lg transition-transform active:scale-95 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
    >
    Add Calcium Chloride
    </button>
   ) : (
    <>
    <div className="bg-orange-50 border-2 border-orange-200 px-6 py-4 rounded-xl text-orange-900 animate-fade-in">
     <h3 className="font-bold text-lg mb-1">Temperature Increased!</h3>
     <p className="text-sm">This is an <strong>Exothermic</strong> reaction. It releases energy as heat into its surroundings.</p>
    </div>
    </>
   )}
   </div>
  </div>
  </div>
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes rise { from { transform: translateY(100%); opacity: 1; } to { transform: translateY(-50px); opacity: 0; } }
  `}} />
 </div>
 );
}
