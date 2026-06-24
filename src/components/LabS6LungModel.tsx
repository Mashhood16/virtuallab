import { useState } from 'react';
import { Wind, Info, Image as ImageIcon } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6LungModel({ onExit }: LabProps) {
  const [inhale, setInhale] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 4: Working Model of Lungs" />

      <div className="flex-1 flex flex-col p-8 items-center overflow-y-auto">
        <div className="w-full max-w-5xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex gap-8">
          
          <div className="flex-1">
             <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl mb-8 flex gap-4">
               <Info className="w-8 h-8 shrink-0 mt-1" />
               <div>
                 <h2 className="font-bold text-lg mb-2">Build a Breathing Model</h2>
                 <p className="text-sm leading-relaxed mb-4">
                   In this project, you will build a functional model of the human respiratory system using a plastic bottle, a Y-shaped tube, and balloons. This demonstrates how the diaphragm controls breathing.
                 </p>
                 <ul className="list-disc pl-5 text-sm space-y-1 font-medium">
                   <li>Plastic Bottle = Chest Cavity</li>
                   <li>Y-Tube = Trachea & Bronchi</li>
                   <li>Small Balloons = Lungs</li>
                   <li>Rubber Sheet (Balloon) = Diaphragm</li>
                 </ul>
               </div>
             </div>

             <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4">Upload Assignment</h3>
                <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl mb-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <span className="font-medium text-slate-600">Upload a video or photo of your working model</span>
                </div>
                <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Submit Project</button>
             </div>
          </div>

          <div className="w-96 bg-slate-100 rounded-xl border border-slate-200 p-8 flex flex-col items-center">
             <h3 className="font-bold text-slate-700 mb-2 text-center">Interactive Diagram</h3>
             <p className="text-xs text-slate-500 text-center mb-8">Pull the diaphragm down to inhale.</p>

             <div className="relative w-48 h-64 mb-8">
                {/* Trachea (Y-tube main) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-slate-300 border-x-2 border-slate-400 z-10"></div>
                
                {/* Bottle */}
                <div className="absolute top-12 w-full h-48 border-4 border-slate-300/50 rounded-t-[40px] bg-blue-50/20 overflow-hidden shadow-inner">
                  
                  {/* Bronchi (Y-tube branches) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-12 border-t-4 border-l-4 border-r-4 border-slate-400 rounded-t-xl z-10"></div>

                  {/* Lungs (Balloons) */}
                  <div className={`absolute top-10 left-[20px] w-16 bg-pink-400 rounded-full transition-all duration-300 shadow-inner ${inhale ? 'h-24 scale-110' : 'h-16 scale-90'}`}></div>
                  <div className={`absolute top-10 right-[20px] w-16 bg-pink-400 rounded-full transition-all duration-300 shadow-inner ${inhale ? 'h-24 scale-110' : 'h-16 scale-90'}`}></div>

                  {/* Air entering/exiting */}
                  {inhale && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-blue-400 animate-bounce z-20">
                      <Wind className="w-8 h-8 rotate-90" />
                    </div>
                  )}

                  {/* Diaphragm (Rubber sheet) */}
                  <div 
                    className={`absolute bottom-0 w-full bg-red-500 transition-all duration-300 cursor-pointer hover:bg-red-600 flex items-center justify-center ${inhale ? 'h-8 rounded-t-none' : 'h-16 rounded-t-[100%]'}`}
                    onMouseDown={() => setInhale(true)}
                    onMouseUp={() => setInhale(false)}
                    onMouseLeave={() => setInhale(false)}
                    onTouchStart={() => setInhale(true)}
                    onTouchEnd={() => setInhale(false)}
                  >
                    <span className="text-white text-xs font-bold pointer-events-none mt-2">Pull Me</span>
                  </div>
                </div>
             </div>

             <div className="text-center bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200 w-full">
               <span className="block font-bold text-slate-800 text-lg mb-1">{inhale ? 'Inhalation' : 'Exhalation'}</span>
               <span className="text-sm text-slate-600">
                 {inhale 
                   ? "Diaphragm contracts (moves down). Volume increases, pressure drops. Air rushes IN." 
                   : "Diaphragm relaxes (moves up). Volume decreases, pressure rises. Air pushed OUT."}
               </span>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
