import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7Unit10Projects({ onExit }: LabProps) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Unit 10: Heat and Temperature Projects" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 max-w-4xl w-full">
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-blue-600" /></div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Homemade Insulated Cooler</h2>
              <p className="text-slate-500 dark:text-slate-400">Project Work Submission Guide</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Objective</h3>
            <p>Engineer and construct a homemade cooler designed to keep ice from melting for the longest possible period using thermal insulation principles.</p>
            
            <h3>Testing Criteria</h3>
            <ul>
              <li>Your cooler must be able to hold exactly 1 cup of ice cubes.</li>
              <li>You must test your cooler by placing 1 cup of ice inside it, sealing it, and leaving it at room temperature for 4 hours.</li>
              <li>After 4 hours, open the cooler and pour any melted liquid water into a measuring cup. The cooler that yields the <strong>least</strong> amount of liquid water has the best insulation!</li>
            </ul>

            <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="bg-emerald-50 p-4 rounded border border-emerald-200">
                 <h4 className="text-emerald-800 mt-0">Good Insulators</h4>
                 <ul className="text-sm">
                   <li>Styrofoam</li>
                   <li>Cotton or wool fabric</li>
                   <li>Trapped air pockets (bubble wrap)</li>
                   <li>Aluminum foil (reflects radiant heat)</li>
                 </ul>
               </div>
               <div className="bg-red-50 p-4 rounded border border-red-200">
                 <h4 className="text-red-800 mt-0">Poor Insulators</h4>
                 <ul className="text-sm">
                   <li>Metals (tin foil alone conducts heat)</li>
                   <li>Thin plastic</li>
                   <li>Glass</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
