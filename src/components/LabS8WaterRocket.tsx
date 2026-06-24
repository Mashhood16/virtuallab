import { useState, useEffect } from 'react';
import {Rocket } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8WaterRocket({ onExit }: LabProps) {
  const [pressure, setPressure] = useState(0); // 0 to 100
  const [launched, setLaunched] = useState(false);
  const [height, setHeight] = useState(0);

  const pump = () => {
    if (launched) return;
    setPressure(p => {
      const next = p + 20;
      if (next >= 100) {
        launch();
        return 100;
      }
      return next;
    });
  };

  const launch = () => {
    setLaunched(true);
  };

  useEffect(() => {
    if (launched && height < 500) {
      const timer = setTimeout(() => setHeight(h => h + 15), 30);
      return () => clearTimeout(timer);
    }
  }, [launched, height]);

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 8.3: Water Pressure Rocket" subtitle="Pump air to build pressure and launch" />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-3xl mx-auto w-full">
        
        <div className="flex-1 bg-sky-100 rounded-2xl shadow-sm border border-sky-200 p-6 flex flex-col items-center justify-end relative overflow-hidden min-h-[600px]">
          
          {/* Clouds */}
          <div className="absolute top-20 left-10 w-32 h-12 bg-slate-50/80 rounded-full blur-sm" />
          <div className="absolute top-40 right-20 w-48 h-16 bg-slate-50/80 rounded-full blur-sm" />

          {/* The Rocket */}
          <div 
            className="absolute z-20 flex flex-col items-center transition-transform"
            style={{ bottom: `${40 + height}px` }}
          >
            {/* Cone */}
            <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-500" />
            {/* Bottle Body */}
            <div className="w-12 h-32 bg-slate-50/80 backdrop-blur-sm border-2 border-slate-300 rounded-sm relative overflow-hidden flex flex-col justify-end">
               {/* Water inside */}
               <div className="w-full bg-blue-500/80 transition-all" style={{ height: launched ? '0%' : '30%' }} />
               {/* Pressure indicator red tint */}
               <div className="absolute inset-0 bg-red-500 transition-opacity" style={{ opacity: pressure / 200 }} />
            </div>
            {/* Fins */}
            <div className="absolute bottom-0 w-24 h-12 flex justify-between">
              <div className="w-4 h-full bg-red-500 clip-triangle-left" />
              <div className="w-4 h-full bg-red-500 clip-triangle-right" />
            </div>
            {/* Water Spraying out */}
            {launched && height < 300 && (
              <div className="w-8 h-32 bg-gradient-to-b from-blue-300 to-transparent blur-sm rounded-b-full animate-pulse" />
            )}
          </div>

          {/* Launch Pad / Ground */}
          <div className="w-[150%] h-10 bg-emerald-600 rounded-t-[100%] absolute bottom-0 z-30 border-t-4 border-emerald-500 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]" />

          {/* Pump Mechanism */}
          <div className="absolute bottom-6 right-12 z-40 flex flex-col items-center">
             <div className="w-16 h-8 bg-slate-800 rounded-t-lg" />
             <div className="w-2 h-16 bg-slate-300" />
             <div className="w-12 h-4 bg-slate-700 rounded-full" />
             {/* Tube to rocket */}
             {!launched && <div className="absolute bottom-2 -left-32 w-32 h-2 bg-slate-800 border border-slate-900 rounded-full transform -rotate-6" />}
          </div>

          {/* UI Controls */}
          <div className="absolute top-6 left-6 z-40 bg-slate-50/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200 w-64 text-center">
            <div className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Air Pressure</div>
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-4 border border-slate-300">
               <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${pressure}%` }} />
            </div>
            
            <button 
              onClick={pump}
              disabled={launched}
              className="w-full bg-emerald-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-emerald-600 text-xl shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Rocket className="w-6 h-6" /> PUMP AIR
            </button>
          </div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .clip-triangle-left { clip-path: polygon(100% 0, 100% 100%, 0 100%); }
        .clip-triangle-right { clip-path: polygon(0 0, 0 100%, 100% 100%); }
      `}} />
    </div>
  );
}
