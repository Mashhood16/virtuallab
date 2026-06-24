import { useState } from 'react';
import { CheckCircle, PlusCircle, Trash2, ArrowDown, ShoppingBag } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6ProblemDecomposition({ onExit }: LabProps) {
  const [subProblems, setSubProblems] = useState([
    { id: '1', text: 'Make a shopping list' },
    { id: '2', text: 'Get money / wallet' }
  ]);
  const [inputText, setInputText] = useState('');

  const addProblem = () => {
    if (inputText.trim()) {
      setSubProblems([...subProblems, { id: Date.now().toString(), text: inputText.trim() }]);
      setInputText('');
    }
  };

  const removeProblem = (id: string) => {
    setSubProblems(subProblems.filter(p => p.id !== id));
  };

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Problem Decomposition" />

        <h1 className="text-3xl font-bold mb-2">Problem Decomposition</h1>
        <p className="text-slate-600 mb-8">Break down the main problem ("How to do grocery shopping?") into smaller, manageable sub-problems.</p>

        <div className="flex-1 flex flex-col items-center bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-12">
          
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg border-4 border-blue-700 w-full max-w-lg text-center relative z-10 flex flex-col items-center gap-3">
            <ShoppingBag className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Main Problem:</h2>
            <p className="text-xl">"How to do grocery shopping for Uncle?"</p>
          </div>

          {subProblems.length > 0 && (
            <ArrowDown className="w-8 h-8 text-slate-300 my-4" />
          )}

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
            {subProblems.map((p, idx) => (
              <div key={p.id} className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl shadow-sm flex items-center justify-between w-64 animate-in fade-in slide-in-from-top-4">
                <span className="font-bold text-emerald-800 flex-1">{idx + 1}. {p.text}</span>
                <button onClick={() => removeProblem(p.id)} className="text-emerald-400 hover:text-rose-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-slate-100 border border-slate-200 p-6 rounded-xl w-full max-w-xl flex flex-col gap-4">
            <h3 className="font-bold text-slate-700">Add a Sub-Problem</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addProblem()}
                placeholder="e.g. Go to the supermarket..."
                className="flex-1 p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={addProblem}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add
              </button>
            </div>
          </div>

          {subProblems.length >= 4 && (
            <div className="mt-8 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg flex items-center gap-3 font-bold max-w-xl w-full">
              <CheckCircle className="w-6 h-6" /> 
              Great job! You have successfully decomposed the problem into manageable steps.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
