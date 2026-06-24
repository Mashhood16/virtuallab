import { useState } from 'react';
import { Image as ImageIcon, CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6Unit1Projects({ onExit }: LabProps) {
  const [tab, setTab] = useState<'cell' | 'organ'>('cell');
  const [cellType, setCellType] = useState<'animal' | 'plant' | null>(null);
  const [organSystem, setOrganSystem] = useState<string>('');

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 1: Cellular Organization Projects" />

      <div className="flex-1 flex flex-col p-8 items-center overflow-y-auto">
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setTab('cell')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'cell' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}
          >
            Activity 1.3: Cell Model
          </button>
          <button 
            onClick={() => setTab('organ')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'organ' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-300'}`}
          >
            Project Work: Organ System Model
          </button>
        </div>

        {tab === 'cell' && (
          <div className="w-full max-w-4xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-xl mb-8 flex gap-4">
              <Info className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold">Group Work Instructions</h3>
                <p className="text-sm">Make a physical model of an animal or plant cell using materials of your choice (e.g., clay, cardboard, styrofoam) and label its parts.</p>
              </div>
            </div>

            <div className="flex gap-8 justify-center mb-8">
               <button onClick={() => setCellType('animal')} className={`p-6 rounded-xl border-4 flex flex-col items-center gap-4 transition-all ${cellType === 'animal' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}>
                 <div className="w-32 h-32 bg-pink-200 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-4 border-pink-400 relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-purple-600"></div>
                 </div>
                 <span className="font-bold text-lg text-slate-700">Animal Cell</span>
               </button>

               <button onClick={() => setCellType('plant')} className={`p-6 rounded-xl border-4 flex flex-col items-center gap-4 transition-all ${cellType === 'plant' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}>
                 <div className="w-32 h-32 bg-green-100 border-8 border-green-600 rounded-sm relative flex items-center justify-center">
                    <div className="absolute top-2 w-24 h-16 bg-blue-200 rounded-full opacity-60"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-purple-600"></div>
                 </div>
                 <span className="font-bold text-lg text-slate-700">Plant Cell</span>
               </button>
            </div>

            {cellType && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                 <h4 className="font-bold text-slate-800 mb-4">Required Labels for your Physical Model:</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> Cell Membrane</div>
                   <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> Nucleus</div>
                   <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> Cytoplasm</div>
                   <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> Mitochondria</div>
                   {cellType === 'plant' && (
                     <>
                       <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Cell Wall</div>
                       <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Chloroplasts</div>
                       <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Large Central Vacuole</div>
                     </>
                   )}
                 </div>
                 <div className="mt-8 pt-4 border-t border-slate-200 text-center text-slate-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    Upload a photo of your completed physical model to submit this assignment.
                 </div>
              </div>
            )}
          </div>
        )}

        {tab === 'organ' && (
          <div className="w-full max-w-4xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-xl mb-8 flex gap-4">
              <Info className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold">Project Work Instructions</h3>
                <p className="text-sm">Make a model of a human organ system of your choice by using recycled materials and label its parts.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-bold text-slate-700 mb-2">Select Organ System for your Project:</label>
              <select 
                className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                value={organSystem}
                onChange={e => setOrganSystem(e.target.value)}
              >
                <option value="">-- Choose a System --</option>
                <option value="digestive">Digestive System</option>
                <option value="respiratory">Respiratory System</option>
                <option value="circulatory">Circulatory System</option>
                <option value="nervous">Nervous System</option>
              </select>
            </div>

            {organSystem && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl mt-8">
                 <h4 className="font-bold text-slate-800 mb-4">Suggested Recycled Materials:</h4>
                 <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
                   <li>Empty plastic bottles (for stomach, lungs)</li>
                   <li>Cardboard tubes from paper towels (for esophagus, trachea)</li>
                   <li>Rubber tubing or old hoses (for intestines, blood vessels)</li>
                   <li>Balloons (for lung expansion simulation)</li>
                   <li>Colored yarn (for nerves)</li>
                 </ul>
                 
                 <div className="mt-8 pt-4 border-t border-slate-200 text-center text-slate-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    Assemble your model in the classroom and upload a photo here for assessment.
                 </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
