import { useState } from 'react';
import { CheckCircle, Info, Upload, X } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6Unit1Projects({ onExit }: LabProps) {
  const [tab, setTab] = useState<'cell' | 'organ'>('cell');
  const [cellType, setCellType] = useState<'animal' | 'plant' | null>(null);
  const [organSystem, setOrganSystem] = useState<string>('');
  const [cellPhoto, setCellPhoto] = useState<string | null>(null);
  const [organPhoto, setOrganPhoto] = useState<string | null>(null);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setPhoto: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <LabHeader onExit={onExit} title="Unit 1: Cellular Organization Projects" />

      <div className="flex-1 flex flex-col p-8 items-center overflow-y-auto">
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setTab('cell')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'cell' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-indigo-300'}`}
          >
            Activity 1.3: Cell Model
          </button>
          <button 
            onClick={() => setTab('organ')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'organ' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-teal-300'}`}
          >
            Project Work: Organ System Model
          </button>
        </div>

        {tab === 'cell' && (
          <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-8">
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
                 <span className="font-bold text-lg text-slate-700 dark:text-slate-200">Animal Cell</span>
               </button>

               <button onClick={() => setCellType('plant')} className={`p-6 rounded-xl border-4 flex flex-col items-center gap-4 transition-all ${cellType === 'plant' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}>
                 <div className="w-32 h-32 bg-green-100 border-8 border-green-600 rounded-sm relative flex items-center justify-center">
                    <div className="absolute top-2 w-24 h-16 bg-blue-200 rounded-full opacity-60"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-purple-600"></div>
                 </div>
                 <span className="font-bold text-lg text-slate-700 dark:text-slate-200">Plant Cell</span>
               </button>
            </div>

            {cellType && (
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-xl">
                 <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Required Labels for your Physical Model:</h4>
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
                 <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 dark:border-slate-500">
                    <input id="cell-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setCellPhoto)} />
                    {cellPhoto ? (
                      <div className="relative">
                        <img src={cellPhoto} alt="Uploaded model" className="w-full max-h-64 object-contain rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500" />
                        <button onClick={() => setCellPhoto(null)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-4 h-4" /></button>
                        <p className="text-sm text-emerald-600 font-medium mt-2 text-center">Photo uploaded successfully!</p>
                      </div>
                    ) : (
                      <label htmlFor="cell-upload" className="block w-full p-6 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <span className="font-medium">Click to upload a photo of your model</span>
                      </label>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}

        {tab === 'organ' && (
          <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-8">
            <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-xl mb-8 flex gap-4">
              <Info className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold">Project Work Instructions</h3>
                <p className="text-sm">Make a model of a human organ system of your choice by using recycled materials and label its parts.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-2">Select Organ System for your Project:</label>
              <select 
                className="w-full p-4 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-xl bg-slate-50 dark:bg-slate-900 font-medium"
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
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-xl mt-8">
                 <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Suggested Recycled Materials:</h4>
                 <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                   <li>Empty plastic bottles (for stomach, lungs)</li>
                   <li>Cardboard tubes from paper towels (for esophagus, trachea)</li>
                   <li>Rubber tubing or old hoses (for intestines, blood vessels)</li>
                   <li>Balloons (for lung expansion simulation)</li>
                   <li>Colored yarn (for nerves)</li>
                 </ul>
                 
                 <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 dark:border-slate-500">
                    <input id="organ-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setOrganPhoto)} />
                    {organPhoto ? (
                      <div className="relative">
                        <img src={organPhoto} alt="Uploaded model" className="w-full max-h-64 object-contain rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500" />
                        <button onClick={() => setOrganPhoto(null)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-4 h-4" /></button>
                        <p className="text-sm text-emerald-600 font-medium mt-2 text-center">Photo uploaded successfully!</p>
                      </div>
                    ) : (
                      <label htmlFor="organ-upload" className="block w-full p-6 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <span className="font-medium">Click to upload a photo of your model</span>
                      </label>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
