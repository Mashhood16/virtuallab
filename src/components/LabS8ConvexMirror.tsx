import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8ConvexMirror({ onExit }: LabProps) {
  const [mirrorType, setMirrorType] = useState<'plane' | 'convex'>('convex');

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 9.6: Car Rearview Mirror" subtitle="Convex vs Plane Mirrors" />

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
        
        {/* Selection */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <h3 className="font-bold text-slate-700 mb-2">Select Mirror</h3>
          <button 
            onClick={() => setMirrorType('plane')}
            className={`p-4 text-left rounded-xl font-bold border-2 ${mirrorType === 'plane' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-50'}`}
          >
            Inside Mirror
            <div className="text-xs font-normal opacity-70 mt-1">Flat (Plane Mirror)</div>
          </button>
          <button 
            onClick={() => setMirrorType('convex')}
            className={`p-4 text-left rounded-xl font-bold border-2 ${mirrorType === 'convex' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-50'}`}
          >
            Side Passenger Mirror
            <div className="text-xs font-normal opacity-70 mt-1">Curved Outward (Convex)</div>
          </button>

          <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-sm text-slate-800 mb-2">Observations</h4>
             <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                {mirrorType === 'plane' ? (
                  <>
                    <li>Image is true to size</li>
                    <li>Narrow field of view</li>
                    <li>Blind spots are large</li>
                  </>
                ) : (
                  <>
                    <li className="text-emerald-600 font-bold">Image is smaller (Diminished)</li>
                    <li className="text-emerald-600 font-bold">Wide field of view</li>
                    <li>"Objects in mirror are closer than they appear"</li>
                  </>
                )}
             </ul>
          </div>
        </div>

        <div className="flex-1 bg-slate-800 rounded-3xl shadow-2xl border-4 border-slate-900 p-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]">
          
          <h2 className="absolute top-4 text-slate-400 font-bold tracking-widest uppercase">Mirror View</h2>

          {/* The Mirror Frame */}
          <div className={`bg-slate-300 border-4 border-slate-950 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${mirrorType === 'plane' ? 'w-[400px] h-[150px] rounded-lg' : 'w-[250px] h-[180px] rounded-[40px] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]'}`}>
             
             {/* The Reflection Content */}
             <div className={`absolute flex items-center justify-center transition-all duration-500 ${mirrorType === 'plane' ? 'scale-100' : 'scale-[0.6] w-[200%]'}`}>
                
                {/* Background Road */}
                <div className="absolute w-[800px] h-64 bg-slate-600 flex flex-col">
                   <div className="h-1/2 bg-sky-300" />
                   <div className="h-1/2 bg-slate-600 relative flex items-center">
                     <div className="w-full border-b-4 border-dashed border-white" />
                   </div>
                </div>

                {/* Cars in the reflection */}
                <div className="z-10 flex gap-8 items-end relative top-4">
                   <div className="text-[100px] transform -scale-x-100">🚗</div>
                   <div className="text-[100px] transform -scale-x-100 mt-10">🚙</div>
                   <div className="text-[100px] transform -scale-x-100">🚕</div>
                </div>

             </div>

             {/* Convex Curve Shine Effect */}
             {mirrorType === 'convex' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[40px] pointer-events-none" />
             )}
             
             {/* Disclaimer Text */}
             {mirrorType === 'convex' && (
                <div className="absolute bottom-2 right-4 text-[8px] uppercase tracking-tighter font-bold text-slate-800/60">
                   Objects in mirror are closer<br/>than they appear
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
