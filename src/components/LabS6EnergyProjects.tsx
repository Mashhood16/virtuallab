import { useState } from 'react';
import { Activity, Image as ImageIcon, CheckSquare } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6EnergyProjects({ onExit }: LabProps) {
  const [activeProject, setActiveProject] = useState<'windmill' | 'rollercoaster'>('windmill');
  
  // Example checklist state
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecks({ ...checks, [id]: !checks[id] });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <LabHeader onExit={onExit} title="Unit 8: Energy Projects" />

      <div className="flex-1 flex flex-col p-8 items-center overflow-y-auto">
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveProject('windmill')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${activeProject === 'windmill' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-purple-300'}`}
          >
            Project: Model Windmill
          </button>
          <button 
            onClick={() => setActiveProject('rollercoaster')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${activeProject === 'rollercoaster' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-indigo-300'}`}
          >
            Project: Roller Coaster Energy
          </button>
        </div>

        <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-8">
          
          {activeProject === 'windmill' && (
            <div className="space-y-8">
              <div className="flex gap-4 items-start bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 p-6 rounded-xl">
                <Activity className="w-8 h-8 text-purple-600 shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-purple-900 dark:text-purple-200 mb-2">Build a Working Windmill</h2>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                    Construct a model windmill using paper, pins, and sticks. Observe how wind energy (kinetic energy of air) is transformed into the mechanical (kinetic) energy of the spinning blades.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><CheckSquare /> Construction Checklist</h3>
                <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-500">
                  {['Cut a square piece of paper', 'Cut diagonally from corners towards center', 'Fold alternating corners to the center', 'Pin the center to a wooden stick', 'Blow on the windmill to test'].map((step, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 dark:border-slate-500 text-purple-600 focus:ring-purple-500" 
                        checked={checks[`wind_${i}`] || false}
                        onChange={() => toggleCheck(`wind_${i}`)}
                      />
                      <span className={`text-slate-700 dark:text-slate-200 ${checks[`wind_${i}`] ? 'line-through text-slate-400' : ''}`}>{step}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 dark:border-slate-500 pt-8">
                 <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Submission</h3>
                 <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-xl hover:bg-slate-50 dark:bg-slate-900 transition-colors cursor-pointer">
                   <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                   <span className="font-medium">Upload a video of your windmill spinning</span>
                 </div>
              </div>
            </div>
          )}

          {activeProject === 'rollercoaster' && (
            <div className="space-y-8">
              <div className="flex gap-4 items-start bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 p-6 rounded-xl">
                <Activity className="w-8 h-8 text-indigo-600 shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">Design a Roller Coaster Track</h2>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                    Use foam pipe insulation or cardboard to build a roller coaster track for a marble. Your track must have at least one hill and one loop. You must identify where Potential Energy (PE) is highest and where Kinetic Energy (KE) is highest.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><CheckSquare /> Project Requirements</h3>
                <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-500">
                  {['Track has a steep starting hill (Max PE)', 'Track includes a loop (Requires high KE)', 'Marble successfully completes the track without falling off', 'Created labels for "High PE" and "High KE"'].map((step, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500" 
                        checked={checks[`roller_${i}`] || false}
                        onChange={() => toggleCheck(`roller_${i}`)}
                      />
                      <span className={`text-slate-700 dark:text-slate-200 ${checks[`roller_${i}`] ? 'line-through text-slate-400' : ''}`}>{step}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 dark:border-slate-500 pt-8">
                 <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Submission</h3>
                 <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-xl hover:bg-slate-50 dark:bg-slate-900 transition-colors cursor-pointer">
                   <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                   <span className="font-medium">Upload a video of your marble completing the track</span>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
