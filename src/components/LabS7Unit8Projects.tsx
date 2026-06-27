import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7Unit8Projects({ onExit }: LabProps) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Unit 8: Force and Motion Projects" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 max-w-4xl w-full">
          <div className="flex items-center mb-8">
            <div className="bg-cyan-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-cyan-600" /></div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Water Rocket Assembly</h2>
              <p className="text-slate-500 dark:text-slate-400">Project Work Submission Guide</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Objective</h3>
            <p>Make a working model of a water rocket to represent pair forces (action and reaction) in action. Research safe building methods using online resources (like YouTube educational videos).</p>
            
            <h3>Materials Needed</h3>
            <ul>
              <li>2-Liter plastic soda bottle (empty and clean)</li>
              <li>Cardboard for fins and a nose cone</li>
              <li>Duct tape</li>
              <li>Cork (that tightly fits the bottle opening)</li>
              <li>Bicycle pump with a needle adapter</li>
              <li>Water</li>
            </ul>

            <div className="bg-red-50 p-6 rounded-xl border border-red-200 mt-8">
              <h4 className="text-red-800 font-bold mt-0 flex items-center">⚠️ Safety Warning</h4>
              <p className="text-red-700 mb-0"><strong>NEVER</strong> launch a water rocket indoors or towards people/animals. Only conduct launches in an open field under adult supervision. The pressurized bottle can release with extreme force.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
