import { useState } from 'react';
import { Zap, FileQuestion, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6ConductorsInsulators({ onExit }: LabProps) {
  const [tested, setTested] = useState<Record<string, 'Conductor' | 'Insulator'>>({});

  const materials = [
    { id: 'nail', name: 'Iron Nail', type: 'Conductor' },
    { id: 'eraser', name: 'Rubber Eraser', type: 'Insulator' },
    { id: 'coin', name: 'Copper Coin', type: 'Conductor' },
    { id: 'wood', name: 'Wooden Spoon', type: 'Insulator' },
    { id: 'plastic', name: 'Plastic Ruler', type: 'Insulator' },
    { id: 'clip', name: 'Steel Paperclip', type: 'Conductor' },
  ];

  const handleClassify = (id: string, classification: 'Conductor' | 'Insulator') => {
    setTested({ ...tested, [id]: classification });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <LabHeader onExit={onExit} variant="dark" title="Unit 9: Conductors & Insulators" />

      <div className="flex-1 flex flex-col p-8 items-center overflow-y-auto">
        <div className="w-full max-w-4xl bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-8">
          
          <div className="bg-slate-900 border border-slate-700 text-slate-300 p-6 rounded-xl mb-8 flex gap-4">
            <Zap className="w-8 h-8 text-yellow-500 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Virtual Testing Lab</h2>
              <p className="text-sm leading-relaxed">
                Connect each material to our virtual circuit. If the bulb lights up, the material allows electricity to pass through and is a <strong>Conductor</strong>. If the bulb stays dark, it blocks electricity and is an <strong>Insulator</strong>. Classify all the materials to complete the activity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {materials.map(mat => (
              <div key={mat.id} className="bg-slate-700 rounded-xl border border-slate-600 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-100">{mat.name}</h3>
                  {tested[mat.id] && (
                    <span className={`text-sm font-bold flex items-center gap-1 ${tested[mat.id] === mat.type ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tested[mat.id] === mat.type ? <CheckCircle className="w-4 h-4" /> : <FileQuestion className="w-4 h-4" />}
                      {tested[mat.id] === mat.type ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </div>

                {/* Circuit Tester Mini-visual */}
                <div className="h-24 bg-slate-900 rounded-lg border border-slate-800 mb-6 flex items-center justify-center relative overflow-hidden">
                  {/* Wires */}
                  <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-slate-500"></div>
                  <div className="absolute top-1/2 right-0 w-1/3 h-1 bg-slate-500"></div>
                  
                  {/* The Material in middle */}
                  <div className="px-4 py-2 bg-slate-600 border border-slate-500 rounded text-xs font-bold text-slate-300 z-10 relative">
                    {mat.name}
                  </div>

                  {/* Bulb */}
                  <div className="absolute top-2 right-4">
                    <div className={`w-6 h-6 rounded-full transition-colors ${tested[mat.id] ? (mat.type === 'Conductor' ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'bg-slate-600') : 'bg-slate-600'}`}></div>
                  </div>
                </div>

                <div className="flex gap-4 mt-auto">
                  <button 
                    onClick={() => handleClassify(mat.id, 'Conductor')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-colors border-2 ${tested[mat.id] === 'Conductor' ? 'bg-yellow-500 border-yellow-500 text-slate-900' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-yellow-500 hover:text-yellow-500'}`}
                  >
                    Conductor
                  </button>
                  <button 
                    onClick={() => handleClassify(mat.id, 'Insulator')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-colors border-2 ${tested[mat.id] === 'Insulator' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-500'}`}
                  >
                    Insulator
                  </button>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(tested).length === materials.length && Object.entries(tested).every(([k, v]) => materials.find(m => m.id === k)?.type === v) && (
            <div className="mt-8 p-6 bg-emerald-900/50 border border-emerald-500 text-emerald-100 rounded-xl flex items-center justify-center gap-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="font-bold text-xl">Lab Complete!</h3>
                <p className="text-emerald-200/80">You have correctly identified all conductors and insulators.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
