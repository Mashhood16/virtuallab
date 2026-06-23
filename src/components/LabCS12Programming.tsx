import { useState, useRef } from 'react';
import { ArrowLeft, Code, Database, CheckCircle, XCircle, Bug, StepForward, RotateCcw, Save } from 'lucide-react';
import { useHistory } from '../store';

export default function LabCS12Programming({ onExit }: { onExit?: () => void }) {
  const { addRecord } = useHistory();
  const startTime = useRef(Date.now());
  const [activeTab, setActiveTab] = useState<'Debugger' | 'Database'>('Debugger');

  // Debugger State
  const [activeLine, setActiveLine] = useState(5);
  const [watchAcc, setWatchAcc] = useState<string | number>('undefined');

  const stepDebugger = () => {
    if (activeLine === 5) {
      setWatchAcc(100);
      setActiveLine(6);
    } else if (activeLine === 6) {
      setWatchAcc(150);
      setActiveLine(7);
    } else if (activeLine === 7) {
      setActiveLine(8); // End
    }
  };

  const resetDebugger = () => {
    setActiveLine(5);
    setWatchAcc('undefined');
  };

  // Database State
  const [nfLevel, setNfLevel] = useState<1 | 2 | 3>(1);

  // Assessment State
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q1Status, setQ1Status] = useState<boolean | null>(null);
  const [q2Status, setQ2Status] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="flex items-center p-4 bg-purple-700 text-white shadow-md">
        <button onClick={onExit} className="mr-4 hover:bg-purple-600 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <Code className="mr-3" size={28} />
        <h1 className="text-2xl font-bold">Interactive Core Dev</h1>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Theory Column */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-purple-800 border-b pb-2">Theory & Context</h2>
          <div className="space-y-4 text-slate-700 overflow-y-auto pr-2 flex-1 text-sm">
            <p>
              <strong>Object-Oriented Programming (OOP)</strong> involves encapsulating data and behavior within logical units called objects.
            </p>
            <h3 className="font-semibold text-purple-700 mt-2">Debugging & Breakpoints</h3>
            <p>
              A visual debugger allows developers to pause execution (breakpoint) and step through code line-by-line while watching variable states in memory.
            </p>
            <h3 className="font-semibold text-purple-700 mt-2">Database Normalization</h3>
            <p>
              Normalization organizes database tables to minimize redundancy:
              <br/>- <strong>1NF:</strong> Eliminate repeating groups.
              <br/>- <strong>2NF:</strong> Remove partial dependencies.
              <br/>- <strong>3NF:</strong> Remove transitive dependencies (non-key columns depend only on primary key).
            </p>
          </div>
        </div>

        {/* Simulation Column */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-purple-800 border-b pb-2">Simulator</h2>
          
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab('Debugger')} className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${activeTab === 'Debugger' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}><Bug size={16}/> Debugger</button>
            <button onClick={() => setActiveTab('Database')} className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${activeTab === 'Database' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}><Database size={16}/> Normalization</button>
          </div>

          <div className="flex-1 flex flex-col bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 relative overflow-hidden shadow-inner">
            {activeTab === 'Debugger' && (
              <>
                <div className="flex-1">
                  <div className={`px-2 py-1 ${activeLine === 1 ? 'bg-purple-900 text-white border-l-4 border-purple-500' : 'pl-3'}`}>1: class Account {'{'}</div>
                  <div className={`px-2 py-1 ${activeLine === 2 ? 'bg-purple-900 text-white border-l-4 border-purple-500' : 'pl-3'}`}>2:   constructor(balance) {'{'} this.balance = balance; {'}'}</div>
                  <div className={`px-2 py-1 ${activeLine === 3 ? 'bg-purple-900 text-white border-l-4 border-purple-500' : 'pl-3'}`}>3:   deposit(amt) {'{'} this.balance += amt; {'}'}</div>
                  <div className={`px-2 py-1 ${activeLine === 4 ? 'bg-purple-900 text-white border-l-4 border-purple-500' : 'pl-3'}`}>4: {'}'}</div>
                  <div className={`px-2 py-1 ${activeLine === 5 ? 'bg-purple-900 text-white border-l-4 border-purple-500' : 'pl-3'}`}>5: let acc = new Account(100);</div>
                  <div className={`px-2 py-1 ${activeLine === 6 ? 'bg-purple-900 text-white border-l-4 border-purple-500' : 'pl-3'}`}>6: acc.deposit(50);</div>
                  <div className={`px-2 py-1 ${activeLine === 7 ? 'bg-purple-900 text-white border-l-4 border-purple-500' : 'pl-3'}`}>7: console.log(acc.balance);</div>
                </div>
                
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-purple-400">Watch Variables</span>
                    <div className="flex gap-2">
                      <button onClick={resetDebugger} className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white"><RotateCcw size={16}/></button>
                      <button onClick={stepDebugger} disabled={activeLine > 7} className="p-1 bg-purple-600 hover:bg-purple-500 rounded text-white disabled:opacity-50 flex items-center gap-1 text-xs px-2"><StepForward size={14}/> Step</button>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    acc: {watchAcc === 'undefined' ? 'undefined' : `{ balance: ${watchAcc} }`}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Database' && (
              <div className="flex-1 flex flex-col font-sans">
                <div className="flex gap-2 mb-4 justify-center">
                  <button onClick={() => setNfLevel(1)} className={`px-3 py-1 rounded text-xs font-bold ${nfLevel === 1 ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>1NF</button>
                  <button onClick={() => setNfLevel(2)} className={`px-3 py-1 rounded text-xs font-bold ${nfLevel === 2 ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>2NF</button>
                  <button onClick={() => setNfLevel(3)} className={`px-3 py-1 rounded text-xs font-bold ${nfLevel === 3 ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>3NF</button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                  {nfLevel === 1 && (
                    <div className="bg-white text-slate-800 text-xs rounded border border-slate-300 overflow-hidden">
                      <div className="bg-slate-200 font-bold p-1 border-b border-slate-300 text-center">Unnormalized / 1NF (Single Table)</div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-100"><tr><th className="p-1 border-r">OrdID</th><th className="p-1 border-r">CustName</th><th className="p-1 border-r">ProdID</th><th className="p-1">ProdName</th></tr></thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="p-1 border-r font-bold text-purple-700">101</td><td className="p-1 border-r">Alice</td><td className="p-1 border-r font-bold text-purple-700">P1</td><td className="p-1">Laptop</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="p-2 text-red-600 font-semibold text-[10px]">Issue: Partial & Transitive dependencies exist.</div>
                    </div>
                  )}

                  {nfLevel >= 2 && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white text-slate-800 text-xs rounded border border-slate-300 overflow-hidden">
                        <div className="bg-slate-200 font-bold p-1 border-b border-slate-300 text-center">Orders Table</div>
                        <table className="w-full text-left">
                          <thead className="bg-slate-100"><tr><th className="p-1 border-r text-purple-700">OrdID (PK)</th><th className="p-1">CustName</th></tr></thead>
                          <tbody><tr className="border-t"><td className="p-1 border-r">101</td><td className="p-1">Alice</td></tr></tbody>
                        </table>
                      </div>
                      <div className="bg-white text-slate-800 text-xs rounded border border-slate-300 overflow-hidden">
                        <div className="bg-slate-200 font-bold p-1 border-b border-slate-300 text-center">OrderDetails</div>
                        <table className="w-full text-left">
                          <thead className="bg-slate-100"><tr><th className="p-1 border-r text-purple-700">OrdID (FK)</th><th className="p-1 border-r text-purple-700">ProdID (FK)</th>{nfLevel === 2 && <th className="p-1">ProdName</th>}</tr></thead>
                          <tbody><tr className="border-t"><td className="p-1 border-r">101</td><td className="p-1 border-r">P1</td>{nfLevel === 2 && <td className="p-1">Laptop</td>}</tr></tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {nfLevel === 3 && (
                    <div className="bg-white text-slate-800 text-xs rounded border border-slate-300 overflow-hidden w-1/2 mx-auto">
                      <div className="bg-slate-200 font-bold p-1 border-b border-slate-300 text-center">Products Table</div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-100"><tr><th className="p-1 border-r text-purple-700">ProdID (PK)</th><th className="p-1">ProdName</th></tr></thead>
                        <tbody><tr className="border-t"><td className="p-1 border-r">P1</td><td className="p-1">Laptop</td></tr></tbody>
                      </table>
                    </div>
                  )}
                  {nfLevel === 3 && <div className="text-green-400 font-semibold text-center mt-2 text-xs">Fully Normalized to 3NF!</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Column */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-purple-800 border-b pb-2">Analysis & Assessment</h2>
          
          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-2">Q1: Using the Debugger, what is the exact value of `acc.balance` immediately AFTER executing line 6?</label>
              <div className="flex gap-2">
                <input type="text" value={q1} onChange={e => setQ1(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Enter value..." />
                <button onClick={() => setQ1Status(q1.trim() === '150')} className="bg-purple-600 text-white px-3 py-1 rounded font-bold text-sm">Check</button>
              </div>
              {q1Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
              {q1Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-2">Q2: In 3NF database normalization, which table correctly holds the `ProdName` column?</label>
              <div className="flex gap-2">
                <select value={q2} onChange={e => setQ2(e.target.value)} className="flex-1 border rounded px-2 py-1 bg-white">
                  <option value="">Select Table...</option>
                  <option value="Orders">Orders Table</option>
                  <option value="OrderDetails">OrderDetails Table</option>
                  <option value="Products">Products Table</option>
                </select>
                <button onClick={() => setQ2Status(q2 === 'Products')} className="bg-purple-600 text-white px-3 py-1 rounded font-bold text-sm">Check</button>
              </div>
              {q2Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
              {q2Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-sm text-purple-800 mt-4">
              <p className="font-bold mb-1">Developer Note</p>
              <p>State mutations (like <code>balance += amt</code>) are common sources of bugs. Debuggers are essential to track the specific moment a variable's state becomes invalid.</p>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <button 
                onClick={() => {
                  let score = 0;
                  if (q1Status) score += 50;
                  if (q2Status) score += 50;

                  addRecord({
                    labId: 'cs12_programming',
                    title: 'Interactive Core Dev',
                    subject: 'Computer Science',
                    score,
                    maxScore: 100,
                    timeSpentSeconds: Math.floor((Date.now() - startTime.current) / 1000),
                    experimentData: {
                      'Last Active Line': activeLine,
                      'Final NF Level': nfLevel + 'NF',
                      'Last Viewed Tab': activeTab,
                      'Q1 Correct': q1Status ? 'Yes' : 'No',
                      'Q2 Correct': q2Status ? 'Yes' : 'No'
                    }
                  });
                  if (onExit) onExit();
                }}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <Save size={20} />
                Submit Results & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
