import { useState } from 'react';
import { Search } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

// Simplify the periodic table for counting periods
const PERIODS = [
  { p: 1, elements: 2, names: ['H', 'He'] },
  { p: 2, elements: 8, names: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'] },
  { p: 3, elements: 8, names: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'] },
  { p: 4, elements: 18, names: ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'] },
  { p: 5, elements: 18, names: ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'] },
  { p: 6, elements: 32, names: ['Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'] },
];

export default function LabS8PeriodicTable({ onExit }: LabProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans">
      <LabHeader onExit={onExit} title="Act 5.1: Elements in Periodic Table" subtitle="Count the number of elements in each period" />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6 flex flex-col">
          
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {PERIODS.map(p => (
              <button
                key={p.p}
                onClick={() => setSelectedPeriod(p.p)}
                className={`px-4 py-2 rounded-lg font-bold border-2 whitespace-nowrap ${
                  selectedPeriod === p.p 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-700 dark:border-slate-500'
                }`}
              >
                Period {p.p}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">Period {selectedPeriod}</h2>
            
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {PERIODS.find(x => x.p === selectedPeriod)?.names.map((name, i) => (
                <div key={i} className="w-10 h-10 bg-indigo-500 text-white font-bold rounded-md flex items-center justify-center shadow-sm animate-fade-in text-xs" style={{ animationDelay: `${i * 20}ms` }}>
                  {name}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-xl font-bold text-indigo-700 bg-indigo-100 px-6 py-3 rounded-full">
              Total Elements: {PERIODS.find(x => x.p === selectedPeriod)?.elements}
            </div>
          </div>

        </div>

        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-800 dark:text-slate-200 p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" /> Data Table
            </h3>
            <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Period</th>
                  <th className="px-4 py-2 rounded-tr-lg text-right">Elements</th>
                </tr>
              </thead>
              <tbody>
                {PERIODS.map(p => (
                  <tr key={p.p} className={`border-b border-slate-200 dark:border-slate-700 ${selectedPeriod === p.p ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-bold' : ''}`}>
                    <td className="px-4 py-2">Period {p.p}</td>
                    <td className="px-4 py-2 text-right">{p.elements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
