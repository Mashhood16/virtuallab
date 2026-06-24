import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7Unit4Projects({ onExit }: LabProps) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 4: Physical and Chemical Changes Projects" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl w-full">
          <div className="flex items-center mb-8">
            <div className="bg-amber-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-amber-600" /></div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Comparative Poster Assignment</h2>
              <p className="text-slate-500">Project Work Submission Guide</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3>Objective</h3>
            <p>Make a poster to visually compare physical and chemical changes in everyday life. Divide your chart paper down the middle.</p>
            
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="mt-0">Physical Changes</h4>
                <p className="text-sm text-slate-600">No new substance is formed. The change is usually reversible.</p>
                <ul>
                  <li>Melting ice</li>
                  <li>Tearing paper</li>
                  <li>Chopping wood</li>
                  <li>Boiling water</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="mt-0">Chemical Changes</h4>
                <p className="text-sm text-slate-600">A new substance with different properties is formed. Usually irreversible.</p>
                <ul>
                  <li>Burning wood</li>
                  <li>Rusting iron</li>
                  <li>Baking a cake</li>
                  <li>Digesting food</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-8">
              <h4 className="text-blue-800 font-bold mt-0">Design Requirements</h4>
              <p className="text-blue-700 mb-0">You must draw or paste pictures for at least 5 examples in each column. Ensure the definitions of both types of changes are clearly written at the top of the poster.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
