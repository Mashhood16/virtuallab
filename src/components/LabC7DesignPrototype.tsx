import { useState } from 'react';
import { CheckCircle, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7DesignPrototype({ onExit }: LabProps) {
  const [prototypeActive, setPrototypeActive] = useState(false);
  const [usedMaterials, setUsedMaterials] = useState<string[]>([]);
  const [result, setResult] = useState<'none' | 'success' | 'fail'>('none');

  const materials = [
    { id: 'dough', name: 'Play-Dough', valid: true },
    { id: 'bag', name: 'Trash Bag', valid: true },
    { id: 'blocks', name: 'Lego Blocks', valid: true },
    { id: 'cup', name: 'Kitchen Cup', valid: false },
    { id: 'spoon', name: 'Soup Spoon', valid: false }
  ];

  const handleToggleMaterial = (id: string) => {
    if (usedMaterials.includes(id)) {
      setUsedMaterials(usedMaterials.filter(m => m !== id));
    } else {
      setUsedMaterials([...usedMaterials, id]);
    }
    setResult('none');
  };

  const testPrototype = () => {
    setPrototypeActive(true);
    
    setTimeout(() => {
      setPrototypeActive(false);
      // Fails if any invalid (kitchen) tool is used, or if no valid container structure is made
      const hasInvalid = usedMaterials.some(m => materials.find(mat => mat.id === m)?.valid === false);
      const hasValid = usedMaterials.some(m => materials.find(mat => mat.id === m)?.valid === true);
      
      if (hasInvalid || !hasValid) {
        setResult('fail');
      } else {
        setResult('success');
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Design Thinking Prototype" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Design a prototype to carry water from Point A to Point B without using standard kitchen tools.</p>

        <div className="flex gap-8 max-w-5xl mx-auto w-full">
          {/* Materials */}
          <div className="w-80 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6 flex flex-col">
            <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider text-sm">Available Materials</h2>
            <div className="flex flex-col gap-3 mb-8">
              {materials.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => handleToggleMaterial(mat.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all font-medium flex justify-between items-center ${usedMaterials.includes(mat.id) ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}
                >
                  {mat.name}
                  {usedMaterials.includes(mat.id) && <CheckCircle className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </div>

            <div className="mt-auto">
              <button 
                onClick={testPrototype}
                disabled={usedMaterials.length === 0 || prototypeActive}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
              >
                {prototypeActive ? 'Testing Prototype...' : 'Test Prototype'}
              </button>
            </div>
          </div>

          {/* Testing Area */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-xl border-4 border-slate-200 dark:border-slate-700 dark:border-slate-500 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 dark:bg-slate-900">
              <div className="text-center font-black text-2xl text-slate-400">POINT A</div>
              <div className="w-full max-w-[200px] h-2 bg-slate-200 dark:bg-slate-800 mx-4 relative overflow-hidden rounded-full">
                {prototypeActive && <div className="absolute inset-y-0 left-0 bg-blue-400 w-full animate-in slide-in-from-left-full duration-2000 linear" />}
              </div>
              <div className="text-center font-black text-2xl text-slate-400">POINT B</div>
            </div>

            <div className="flex-1 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
              {prototypeActive && (
                <Droplets className="w-16 h-16 text-blue-400 animate-bounce absolute z-10" style={{ left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }} />
              )}
              
              <div className="flex gap-2 relative z-0 mt-20">
                {usedMaterials.length === 0 && <span className="text-slate-400 italic">No materials selected for prototype.</span>}
                {usedMaterials.map(m => (
                  <div key={m} className="px-4 py-8 bg-slate-300 dark:bg-slate-800 rounded border-4 border-slate-400 dark:border-slate-500 font-bold text-slate-600 dark:text-slate-300 shadow-lg transform -rotate-6">
                    {materials.find(x=>x.id===m)?.name}
                  </div>
                ))}
              </div>

              {result === 'success' && (
                <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center text-white z-20 animate-in fade-in">
                  <CheckCircle className="w-20 h-20 mb-4" />
                  <h2 className="text-4xl font-black mb-2">Success!</h2>
                  <p className="text-xl font-medium text-emerald-100">Your prototype successfully transported the water.</p>
                </div>
              )}

              {result === 'fail' && (
                <div className="absolute inset-0 bg-rose-500/90 flex flex-col items-center justify-center text-white z-20 animate-in fade-in">
                  <div className="text-6xl mb-4">💥</div>
                  <h2 className="text-4xl font-black mb-2">Prototype Failed!</h2>
                  <p className="text-xl font-medium text-rose-100 max-w-md text-center">
                    Remember: You cannot use standard kitchen tools like cups or spoons for this challenge. Think outside the box!
                  </p>
                  <button onClick={() => setResult('none')} className="mt-8 bg-slate-50 dark:bg-slate-900 text-rose-600 px-6 py-2 rounded-lg font-bold">Try Again</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
