import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, Activity, Zap } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
  onExit: () => void;
}

const ChemicalBottle = ({ label, color, onClick, selected }: { label: string, color: string, onClick: () => void, selected?: boolean }) => (
  <button onClick={onClick} className={`flex flex-col items-center p-2 bg-slate-50 border-2 rounded shadow transition-colors ${selected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}>
    <div className="relative w-10 h-16 border-2 border-gray-400 rounded-b-lg rounded-t-sm overflow-hidden flex items-end">
      <div className="w-full" style={{ height: '60%', backgroundColor: color }}></div>
    </div>
    <span className="text-xs font-bold mt-1 text-gray-700">{label}</span>
  </button>
);

const EquationDisplay = ({ equation }: { equation: string[] }) => (
  <div className="h-16 flex items-center justify-center bg-slate-900 text-green-400 font-mono text-lg rounded px-4 shadow-inner mb-4 overflow-x-auto whitespace-nowrap">
    {equation.length === 0 ? <span className="text-gray-500">Awaiting reaction...</span> : 
      equation.map((part, i) => <span key={i} className="mx-1 animate-pulse">{part}</span>)
    }
  </div>
);

export default function LabC9AtomicStructure({ onExit }: Props) {
  const [activeTab] = useState<'alpha' | 'halogen'>('halogen');
  const [equation, setEquation] = useState<string[]>([]);
  
  // Halogen Displacement State
  const [selHalogen, setSelHalogen] = useState<string>(''); // F2, Cl2, Br2, I2
  const [selHalide, setSelHalide] = useState<string>(''); // NaCl, NaBr, NaI
  const [beakerColor, setBeakerColor] = useState<string>('rgba(200,200,200,0.1)');
  const [displacementData, setDisplacementData] = useState<Array<{id: number, halogen: string, halide: string, result: string}>>([]);

  // Alpha Decay State
  const [decaying, setDecaying] = useState<boolean>(false);
  const [u238Count, setU238Count] = useState<number>(100);
  const [th234Count, setTh234Count] = useState<number>(0);

  const [decayData, setDecayData] = useState<Array<{id: number, time: number, parent: number, daughter: number}>>([]);
  const [time, setTime] = useState<number>(0);

  // Assessment
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  // Halogen Logic
  const mixHalogens = () => {
    if (!selHalogen || !selHalide) return;
    const rank: Record<string, number> = { 'F': 4, 'Cl': 3, 'Br': 2, 'I': 1 };
    const h1 = selHalogen.replace('2', '');
    const h2 = selHalide.replace('Na', '');
    
    setEquation([`${selHalogen}(aq)`, '+', `2${selHalide}(aq)`]);
    
    setTimeout(() => {
      let resultStr = "No Reaction";
      if (rank[h1] > rank[h2]) {
        setEquation([`${selHalogen}(aq)`, '+', `2${selHalide}(aq)`, '→', `2Na${h1}(aq)`, '+', `${h2}2(aq)`]);
        const colors: Record<string, string> = { 'Cl': 'rgba(200,255,200,0.4)', 'Br': 'rgba(255,165,0,0.6)', 'I': 'rgba(139,69,19,0.8)' };
        setBeakerColor(colors[h2] || 'rgba(200,200,200,0.1)');
        resultStr = "Reaction Occurred";
      } else {
        setEquation([`${selHalogen}(aq)`, '+', `2${selHalide}(aq)`, '→', 'No Reaction']);
        setBeakerColor('rgba(200,200,200,0.1)');
      }
      setDisplacementData(prev => [...prev, { id: Date.now(), halogen: selHalogen, halide: selHalide, result: resultStr }]);
    }, 1500);
  };

  // Alpha Decay Logic
  useEffect(() => {
    if (activeTab !== 'alpha' || !decaying || u238Count === 0) return;
    const interval = setInterval(() => {
      setTime(t => t + 1);
      let decayedThisTick = 0;
      setU238Count(c => {
        for (let i = 0; i < c; i++) {
          if (Math.random() < 0.05) decayedThisTick++; // 5% chance per particle per tick
        }
        return Math.max(0, c - decayedThisTick);
      });
      if (decayedThisTick > 0) {
        setTh234Count(t => t + decayedThisTick);
        setEquation(['²³⁸U', '→', '²³⁴Th', '+', '⁴α']);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [activeTab, decaying, u238Count]);

  useEffect(() => {
    if (activeTab === 'alpha' && decaying && time % 2 === 0) {
      setDecayData(prev => [...prev, { id: Date.now(), time, parent: u238Count, daughter: th234Count }]);
    }
  }, [time, activeTab, decaying, u238Count, th234Count]);

  const checkAnswer = () => {
    if (activeTab === 'halogen') {
      if (answer.trim().toUpperCase() === 'FLUORINE' || answer.trim().toUpperCase() === 'F' || answer.trim().toUpperCase() === 'F2') {
        setFeedback("Correct! Fluorine is the most reactive halogen and displaces the others.");
      } else {
        setFeedback("Incorrect. Look at the reactivity series for Group 7.");
      }
    } else {
      const val = parseInt(answer);
      if (val === 234) setFeedback("Correct! 238 - 4 = 234.");
      else setFeedback("Incorrect. Remember an alpha particle has a mass number of 4.");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} variant="blue" title="Grade 9 Chemistry: Atomic Structure & Reactivity" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-grow">
        {/* Theory Column */}
        <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center text-purple-800"><ClipboardList className="mr-2" /> Theory & Setup</h2>
          {activeTab === 'halogen' ? (
            <div className="space-y-4 text-slate-700">
              <p><strong>Halogen Displacement:</strong> Group 7 elements (Halogens) become less reactive as you go down the group. A more reactive halogen will displace a less reactive halogen from an aqueous solution of its halide salt.</p>
              <ul className="list-disc pl-5 font-mono text-sm bg-gray-50 p-2 rounded">
                <li>F₂ (Pale yellow)</li>
                <li>Cl₂ (Pale green)</li>
                <li>Br₂ (Orange)</li>
                <li>I₂ (Brown)</li>
              </ul>
              <p><strong>Experiment:</strong> Select a Halogen water and a Halide salt solution. Mix them to see if a displacement reaction occurs and note the color changes.</p>
            </div>
          ) : (
            <div className="space-y-4 text-slate-700">
              <p><strong>Alpha Decay:</strong> Unstable, heavy nuclei can achieve stability by emitting an alpha particle (2 protons, 2 neutrons).</p>
              <p>This changes the atomic number by -2 and the mass number by -4, creating a new element entirely.</p>
              <p><strong>Experiment:</strong> Observe a sample of Uranium-238 decaying into Thorium-234. Track the number of parent nuclei over time to understand half-life behavior.</p>
            </div>
          )}
        </div>

        {/* Simulation Column */}
        <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 flex items-center text-purple-800 w-full"><Activity className="mr-2" /> Interactive Simulator</h2>
          
          <EquationDisplay equation={equation} />

          {activeTab === 'halogen' ? (
            <div className="flex flex-col w-full items-center">
              <div className="flex gap-8 mb-6">
                <div>
                  <div className="text-sm font-bold text-gray-500 mb-2 text-center">Halogen Waters</div>
                  <div className="flex gap-2">
                    <ChemicalBottle label="F₂" color="#ffffcc" selected={selHalogen === 'F2'} onClick={() => setSelHalogen('F2')} />
                    <ChemicalBottle label="Cl₂" color="#ccffcc" selected={selHalogen === 'Cl2'} onClick={() => setSelHalogen('Cl2')} />
                    <ChemicalBottle label="Br₂" color="#ffcc99" selected={selHalogen === 'Br2'} onClick={() => setSelHalogen('Br2')} />
                    <ChemicalBottle label="I₂" color="#e6ccff" selected={selHalogen === 'I2'} onClick={() => setSelHalogen('I2')} />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-500 mb-2 text-center">Halide Salts</div>
                  <div className="flex gap-2">
                    <ChemicalBottle label="NaCl" color="#f0f0f0" selected={selHalide === 'NaCl'} onClick={() => setSelHalide('NaCl')} />
                    <ChemicalBottle label="NaBr" color="#f0f0f0" selected={selHalide === 'NaBr'} onClick={() => setSelHalide('NaBr')} />
                    <ChemicalBottle label="NaI" color="#f0f0f0" selected={selHalide === 'NaI'} onClick={() => setSelHalide('NaI')} />
                  </div>
                </div>
              </div>

              <div className="relative w-48 h-56 border-4 border-gray-300 rounded-b-3xl rounded-t-sm flex items-end justify-center bg-gray-50 overflow-hidden shadow-inner mb-6">
                <div className="w-full transition-colors duration-1000" style={{ height: '70%', backgroundColor: beakerColor }}></div>
              </div>

              <button onClick={mixHalogens} disabled={!selHalogen || !selHalide} className="px-6 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 disabled:opacity-50">
                Mix Chemicals
              </button>
            </div>
          ) : (
            <div className="flex flex-col w-full items-center">
              <div className="relative w-64 h-64 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden mb-6">
                {/* Nucleus visualizer */}
                <div className="text-center z-10 bg-slate-50/80 p-2 rounded font-bold text-purple-900 border border-purple-200">
                  Parent: {u238Count} <br/> Daughter: {th234Count}
                </div>
                {/* Abstract representation of radiation */}
                {decaying && <Zap className="absolute text-yellow-400 opacity-50 animate-ping" size={100} />}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setDecaying(true)} disabled={decaying || u238Count === 0} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50">Start Decay</button>
                <button onClick={() => setDecaying(false)} disabled={!decaying} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:opacity-50">Pause Decay</button>
              </div>
            </div>
          )}
        </div>

        {/* Data & Assessment Column */}
        <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 flex items-center text-purple-800"><CheckCircle className="mr-2" /> Data & Analysis</h2>
          
          <div className="flex-grow overflow-y-auto mb-4 border rounded">
            {activeTab === 'halogen' ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr><th className="p-2">Halogen</th><th className="p-2">Halide</th><th className="p-2">Result</th></tr>
                </thead>
                <tbody>
                  {displacementData.map(d => (
                    <tr key={d.id} className="border-t"><td className="p-2">{d.halogen}</td><td className="p-2">{d.halide}</td><td className={`p-2 font-bold ${d.result === 'No Reaction' ? 'text-gray-500' : 'text-green-600'}`}>{d.result}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr><th className="p-2">Time (s)</th><th className="p-2">Parent (U-238)</th><th className="p-2">Daughter (Th-234)</th></tr>
                </thead>
                <tbody>
                  {decayData.map(d => (
                    <tr key={d.id} className="border-t"><td className="p-2">{d.time}</td><td className="p-2 text-red-600">{d.parent}</td><td className="p-2 text-blue-600">{d.daughter}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded border border-purple-100">
            <h3 className="font-bold text-purple-900 mb-2">Assessment</h3>
            <p className="text-sm text-slate-700 mb-2">
              {activeTab === 'halogen' 
                ? "Based on your mixing data, which halogen is the most reactive and capable of displacing all others?" 
                : "What is the mass number of the resulting Thorium isotope after U-238 emits an alpha particle?"}
            </p>
            <div className="flex gap-2">
              <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter answer..." className="flex-grow p-2 border rounded" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700">Check</button>
            </div>
            {feedback && <div className={`mt-2 text-sm font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
