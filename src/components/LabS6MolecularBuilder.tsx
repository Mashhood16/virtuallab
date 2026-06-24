import { useState } from 'react';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6MolecularBuilder({ onExit }: LabProps) {
  const [molecule, setMolecule] = useState<'H2O' | 'CO2' | 'CH4'>('H2O');
  
  // Inventory
  const [atoms, setAtoms] = useState<{type: 'H' | 'C' | 'O', x: number, y: number}[]>([]);
  // Dragging logic would normally be complex, so we'll simulate a snapping builder
  // where clicking the required atoms auto-assembles it.

  const requirements: Record<string, { H?: number, C?: number, O?: number, name: string }> = {
    H2O: { H: 2, O: 1, name: 'Water' },
    CO2: { C: 1, O: 2, name: 'Carbon Dioxide' },
    CH4: { C: 1, H: 4, name: 'Methane' }
  };

  const countAtoms = (type: string) => atoms.filter(a => a.type === type).length;

  const addAtom = (type: 'H' | 'C' | 'O') => {
    if (countAtoms(type) < (requirements[molecule][type] || 0)) {
      setAtoms([...atoms, { type, x: 0, y: 0 }]); // Positions managed via CSS layout for simplicity in this template
    }
  };

  const reset = () => {
    setAtoms([]);
  };

  const isComplete = () => {
    const req = requirements[molecule];
    return (
      countAtoms('H') === (req.H || 0) &&
      countAtoms('C') === (req.C || 0) &&
      countAtoms('O') === (req.O || 0)
    );
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-100 font-sans">
      <LabHeader onExit={onExit} title="Unit 6: Molecular Models" />

      <div className="flex-1 flex p-6 gap-6">
        
        {/* Left Panel - Inventory */}
        <div className="w-80 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Target Molecule</h2>
          <div className="flex gap-2 mb-6">
            {(['H2O', 'CO2', 'CH4'] as const).map(mol => (
              <button 
                key={mol}
                onClick={() => { setMolecule(mol); reset(); }}
                className={`flex-1 py-2 rounded font-bold border-2 ${molecule === mol ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-purple-300'}`}
              >
                {mol}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-4 border-b pb-2">Atom Inventory</h2>
          <p className="text-sm text-slate-500 mb-4">Click to add atoms to the builder to form {requirements[molecule].name}.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => addAtom('H')}
              disabled={countAtoms('H') >= (requirements[molecule].H || 0)}
              className="w-full p-3 flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-300 flex items-center justify-center font-bold text-slate-600">H</div>
              <span className="font-medium text-slate-700">Hydrogen (White)</span>
            </button>
            
            <button 
              onClick={() => addAtom('C')}
              disabled={countAtoms('C') >= (requirements[molecule].C || 0)}
              className="w-full p-3 flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white">C</div>
              <span className="font-medium text-slate-700">Carbon (Black)</span>
            </button>

            <button 
              onClick={() => addAtom('O')}
              disabled={countAtoms('O') >= (requirements[molecule].O || 0)}
              className="w-full p-3 flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center font-bold text-white">O</div>
              <span className="font-medium text-slate-700">Oxygen (Red)</span>
            </button>
          </div>

          <button onClick={reset} className="mt-auto flex items-center justify-center py-3 text-slate-500 hover:text-slate-800 font-bold bg-slate-100 rounded-lg">
            <RefreshCcw className="w-5 h-5 mr-2" /> Reset Canvas
          </button>
        </div>

        {/* Right Panel - Assembly Canvas */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPPHBhdGggZD0iTTAgMGgxdjQwSDB6TTAgMGg0MHYxSDB6IiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDUpIi8+PC9zdmc+')]">
          
          {isComplete() ? (
            <div className="absolute top-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-6 h-6" />
              Success! You built {requirements[molecule].name}.
            </div>
          ) : (
            <div className="absolute top-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium text-center">
              Add {requirements[molecule].C || 0} Carbon, {requirements[molecule].H || 0} Hydrogen, and {requirements[molecule].O || 0} Oxygen.
            </div>
          )}

          {/* Molecule Visualization */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {molecule === 'H2O' && isComplete() && (
              <div className="relative w-full h-full">
                {/* O */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-500 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center text-white font-bold text-2xl">O</div>
                {/* H */}
                <div className="absolute top-3/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-50 border border-slate-300 rounded-full shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center text-slate-500 font-bold text-lg">H</div>
                {/* H */}
                <div className="absolute top-3/4 left-3/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-50 border border-slate-300 rounded-full shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center text-slate-500 font-bold text-lg">H</div>
                
                {/* Bonds */}
                <div className="absolute top-[60%] left-[30%] w-16 h-3 bg-slate-300 rounded-full origin-left -rotate-45 shadow-sm"></div>
                <div className="absolute top-[60%] right-[30%] w-16 h-3 bg-slate-300 rounded-full origin-right rotate-45 shadow-sm"></div>
              </div>
            )}

            {molecule === 'CO2' && isComplete() && (
              <div className="relative w-full h-full flex items-center justify-center gap-1">
                <div className="w-16 h-16 bg-red-500 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center text-white font-bold text-2xl">O</div>
                <div className="flex flex-col gap-1 z-0 -mx-4"><div className="w-12 h-3 bg-slate-300 rounded-full"></div><div className="w-12 h-3 bg-slate-300 rounded-full"></div></div>
                <div className="w-20 h-20 bg-slate-800 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center text-white font-bold text-2xl">C</div>
                <div className="flex flex-col gap-1 z-0 -mx-4"><div className="w-12 h-3 bg-slate-300 rounded-full"></div><div className="w-12 h-3 bg-slate-300 rounded-full"></div></div>
                <div className="w-16 h-16 bg-red-500 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center text-white font-bold text-2xl">O</div>
              </div>
            )}

            {molecule === 'CH4' && isComplete() && (
              <div className="relative w-full h-full">
                {/* C */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-slate-800 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center text-white font-bold text-2xl">C</div>
                
                {/* Top H */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-50 border border-slate-300 rounded-full shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center text-slate-500 font-bold text-lg">H</div>
                <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-3 h-20 bg-slate-300 rounded-full z-0"></div>

                {/* Left H */}
                <div className="absolute top-3/4 left-[20%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-50 border border-slate-300 rounded-full shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center text-slate-500 font-bold text-lg">H</div>
                <div className="absolute top-[55%] left-[25%] w-16 h-3 bg-slate-300 rounded-full origin-left rotate-[30deg] z-0"></div>

                {/* Right H */}
                <div className="absolute top-3/4 left-[80%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-50 border border-slate-300 rounded-full shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center text-slate-500 font-bold text-lg">H</div>
                <div className="absolute top-[55%] right-[25%] w-16 h-3 bg-slate-300 rounded-full origin-right -rotate-[30deg] z-0"></div>
                
                {/* Front/Bottom H (3D projection simulation) */}
                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-slate-50 border border-slate-300 rounded-full shadow-[inset_-3px_-3px_15px_rgba(0,0,0,0.2)] z-20 flex items-center justify-center text-slate-500 font-bold text-xl">H</div>
                <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-4 h-16 bg-slate-400 rounded-full z-10"></div>
              </div>
            )}

            {/* Incomplete state - Scattered atoms */}
            {!isComplete() && (
              <div className="relative w-full h-full animate-pulse opacity-50">
                {atoms.map((a, i) => (
                  <div key={i} className="absolute" style={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%` }}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ${a.type === 'H' ? 'bg-slate-50 border border-slate-300 text-slate-500' : a.type === 'C' ? 'bg-slate-800 text-white' : 'bg-red-500 text-white'}`}>
                       {a.type}
                     </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
