import { useState, useRef } from 'react';
import { Beaker, Sun, ThermometerSun, AlertCircle, CheckSquare, Zap, Moon } from 'lucide-react';
import LabHeader from './LabHeader';

interface ComponentProps {
  onExit?: () => void;
}

type Reagent = 'Ethene' | 'Hydrogen' | 'Methane' | 'Chlorine' | null;

interface ReactorState {
  reagents: Reagent[];
  catalyst: 'None' | 'Nickel';
  temperature: number; // 20 to 300 C
  sunlight: 'Dark' | 'Diffused' | 'Direct';
}

export default function LabC9OrganicChem({ onExit }: ComponentProps) {
  const [reactor, setReactor] = useState<ReactorState>({
    reagents: [],
    catalyst: 'None',
    temperature: 20,
    sunlight: 'Dark'
  });

  const [equation, setEquation] = useState<string>('Select reagents to begin...');
  const [reactionStatus, setReactionStatus] = useState<'idle' | 'success' | 'explosive' | 'failed'>('idle');
  
  // Data Logging
  const [logs, setLogs] = useState<{ id: number, time: string, eq: string, result: string }[]>([]);
  const logId = useRef<number>(0);

  // Assessment
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [feedback, setFeedback] = useState('');

  const addReagent = (r: Reagent) => {
    if (reactor.reagents.length >= 2 || reactionStatus !== 'idle') {
      // reset if finished
      if (reactionStatus !== 'idle') {
        setReactor(prev => ({ ...prev, reagents: [r] }));
        setReactionStatus('idle');
        setEquation(getFormula(r) || '');
      }
      return;
    }
    
    if (r) {
      const newReagents = [...reactor.reagents, r];
      setReactor(prev => ({ ...prev, reagents: newReagents }));
      
      const parts = newReagents.map(getFormula);
      setEquation(parts.join(' + ') + ' → ?');
    }
  };

  const getFormula = (name: Reagent) => {
    switch(name) {
      case 'Ethene': return 'C₂H₄';
      case 'Hydrogen': return 'H₂';
      case 'Methane': return 'CH₄';
      case 'Chlorine': return 'Cl₂';
      default: return '';
    }
  };

  const runReaction = () => {
    const r = reactor.reagents;
    let newEq = equation;
    let status: 'success' | 'explosive' | 'failed' = 'failed';
    let resultLog = 'No reaction occurred.';

    if (r.includes('Ethene') && r.includes('Hydrogen')) {
      if (reactor.catalyst === 'Nickel' && reactor.temperature >= 150) {
        newEq = 'C₂H₄ + H₂ → C₂H₆ (Ethane)';
        status = 'success';
        resultLog = 'Hydrogenation successful (Alkene to Alkane).';
      } else {
        newEq = 'C₂H₄ + H₂ → No Reaction (Check Catalyst/Temp)';
        status = 'failed';
        resultLog = 'Failed: Requires Nickel catalyst and heat (≥150°C).';
      }
    } 
    else if (r.includes('Methane') && r.includes('Chlorine')) {
      if (reactor.sunlight === 'Direct') {
        newEq = 'CH₄ + 2Cl₂ → C + 4HCl (Explosive!)';
        status = 'explosive';
        resultLog = 'Explosive reaction in direct sunlight!';
      } else if (reactor.sunlight === 'Diffused') {
        newEq = 'CH₄ + Cl₂ → CH₃Cl + HCl';
        status = 'success';
        resultLog = 'Substitution reaction successful (Chloromethane formed).';
      } else {
        newEq = 'CH₄ + Cl₂ → No Reaction (Needs UV Light)';
        status = 'failed';
        resultLog = 'Failed: Substitution requires UV light (sunlight).';
      }
    } else if (r.length === 2) {
      newEq = r.map(getFormula).join(' + ') + ' → No Reaction';
      status = 'failed';
      resultLog = 'Invalid reagent combination.';
    }

    setEquation(newEq);
    setReactionStatus(status);

    // Log data
    const newLog = {
      id: logId.current++,
      time: new Date().toLocaleTimeString(),
      eq: newEq,
      result: resultLog
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const clearReactor = () => {
    setReactor(prev => ({ ...prev, reagents: [] }));
    setEquation('Select reagents to begin...');
    setReactionStatus('idle');
  };

  const checkAssessment = () => {
    let score = 0;
    if (q1.toLowerCase().includes('addition') || q1.toLowerCase().includes('hydrogenation')) score++;
    if (q2.toLowerCase().includes('substitution')) score++;

    if (score === 2) setFeedback('Perfect! You identified both reaction types correctly.');
    else if (score === 1) setFeedback('Partial correct. Review the reaction types.');
    else setFeedback('Incorrect. Remember Alkene+H2 is addition, Alkane+Halogen is substitution.');
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Grade 9 Chemistry: Organic Reactions" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-purple-600" /> Reaction Theory
          </h2>
          
          <div className="space-y-4 text-sm text-slate-700">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-2">1. Hydrogenation of Alkenes</h3>
              <p className="mb-2">Alkenes (like Ethene, C₂H₄) are unsaturated. They can undergo <b>Addition Reactions</b> with Hydrogen gas to form saturated alkanes (Ethane, C₂H₆).</p>
              <ul className="list-disc pl-5 font-mono text-xs text-purple-900 bg-slate-50 p-2 rounded">
                <li>Condition 1: Nickel (Ni) Catalyst</li>
                <li>Condition 2: Heat (around 150°C - 200°C)</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-800 mb-2">2. Halogenation of Alkanes</h3>
              <p className="mb-2">Alkanes (like Methane, CH₄) are saturated. They undergo <b>Substitution Reactions</b> with halogens (like Chlorine, Cl₂).</p>
              <ul className="list-disc pl-5 font-mono text-xs text-orange-900 bg-slate-50 p-2 rounded">
                <li>Requires UV light (Sunlight) to break Cl-Cl bonds.</li>
                <li><b>Direct Sunlight:</b> Explosive reaction, forms Carbon and HCl.</li>
                <li><b>Diffused Sunlight:</b> Controlled substitution, forms Chloromethane (CH₃Cl).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Chemical Reactor</h2>
          
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Reagent Bottles */}
            <div className="flex justify-between px-4">
              {['Ethene', 'Hydrogen', 'Methane', 'Chlorine'].map((r) => {
                const isSelected = reactor.reagents.includes(r as Reagent);
                const colors: Record<string, string> = {
                  'Ethene': 'bg-blue-200', 'Hydrogen': 'bg-gray-100',
                  'Methane': 'bg-green-100', 'Chlorine': 'bg-yellow-200'
                };
                return (
                  <button
                    key={r}
                    onClick={() => addReagent(r as Reagent)}
                    className={`flex flex-col items-center gap-2 transition-all ${isSelected ? 'opacity-50 scale-95' : 'hover:-translate-y-1'}`}
                  >
                    <div className={`w-14 h-20 rounded-t-xl rounded-b-md border-2 border-slate-300 relative overflow-hidden flex items-end ${colors[r]}`}>
                      <div className="absolute top-0 w-full h-4 bg-slate-50/40 border-b border-slate-300"></div>
                      <div className="w-full h-2/3 bg-slate-50/20"></div>
                    </div>
                    <span className="text-xs font-bold">{r}</span>
                  </button>
                )
              })}
            </div>

            {/* Reactor Vessel */}
            <div className={`relative w-full h-48 rounded-2xl border-4 flex items-center justify-center flex-col transition-colors ${reactionStatus === 'explosive' ? 'bg-orange-500 border-red-600 animate-pulse' : reactionStatus === 'success' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-100 border-slate-300'}`}>
              
              {/* Environment Indicators */}
              <div className="absolute top-2 right-2 flex gap-2">
                {reactor.sunlight === 'Direct' && <Sun className="text-orange-500" />}
                {reactor.sunlight === 'Diffused' && <Sun className="text-yellow-400 opacity-70" />}
                {reactor.sunlight === 'Dark' && <Moon className="text-slate-400" />}
                {reactor.temperature >= 150 && <ThermometerSun className="text-red-500" />}
                {reactor.catalyst === 'Nickel' && <span className="text-xs font-bold bg-slate-800 text-white px-2 py-1 rounded">Ni</span>}
              </div>

              {reactionStatus === 'explosive' && <AlertCircle className="w-16 h-16 text-white mb-2" />}
              {reactionStatus === 'success' && <Zap className="w-16 h-16 text-emerald-500 mb-2" />}

              <div className={`text-xl font-mono font-bold text-center px-4 ${reactionStatus === 'explosive' ? 'text-white' : 'text-slate-800'}`}>
                {equation}
              </div>

            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Catalyst</label>
                <select 
                  value={reactor.catalyst} 
                  onChange={(e) => setReactor(prev => ({ ...prev, catalyst: e.target.value as any }))}
                  className="w-full mt-1 p-2 rounded border text-sm"
                >
                  <option value="None">None</option>
                  <option value="Nickel">Nickel (Ni)</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Light Condition</label>
                <select 
                  value={reactor.sunlight} 
                  onChange={(e) => setReactor(prev => ({ ...prev, sunlight: e.target.value as any }))}
                  className="w-full mt-1 p-2 rounded border text-sm"
                >
                  <option value="Dark">Dark</option>
                  <option value="Diffused">Diffused Sunlight</option>
                  <option value="Direct">Direct Sunlight</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                  <span>Temperature</span>
                  <span>{reactor.temperature}°C</span>
                </label>
                <input 
                  type="range" min="20" max="300" step="10" 
                  value={reactor.temperature} 
                  onChange={(e) => setReactor(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={runReaction}
                disabled={reactor.reagents.length < 2 || reactionStatus !== 'idle'}
                className="flex-1 py-3 bg-purple-600 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
              >
                Start Reaction
              </button>
              <button 
                onClick={clearReactor}
                className="px-4 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>

          </div>
        </div>

        {/* Column 3: Data Logging & Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-600" /> 
              Assessment & Data
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  1. What type of reaction occurs between Ethene and Hydrogen?
                </label>
                <input 
                  type="text" 
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  placeholder="e.g. Addition"
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  2. What type of reaction occurs between Methane and Chlorine in diffused light?
                </label>
                <input 
                  type="text" 
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  placeholder="e.g. Substitution"
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>

              <button 
                onClick={checkAssessment}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
              >
                Check Answers
              </button>

              {feedback && (
                <div className={`p-3 rounded-lg text-sm font-medium ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Reaction Log</h3>
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">No reactions logged yet.</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="bg-slate-50 border p-2 rounded text-xs">
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Log #{log.id}</span>
                        <span>{log.time}</span>
                      </div>
                      <div className="font-mono text-purple-800 mb-1">{log.eq}</div>
                      <div className="text-slate-600">{log.result}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
