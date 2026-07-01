import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit1Projects({ onExit }: LabProps) {
 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 1: Plant Systems Projects" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-green-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-green-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">Photosynthesis & Respiration Poster</h2>
    <p className="text-slate-500 dark:text-[#71717a]">Project Work Submission Guide</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>Objective</h3>
   <p>Create a comprehensive poster illustrating the processes of photosynthesis and respiration in plants. Show how these two processes are interconnected.</p>
   
   <h3>Requirements</h3>
   <ul>
    <li><strong>Visual Elements:</strong> Draw a plant showing the intake of Carbon Dioxide (CO₂) and water, and the release of Oxygen (O₂) during photosynthesis.</li>
    <li><strong>The Sun:</strong> Clearly show sunlight as the energy source for photosynthesis.</li>
    <li><strong>Respiration:</strong> Draw arrows showing the plant taking in Oxygen and releasing Carbon Dioxide during respiration (which happens continuously).</li>
    <li><strong>Equations:</strong> Include the simple word equations for both processes.</li>
   </ul>

   <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mt-8 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h4 className="text-amber-800 font-bold mt-0 dark:text-[#ffffff]">Instructor Notes</h4>
    <p className="text-amber-700 mb-0">Ensure students understand that photosynthesis only occurs in the presence of light, while respiration occurs day and night.</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
