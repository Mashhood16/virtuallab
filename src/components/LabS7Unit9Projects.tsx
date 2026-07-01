import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit9Projects({ onExit }: LabProps) {
 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 9: Waves and Energy Projects" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-indigo-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-indigo-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">Rubber Band Instrument</h2>
    <p className="text-slate-500 dark:text-[#71717a]">Project Work Submission Guide</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>Objective</h3>
   <p>Design and build a simple stringed instrument capable of playing at least 4 distinct musical notes ranging from a low pitch to a high pitch.</p>
   
   <h3>Instructions</h3>
   <ol>
    <li>Take a sturdy piece of thick card stock, a wooden board, or a sturdy empty tissue box.</li>
    <li>Place small nails or push-pins at varying distances apart. <em>(Ask an adult for help if using a hammer and nails).</em></li>
    <li>Stretch different sizes and thicknesses of rubber bands between the pins.</li>
    <li>Pluck each band and adjust the tension or length (by moving the pins) until you have a clear low, medium, high, and very high pitched note.</li>
   </ol>

   <div className="bg-slate-100 dark:bg-[#121212] p-6 rounded-xl border border-slate-300 dark:border-[#1c1b1b] mt-8">
    <h4 className="text-slate-800 dark:text-[#ffffff] font-bold mt-0">Scientific Principles</h4>
    <p className="text-slate-700 dark:text-[#ffffff] mb-0">Be prepared to explain to your teacher how the <strong>thickness</strong> and <strong>length</strong> of the rubber bands affect the frequency of vibration and the resulting pitch.</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
