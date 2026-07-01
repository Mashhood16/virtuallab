import { useState } from 'react';
import { ArrowLeft, ZoomIn, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS6Microscope({ onExit }: LabProps) {
 const [slide, setSlide] = useState<'none' | 'onion' | 'cheek'>('none');
 const [stainAdded, setStainAdded] = useState(false);
 const [coverSlipAdded, setCoverSlipAdded] = useState(false);
 const [viewMode, setViewMode] = useState<'bench' | 'microscope'>('bench');

 const handleStain = () => {
 if (slide !== 'none' && !coverSlipAdded) {
  setStainAdded(true);
 }
 };

 const handleCoverSlip = () => {
 if (slide !== 'none' && stainAdded) {
  setCoverSlipAdded(true);
 }
 };

 const handleView = () => {
 if (slide !== 'none' && stainAdded && coverSlipAdded) {
  setViewMode('microscope');
 }
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-100 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Unit 1: Microscope Slide Preparation" />

  <div className="flex-1 flex flex-col p-6 items-center">
  {viewMode === 'bench' && (
   <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center">
   <h2 className="text-2xl font-bold mb-6">Preparation Bench</h2>
   
   <div className="flex gap-4 mb-8">
    <button onClick={() => { setSlide('onion'); setStainAdded(false); setCoverSlipAdded(false); }} className={`px-6 py-3 rounded-lg border-2 font-bold ${slide === 'onion' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-blue-300'}`}>
    1. Select Onion Membrane
    </button>
    <button onClick={() => { setSlide('cheek'); setStainAdded(false); setCoverSlipAdded(false); }} className={`px-6 py-3 rounded-lg border-2 font-bold ${slide === 'cheek' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-emerald-300'}`}>
    1. Select Cheek Swab
    </button>
   </div>

   <div className="w-96 h-48 bg-slate-50 dark:bg-[#121212] border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl flex items-center justify-center relative mb-8">
    {slide === 'none' && <p className="text-slate-400 font-medium">Select a sample to place on the glass slide</p>}
    {slide !== 'none' && (
    <div className="w-64 h-24 bg-blue-50 border border-blue-200 shadow-sm relative flex items-center justify-center dark:bg-teal-950/20 dark:border-teal-900">
     <span className="text-xs text-blue-400 absolute top-1 left-2">Glass Slide</span>
     <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${stainAdded ? 'bg-blue-200/50' : 'bg-amber-100/30'}`}>
     {coverSlipAdded && <div className="absolute w-14 h-14 border border-slate-400 dark:border-[#1c1b1b]/50 bg-slate-50 dark:bg-[#121212]/20"></div>}
     </div>
    </div>
    )}
   </div>

   <div className="flex gap-4">
    <button 
    onClick={handleStain}
    disabled={slide === 'none' || coverSlipAdded}
    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    <Droplets className="w-5 h-5 mr-2" /> 2. Add Methylene Blue Stain
    </button>
    <button 
    onClick={handleCoverSlip}
    disabled={!stainAdded || coverSlipAdded}
    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    3. Place Cover Slip
    </button>
    <button 
    onClick={handleView}
    disabled={!coverSlipAdded}
    className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-emerald-700 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    <ZoomIn className="w-5 h-5 mr-2" /> 4. Observe under Microscope
    </button>
   </div>
   </div>
  )}

  {viewMode === 'microscope' && (
   <div className="w-full max-w-4xl bg-[#000000] dark:!bg-[#121212] rounded-2xl shadow-xl overflow-hidden flex flex-col items-center p-8 text-white relative">
   <button onClick={() => setViewMode('bench')} className="absolute top-4 left-4 text-slate-400 hover:text-white flex items-center">
    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Bench
   </button>
   <h2 className="text-2xl font-bold mb-6">Microscope View (400x)</h2>
   
   <div className="w-96 h-96 rounded-full bg-blue-50 overflow-hidden relative border-8 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex flex-wrap content-start dark:bg-teal-950/20 dark:border-teal-900">
    {slide === 'onion' ? (
     <div className="w-full h-full flex flex-col gap-1 p-4 rotate-12">
     {[1,2,3,4].map(row => (
      <div key={row} className="flex gap-1">
      {[1,2,3,4].map(col => (
       <div key={col} className="w-20 h-14 border border-blue-400 dark:border-teal-700 bg-blue-100 dark:bg-teal-900 flex items-center justify-center relative">
       <div className="w-2 h-2 rounded-full bg-blue-800 absolute right-2 bottom-2"></div>
       <div className="w-12 h-8 border border-blue-300 rounded bg-blue-50/50 dark:bg-teal-950/20 dark:border-teal-900"></div>
       </div>
      ))}
      </div>
     ))}
     </div>
    ) : (
    <div className="w-full h-full relative">
     {[1,2,3,4,5].map(cell => (
     <div key={cell} style={{ top: Math.random() * 250 + 50, left: Math.random() * 250 + 50 }} className="absolute w-20 h-20 rounded-full border border-blue-300 dark:border-teal-700 bg-blue-100/60 dark:bg-teal-900/60 blob-shape flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-blue-800"></div>
     </div>
     ))}
    </div>
    )}
   </div>

   <div className="mt-8 text-center max-w-xl">
    <h3 className="text-xl font-bold mb-2 text-blue-300">{slide === 'onion' ? 'Plant Cell (Onion Membrane)' : 'Animal Cell (Cheek Swab)'}</h3>
    <p className="text-slate-300 leading-relaxed">
    {slide === 'onion' 
     ? "Observe the rectangular, brick-like interlocking cells. The thick outer boundary is the Cell Wall. The large empty space is the central Vacuole, and the dark blue dot is the Nucleus stained by the methylene blue."
     : "Observe the irregular, round squamous epithelial cells. They lack a rigid cell wall and central vacuole, unlike plant cells. The dark blue dot is the Nucleus stained by the methylene blue."}
    </p>
   </div>
   
   <style dangerouslySetInnerHTML={{__html: `
    .blob-shape { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
   `}} />
   </div>
  )}
  </div>
 </div>
 );
}
