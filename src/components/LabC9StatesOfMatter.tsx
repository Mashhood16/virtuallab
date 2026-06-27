import { useState, useEffect } from 'react';
import { Beaker, Play, ClipboardList, CheckCircle, Flame, Thermometer } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
  onExit: () => void;
}

const ChemicalBottle = ({ label, color, onClick }: { label: string, color: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-900 border rounded shadow hover:bg-slate-50 dark:bg-slate-900 transition-colors">
    <div className="relative w-10 h-16 border-2 border-gray-400 rounded-b-lg rounded-t-sm overflow-hidden flex items-end">
      <div className="w-full" style={{ height: '60%', backgroundColor: color }}></div>
    </div>
    <span className="text-xs font-bold mt-1 text-gray-700 dark:text-slate-200">{label}</span>
  </button>
);

const EquationDisplay = ({ equation }: { equation: string[] }) => (
  <div className="h-16 flex items-center justify-center bg-slate-900 dark:bg-slate-800 text-green-400 font-mono text-lg rounded px-4 shadow-inner mb-4 overflow-x-auto whitespace-nowrap">
    {equation.length === 0 ? <span className="text-gray-500">Awaiting chemicals...</span> : 
      equation.map((part, i) => <span key={i} className="mx-1 animate-pulse">{part}</span>)
    }
  </div>
);

const SvgGraph = ({ data, xKey, yKey, width = 300, height = 200, xLabel, yLabel }: any) => {
  if (data.length === 0) return <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">No Data Logged</div>;
  
  const minX = Math.min(...data.map((d: any) => d[xKey]));
  const maxX = Math.max(...data.map((d: any) => d[xKey]), minX + 10);
  const minY = Math.min(...data.map((d: any) => d[yKey]));
  const maxY = Math.max(...data.map((d: any) => d[yKey]), minY + 10);
  
  const padX = (maxX - minX) * 0.1 || 10;
  const padY = (maxY - minY) * 0.1 || 10;
  
  const scaleX = (val: number) => 40 + ((val - (minX - padX)) / ((maxX + padX) - (minX - padX))) * (width - 60);
  const scaleY = (val: number) => height - 30 - ((val - (minY - padY)) / ((maxY + padY) - (minY - padY))) * (height - 50);

  const points = data.map((d: any) => `${scaleX(d[xKey])},${scaleY(d[yKey])}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="bg-slate-50 dark:bg-slate-900 rounded shadow-sm border border-gray-200">
        <line x1={40} y1={height - 30} x2={width - 20} y2={height - 30} stroke="black" strokeWidth="2" />
        <line x1={40} y1={20} x2={40} y2={height - 30} stroke="black" strokeWidth="2" />
        <polyline points={points} fill="none" stroke="blue" strokeWidth="2" />
        {data.map((d: any, i: number) => (
          <circle key={i} cx={scaleX(d[xKey])} cy={scaleY(d[yKey])} r="4" fill="red" />
        ))}
        <text x={width / 2} y={height - 5} fontSize="12" textAnchor="middle">{xLabel}</text>
        <text x={10} y={height / 2} fontSize="12" textAnchor="middle" transform={`rotate(-90, 10, ${height / 2})`}>{yLabel}</text>
      </svg>
    </div>
  );
};

export default function LabC9StatesOfMatter({ onExit }: Props) {
  const [activeTab] = useState<'sugar' | 'cuso4'>('sugar');
  const [equation, setEquation] = useState<string[]>([]);
  
  // Sugar Solution State
  const [waterTemp, setWaterTemp] = useState<number>(20);
  const [sugarAdded, setSugarAdded] = useState<number>(0);
  const [sugarDissolved, setSugarDissolved] = useState<number>(0);
  const [isSupersaturated, setIsSupersaturated] = useState<boolean>(false);
  const [sugarData, setSugarData] = useState<Array<{id: number, temp: number, dissolved: number, state: string}>>([]);
  
  // CuSO4 Heating State
  const [cuso4Temp, setCuso4Temp] = useState<number>(20);
  const [cuso4Mass, setCuso4Mass] = useState<number>(249.5); // 1 mole of hydrate
  const [heaterOn, setHeaterOn] = useState<boolean>(false);
  const [cuso4Data, setCuso4Data] = useState<Array<{id: number, temp: number, mass: number}>>([]);

  // Assessment
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  // Simulation Logic: Sugar
  useEffect(() => {
    if (activeTab !== 'sugar') return;
    const currentSolubility = 200 + 2 * waterTemp;
    if (!isSupersaturated) {
      const expected = Math.min(sugarAdded, currentSolubility);
      if (sugarDissolved !== expected) setSugarDissolved(expected);
    } else {
      if (currentSolubility >= sugarDissolved) setIsSupersaturated(false);
    }
  }, [waterTemp, sugarAdded, isSupersaturated, sugarDissolved, activeTab]);

  const addSugar = () => {
    setEquation(['C12H22O11(s)']);
    setTimeout(() => setEquation(['C12H22O11(s)', '+', 'H2O(l)']), 500);
    setTimeout(() => {
      setSugarAdded(prev => prev + 40);
      setEquation(['C12H22O11(s)', '+', 'H2O(l)', '→', 'C12H22O11(aq)']);
    }, 1000);
  };

  const triggerCrystallization = () => {
    if (isSupersaturated) {
      const currentSolubility = 200 + 2 * waterTemp;
      setSugarDissolved(currentSolubility);
      setIsSupersaturated(false);
      setEquation(['C12H22O11(aq)', '→', 'C12H22O11(s) ↓']);
    }
  };

  const logSugarData = () => {
    setSugarData(prev => [...prev, {
      id: Date.now(),
      temp: waterTemp,
      dissolved: sugarDissolved,
      state: isSupersaturated ? 'Supersaturated' : (sugarAdded > sugarDissolved ? 'Saturated' : 'Unsaturated')
    }]);
  };

  // Simulation Logic: CuSO4
  useEffect(() => {
    if (activeTab !== 'cuso4') return;
    const interval = setInterval(() => {
      setCuso4Temp(t => {
        if (heaterOn) return Math.min(t + 4, 300);
        return Math.max(t - 2, 20);
      });
    }, 200);
    return () => clearInterval(interval);
  }, [heaterOn, activeTab]);

  useEffect(() => {
    if (activeTab !== 'cuso4') return;
    if (cuso4Temp > 100 && cuso4Mass > 159.5) {
      const rate = (cuso4Temp - 100) * 0.05;
      setCuso4Mass(m => {
        const newMass = Math.max(m - rate, 159.5);
        if (newMass < m && Math.random() < 0.2) {
           setEquation(['CuSO4·5H2O(s)', '→', 'CuSO4(s)', '+', '5H2O(g)']);
        }
        return newMass;
      });
    }
  }, [cuso4Temp, cuso4Mass, activeTab]);

  const logCuso4Data = () => {
    setCuso4Data(prev => [...prev, { id: Date.now(), temp: Math.round(cuso4Temp), mass: Number(cuso4Mass.toFixed(1)) }]);
  };

  const checkAnswer = () => {
    if (activeTab === 'sugar') {
      const val = parseFloat(answer);
      if (Math.abs(val - 300) < 5) setFeedback("Correct! The solubility is 300g/100mL at 50°C.");
      else setFeedback("Incorrect. Use the linear trend or equation: S = 200 + 2T.");
    } else {
      const val = parseFloat(answer);
      if (Math.abs(val - 36.1) < 0.5) setFeedback("Correct! Water is 90g out of 249.5g total, which is ~36.1%.");
      else setFeedback("Incorrect. Calculate mass of 5H2O divided by molar mass of CuSO4·5H2O.");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none">
      <LabHeader onExit={onExit} variant="blue" title="Grade 9 Chemistry: States of Matter & Solutions" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-grow">
        {/* Theory Column */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center text-blue-800"><ClipboardList className="mr-2" /> Theory & Setup</h2>
          {activeTab === 'sugar' ? (
            <div className="space-y-4 text-slate-700 dark:text-slate-200">
              <p><strong>Solutions:</strong> A solution is formed when a solute dissolves in a solvent. The maximum amount of solute that can dissolve at a given temperature is its solubility.</p>
              <ul className="list-disc pl-5">
                <li><strong>Unsaturated:</strong> Can dissolve more solute.</li>
                <li><strong>Saturated:</strong> Contains the maximum dissolved solute.</li>
                <li><strong>Supersaturated:</strong> Contains more dissolved solute than theoretically possible at that temperature (highly unstable).</li>
              </ul>
              <p><strong>Experiment:</strong> Add sugar to 100mL of water. Heat the water to dissolve more sugar, then cool it slowly. Notice what happens when you add a seed crystal to a supersaturated solution!</p>
            </div>
          ) : (
            <div className="space-y-4 text-slate-700 dark:text-slate-200">
              <p><strong>Water of Crystallization:</strong> Many salts form hydrated crystals containing trapped water molecules (e.g., Copper(II) Sulfate Pentahydrate, CuSO₄·5H₂O).</p>
              <p>When heated above 100°C, the water evaporates, leaving behind the anhydrous salt, which often has a different color (blue to white for CuSO₄).</p>
              <p><strong>Experiment:</strong> Heat 249.5g (1 mole) of hydrated Copper Sulfate. Observe the mass change as water escapes as steam.</p>
            </div>
          )}
        </div>

        {/* Simulation Column */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 flex items-center text-blue-800 w-full"><Beaker className="mr-2" /> Interactive Simulator</h2>
          
          <EquationDisplay equation={equation} />

          {activeTab === 'sugar' ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex gap-4 mb-8">
                <ChemicalBottle label="Sugar (Sucrose)" color="#e2e8f0" onClick={addSugar} />
              </div>
              
              <div className="relative w-48 h-64 border-4 border-gray-300 rounded-b-3xl rounded-t-sm flex items-end justify-center bg-blue-50 overflow-hidden shadow-inner">
                <div className="absolute top-2 text-xs font-bold text-gray-500">100 mL Water</div>
                {/* Dissolved sugar indicated by color darkness */}
                <div className="w-full transition-all duration-1000" style={{ height: '80%', backgroundColor: `rgba(59, 130, 246, ${0.2 + (sugarDissolved/400)*0.5})` }}></div>
                {/* Solid sugar at bottom */}
                {(sugarAdded > sugarDissolved) && (
                  <div className="absolute bottom-0 w-full bg-slate-50 dark:bg-slate-900 opacity-90 border-t border-gray-200" style={{ height: `${Math.min((sugarAdded - sugarDissolved)/2, 20)}%` }}></div>
                )}
                <Thermometer className="absolute right-2 top-10 text-red-500" size={32} />
                <div className="absolute right-10 top-12 text-sm font-bold text-red-600">{waterTemp}°C</div>
              </div>

              <div className="mt-6 w-full max-w-xs space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">Water Temperature: {waterTemp}°C</label>
                  <input type="range" min="20" max="100" value={waterTemp} onChange={(e) => setWaterTemp(Number(e.target.value))} className="w-full" />
                </div>
                {isSupersaturated && (
                  <button onClick={triggerCrystallization} className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 animate-pulse font-bold">Add Seed Crystal</button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="relative mt-10">
                 {/* Crucible */}
                 <div className="w-32 h-24 bg-gray-300 rounded-b-full border-t-[16px] border-gray-400 relative flex justify-center items-end pb-2 shadow-xl">
                    <div className="w-24 h-16 rounded-b-full transition-colors duration-1000" style={{ backgroundColor: cuso4Mass > 165 ? '#3b82f6' : '#f8fafc' }}></div>
                 </div>
                 {/* Heater */}
                 <div className="w-40 h-8 bg-gray-800 mt-2 rounded flex justify-center items-center">
                    {heaterOn && <Flame className="text-orange-500 animate-bounce" size={24} />}
                 </div>
              </div>
              
              <div className="mt-8 text-center bg-gray-100 p-4 rounded border border-gray-300 w-full max-w-xs">
                 <div className="text-2xl font-mono text-green-700">{cuso4Mass.toFixed(1)} g</div>
                 <div className="text-sm text-gray-500">Digital Balance</div>
                 <div className="text-md font-bold text-red-600 mt-2">{Math.round(cuso4Temp)} °C</div>
              </div>

              <div className="mt-6 w-full max-w-xs flex gap-2">
                 <button onClick={() => setHeaterOn(!heaterOn)} className={`flex-1 py-2 text-white rounded font-bold ${heaterOn ? 'bg-red-600' : 'bg-green-600'}`}>
                    {heaterOn ? 'Turn Heater OFF' : 'Turn Heater ON'}
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Data & Assessment Column */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col">
          <h2 className="text-xl font-bold mb-4 flex items-center text-blue-800"><CheckCircle className="mr-2" /> Data & Assessment</h2>
          
          <button onClick={activeTab === 'sugar' ? logSugarData : logCuso4Data} className="mb-4 w-full py-2 bg-blue-100 text-blue-800 rounded font-bold hover:bg-blue-200 flex items-center justify-center">
            <Play className="mr-2" size={16} /> Record Measurement
          </button>

          <div className="flex-grow overflow-y-auto mb-4 border rounded">
            {activeTab === 'sugar' ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr><th className="p-2">Temp (°C)</th><th className="p-2">Dissolved (g)</th><th className="p-2">State</th></tr>
                </thead>
                <tbody>
                  {sugarData.map(d => (
                    <tr key={d.id} className="border-t"><td className="p-2">{d.temp}</td><td className="p-2">{d.dissolved}</td><td className="p-2">{d.state}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr><th className="p-2">Temp (°C)</th><th className="p-2">Mass (g)</th></tr>
                </thead>
                <tbody>
                  {cuso4Data.map(d => (
                    <tr key={d.id} className="border-t"><td className="p-2">{d.temp}</td><td className="p-2">{d.mass}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mb-4">
             <SvgGraph 
                data={activeTab === 'sugar' ? sugarData : cuso4Data} 
                xKey="temp" 
                yKey={activeTab === 'sugar' ? 'dissolved' : 'mass'} 
                xLabel="Temperature (°C)" 
                yLabel={activeTab === 'sugar' ? 'Dissolved Sugar (g)' : 'Mass (g)'} 
             />
          </div>

          <div className="bg-blue-50 p-4 rounded border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Analysis</h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
              {activeTab === 'sugar' 
                ? "Based on the linear trend of your data, calculate the theoretical solubility of sugar at 50 °C (in g)." 
                : "Calculate the theoretical percentage by mass of water in CuSO₄·5H₂O. (Cu=63.5, S=32, O=16, H=1)."}
            </p>
            <div className="flex gap-2">
              <input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter value..." className="flex-grow p-2 border rounded" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Check</button>
            </div>
            {feedback && <div className={`mt-2 text-sm font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
