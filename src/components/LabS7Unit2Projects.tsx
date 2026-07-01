import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit2Projects({ onExit }: LabProps) {
 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 2: Human Body Systems Projects" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-red-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-red-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">Working Model & Observations</h2>
    <p className="text-slate-500 dark:text-[#71717a]">Project Work Submission Guide</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>Activity A: Observing Blood Vessels</h3>
   <p>Stand in front of a mirror and gently pull down your lower eyelid. Observe the tiny red lines. These are capillaries, the smallest blood vessels in your body, delivering oxygen directly to the tissues of your eye.</p>

   <hr className="my-8" />

   <h3>Project B: Eco-Friendly System Model</h3>
   <p>Use recycled materials to build a physical model of either the human circulatory system or respiratory system.</p>
   
   <h4>Materials Ideas</h4>
   <ul>
    <li><strong>Heart/Lungs:</strong> Old plastic bottles, balloons, or clay.</li>
    <li><strong>Veins/Arteries/Trachea:</strong> Used straws, old string, or rubber tubing.</li>
    <li><strong>Base:</strong> A discarded cardboard box or piece of wood.</li>
   </ul>

   <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-8 dark:bg-teal-950/20 dark:border-teal-900">
    <h4 className="text-blue-800 font-bold mt-0 dark:text-[#ffffff]">Submission Requirements</h4>
    <p className="text-blue-700 mb-0">Bring your physical model to class. You must be able to point to the major organs and explain their basic functions to the teacher.</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
