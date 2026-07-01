import { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Lightbulb, Users, Target } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabC6PitchPresentation({ onExit }: LabProps) {
 const [slide, setSlide] = useState(0);
 const [inputs, setInputs] = useState({
 problem: '',
 solution: '',
 audience: ''
 });

 const slides = [
 {
  title: "The Problem",
  icon: AlertTriangle,
  content: (
  <div className="flex flex-col gap-4">
   <p className="text-lg text-slate-600 dark:text-[#a1a1aa]">What specific agricultural problem are farmers in Pakistan facing today?</p>
   <textarea 
   value={inputs.problem}
   onChange={e => setInputs({...inputs, problem: e.target.value})}
   placeholder="e.g., Lack of weather data leading to crop damage, poor market access..."
   className="w-full h-32 p-4 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-lg resize-none focus:ring-2 focus:ring-emerald-500"
   />
  </div>
  )
 },
 {
  title: "Our IT Solution",
  icon: Lightbulb,
  content: (
  <div className="flex flex-col gap-4">
   <p className="text-lg text-slate-600 dark:text-[#a1a1aa]">How will your technology (app, website, IoT) solve this problem?</p>
   <textarea 
   value={inputs.solution}
   onChange={e => setInputs({...inputs, solution: e.target.value})}
   placeholder="e.g., A mobile app that sends SMS alerts about weather and crop prices..."
   className="w-full h-32 p-4 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-lg resize-none focus:ring-2 focus:ring-emerald-500"
   />
  </div>
  )
 },
 {
  title: "Target Audience",
  icon: Users,
  content: (
  <div className="flex flex-col gap-4">
   <p className="text-lg text-slate-600 dark:text-[#a1a1aa]">Who exactly will use this product and how will they benefit?</p>
   <textarea 
   value={inputs.audience}
   onChange={e => setInputs({...inputs, audience: e.target.value})}
   placeholder="e.g., Small-scale farmers in Punjab. They will benefit by increasing yields..."
   className="w-full h-32 p-4 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-lg resize-none focus:ring-2 focus:ring-emerald-500"
   />
  </div>
  )
 },
 {
  title: "Pitch Ready!",
  icon: Target,
  content: (
  <div className="flex flex-col items-center text-center gap-6">
   <CheckCircle className="w-24 h-24 text-emerald-500" />
   <p className="text-xl text-slate-700 dark:text-[#ffffff] max-w-lg">
   Your presentation is complete. You are ready to pitch your agricultural IT startup to the investors!
   </p>
  </div>
  )
 }
 ];

 function AlertTriangle(props: any) {
 return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
 }

 const SlideIcon = slides[slide].icon;

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Tech Startup Pitch" />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">
  

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">Prepare a presentation to pitch a new IT solution addressing a problem in the agriculture sector.</p>

  <div className="flex-1 flex flex-col items-center justify-center">
   
   {/* Presentation Viewer */}
   <div className="w-full max-w-4xl aspect-video bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden relative">
   
   {/* Header / Theme */}
   <div className="h-4 bg-emerald-600 w-full"></div>
   
   <div className="flex-1 p-12 flex flex-col">
    <div className="flex items-center gap-4 mb-8">
    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
     <SlideIcon className="w-8 h-8" />
    </div>
    <h2 className="text-4xl font-bold text-slate-800 dark:text-[#ffffff]">{slides[slide].title}</h2>
    </div>
    
    <div className="flex-1">
    {slides[slide].content}
    </div>
   </div>

   {/* Slide Navigation inside presentation */}
   <div className="bg-slate-50 dark:bg-[#121212] border-t border-slate-200 dark:border-[#1c1b1b] p-4 flex justify-between items-center px-12">
    <button 
    onClick={() => setSlide(s => Math.max(0, s - 1))}
    disabled={slide === 0}
    className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 disabled:opacity-30 font-bold transition-colors"
    >
    <ChevronLeft className="w-5 h-5" /> Previous
    </button>
    <div className="text-sm font-bold text-slate-400">
    Slide {slide + 1} of {slides.length}
    </div>
    <button 
    onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))}
    disabled={slide === slides.length - 1}
    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-30 font-bold transition-colors shadow-sm dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    Next <ChevronRight className="w-5 h-5" />
    </button>
   </div>
   </div>

  </div>
  </div>
 </div>
 );
}
