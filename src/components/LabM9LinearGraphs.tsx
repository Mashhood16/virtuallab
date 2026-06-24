import { useState, useEffect } from 'react';
import { CheckCircle, TrendingUp, Calculator, MapPin, HelpCircle, Trash2 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabM9LinearGraphs({ onExit }: LabProps) {
  const [rate, setRate] = useState<number>(2);
  const [base, setBase] = useState<number>(10);
  const [distance, setDistance] = useState<number>(15);

  const [logs, setLogs] = useState<{ d: number; c: number }[]>([]);
  const [targetDist, setTargetDist] = useState<number>(0);
  const [userAns, setUserAns] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setTargetDist(Math.floor(Math.random() * 15) + 30);
  }, []);

  const currentCost = rate * distance + base;

  const logData = () => {
    if (!logs.find((l) => l.d === distance)) {
      setLogs([...logs, { d: distance, c: currentCost }].sort((a, b) => a.d - b.d));
    }
  };

  const clearLogs = () => setLogs([]);

  const checkAns = () => {
    const expected = rate * targetDist + base;
    if (parseFloat(userAns) === expected) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const SVG_SIZE = 400;
  const MAX_X = 50;
  const MAX_Y = 250;
  const scaleX = SVG_SIZE / MAX_X;
  const scaleY = SVG_SIZE / MAX_Y;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-indigo-700 text-white p-4 shadow-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <LabHeader onExit={onExit} title="Lab M9.1: Linear Graphs in Real Contexts" />
          <div>
            <h1 className="text-xl font-bold">Lab M9.1: Linear Graphs in Real Contexts</h1>
            <p className="text-indigo-200 text-sm">Modeling Taxi Fares using y = mx + c</p>
          </div>
        </div>
        <TrendingUp size={28} className="text-indigo-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1 max-w-7xl mx-auto w-full">
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="text-indigo-600" size={20} />
            Linear Equations Theory
          </h2>
          <div className="prose prose-slate text-sm">
            <p>
              Linear graphs represent relationships with a constant rate of change.
              The standard form is <strong>y = mx + c</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>y (Dependent Variable):</strong> Total Cost.</li>
              <li><strong>x (Independent Variable):</strong> Distance Traveled.</li>
              <li><strong>m (Slope / Gradient):</strong> Rate per km.</li>
              <li><strong>c (y-intercept):</strong> Base fare (cost at 0 km).</li>
            </ul>
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="font-mono text-indigo-900 text-center text-lg">
                Cost = ({rate} × Distance) + {base}
              </p>
            </div>
            <p className="mt-4">
              Use the simulator to visualize how changing the base fare (y-intercept) and
              the rate per km (slope) alters the steepness and starting point of the graph.
            </p>
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={20} />
            Interactive Graph Plotter
          </h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <svg width={SVG_SIZE} height={SVG_SIZE} className="bg-slate-50 border border-slate-300 rounded-lg overflow-hidden">
              {/* Grid Lines */}
              {Array.from({ length: 11 }).map((_, i) => (
                <g key={`grid-${i}`}>
                  {/* Vertical lines every 5 units */}
                  <line x1={i * 5 * scaleX} y1={0} x2={i * 5 * scaleX} y2={SVG_SIZE} stroke="#e2e8f0" strokeWidth="1" />
                  {/* Horizontal lines every 25 units */}
                  <line x1={0} y1={SVG_SIZE - (i * 25 * scaleY)} x2={SVG_SIZE} y2={SVG_SIZE - (i * 25 * scaleY)} stroke="#e2e8f0" strokeWidth="1" />
                </g>
              ))}
              
              {/* Axes */}
              <line x1={0} y1={SVG_SIZE} x2={SVG_SIZE} y2={SVG_SIZE} stroke="#64748b" strokeWidth="4" />
              <line x1={0} y1={0} x2={0} y2={SVG_SIZE} stroke="#64748b" strokeWidth="4" />
              
              {/* Plotting the main line */}
              <line 
                x1={0} 
                y1={SVG_SIZE - (base * scaleY)} 
                x2={MAX_X * scaleX} 
                y2={SVG_SIZE - ((rate * MAX_X + base) * scaleY)} 
                stroke="#4f46e5" 
                strokeWidth="3" 
              />

              {/* Current Point */}
              <circle 
                cx={distance * scaleX} 
                cy={SVG_SIZE - (currentCost * scaleY)} 
                r={6} 
                fill="#ef4444" 
              />
              <text 
                x={distance * scaleX + 10} 
                y={SVG_SIZE - (currentCost * scaleY) - 10} 
                className="text-xs font-bold fill-slate-700"
              >
                ({distance}, {currentCost})
              </text>
            </svg>
            
            <div className="absolute bottom-2 right-2 text-xs text-slate-400 font-mono">
              X: Distance (km) | Y: Cost ($)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Base Fare (c): ${base}</label>
              <input type="range" min="0" max="50" step="5" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Rate/km (m): ${rate}</label>
              <input type="range" min="0.5" max="5" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 mb-1 block">Test Distance (x): {distance} km</label>
              <input type="range" min="0" max="40" step="1" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
          </div>
          
          <button onClick={logData} className="w-full py-2 bg-slate-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
            <MapPin size={18} /> Record Point ({distance}, {currentCost})
          </button>
        </div>

        {/* Column 3: Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-indigo-600" size={20} />
            Data Log & Assessment
          </h2>
          
          <div className="flex-1 border border-slate-200 rounded-lg overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 sticky top-0">
                <tr>
                  <th className="p-3">Distance (x)</th>
                  <th className="p-3">Cost (y)</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-slate-400 italic">No data recorded.</td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                      <td className="p-3 font-mono">{log.d} km</td>
                      <td className="p-3 font-mono">${log.c.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {logs.length > 0 && (
            <button onClick={clearLogs} className="text-xs text-red-500 flex items-center gap-1 self-start hover:underline">
              <Trash2 size={14} /> Clear Logs
            </button>
          )}

          <div className="mt-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">Knowledge Check</h3>
            <p className="text-sm text-indigo-800 mb-3">
              Given the current rate of <strong>${rate}/km</strong> and a base fare of <strong>${base}</strong>, calculate the total cost for a <strong>{targetDist} km</strong> trip.
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Total Cost ($)" 
                value={userAns}
                onChange={(e) => setUserAns(e.target.value)}
                className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={checkAns}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Check
              </button>
            </div>
            
            {isCorrect === true && (
              <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
                <CheckCircle size={16} /> Correct! Excellent calculation.
              </div>
            )}
            {isCorrect === false && (
              <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
                Incorrect. Remember: Cost = (Rate × Distance) + Base.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
