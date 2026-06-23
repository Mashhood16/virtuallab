import { useState, useEffect } from 'react';
import { ArrowLeft, TestTube, Thermometer, Droplets, Play, CheckCircle2, RotateCcw, Activity, LineChart, Table2 } from 'lucide-react';

export default function LabB12Digestive({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState<'starch' | 'protein'>('starch');
  
  // Starch Digestion State
  const [temperature, setTemperature] = useState(37);
  const [isDigesting, setIsDigesting] = useState(false);
  const [digestionLevel, setDigestionLevel] = useState(0); // 0 to 100
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [iodineAdded, setIodineAdded] = useState(false);
  
  // Protein Detection State
  const [proteinSample, setProteinSample] = useState<'egg' | 'water'>('egg');
  const [naohAdded, setNaohAdded] = useState(false);
  const [cuso4Added, setCuso4Added] = useState(false);

  // Data Logging & Assessment
  const [dataPoints, setDataPoints] = useState<{ temp: number; time: number }[]>([]);
  const [studentRate, setStudentRate] = useState('');
  const [rateStatus, setRateStatus] = useState<boolean | null>(null);

  // Simulation Loop for Starch Digestion
  useEffect(() => {
    let timer: number;
    if (isDigesting && digestionLevel < 100) {
      timer = window.setInterval(() => {
        setDigestionLevel(prev => {
          // Enzyme kinetics: Optimal at 37C. Denatures above 60C. Inactive near 0C.
          const diff = Math.abs(temperature - 37);
          let rate = 0;
          
          // Introduce +/- 2% noise to simulate real-world inaccuracy
          const noise = 1 + (Math.random() * 0.04 - 0.02);
          
          if (temperature >= 60 || temperature <= 0) {
            rate = 0;
          } else {
            rate = Math.max(0.2, 5 - diff * 0.15) * noise;
          }
          
          const next = prev + rate;
          return Math.min(100, next);
        });
        setTimeElapsed(prev => prev + 0.5);
      }, 500);
    } else if (digestionLevel >= 100 && isDigesting) {
      setIsDigesting(false);
    }
    return () => clearInterval(timer);
  }, [isDigesting, digestionLevel, temperature]);

  const resetStarch = () => {
    setIsDigesting(false);
    setDigestionLevel(0);
    setTimeElapsed(0);
    setIodineAdded(false);
  };

  const resetProtein = () => {
    setNaohAdded(false);
    setCuso4Added(false);
  };

  const getStarchColor = () => {
    if (!iodineAdded) return '#f8fafc'; // Clear/cloudy suspension
    if (digestionLevel < 80) return '#1e3a8a'; // Blue-black complex (starch present)
    return '#ca8a04'; // Yellow-brown (starch completely digested to maltose)
  };

  const getProteinColor = () => {
    if (naohAdded && cuso4Added) {
      return proteinSample === 'egg' ? '#9333ea' : '#bae6fd'; // Purple (peptide bonds) vs Light blue (Cu2+ ions)
    }
    if (cuso4Added) return '#bae6fd';
    return '#f8fafc';
  };

  const recordData = () => {
    if (digestionLevel >= 100) {
      setDataPoints(prev => [...prev, { temp: temperature, time: timeElapsed }]);
    }
  };

  const checkRate = () => {
    if (dataPoints.length === 0) return;
    const latestTime = dataPoints[dataPoints.length - 1].time;
    // Arbitrary rate formula for standard assessment: Rate = 1000 / Time
    const expectedRate = 1000 / latestTime;
    const userRate = parseFloat(studentRate);
    if (!isNaN(userRate) && Math.abs(userRate - expectedRate) < 1.0) {
      setRateStatus(true);
    } else {
      setRateStatus(false);
    }
  };

  const maxTemp = 100;
  const maxTime = Math.max(50, ...dataPoints.map(d => d.time)) || 50;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lab B12.1: Biochemical Tests</h1>
          <p className="text-sm text-slate-500">Enzyme Kinetics & Macromolecule Detection</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        {/* Left Column: Theory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5 text-blue-600"/> Theory & Context
          </h2>
          <div className="prose text-slate-700 text-sm flex flex-col gap-3">
            <p><strong>Salivary Amylase</strong> is an enzyme that catalyzes the hydrolysis of starch into maltose. Enzyme activity is highly dependent on temperature. The rate of reaction increases with temperature up to an optimum point (typically around 37°C in humans), beyond which the enzyme rapidly denatures and loses catalytic function.</p>
            <p><strong>Iodine Test:</strong> Iodine-potassium iodide (I₂-KI) forms an intense blue-black complex with amylose (a component of starch). When starch is fully digested into maltose, the iodine solution retains its natural yellow-brown color.</p>
            <p><strong>Biuret Test:</strong> Used for detecting the presence of peptide bonds. In the presence of peptides, copper(II) ions (Cu²⁺) in alkaline solution (NaOH) form a violet-colored coordination complex. A negative result yields a light blue color from the unreacted copper(II) sulfate.</p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
              <h3 className="font-semibold text-blue-800 text-sm mb-1">Key Objectives:</h3>
              <ul className="list-disc pl-4 text-blue-900 text-xs flex flex-col gap-1">
                <li>Determine the optimal temperature for amylase action.</li>
                <li>Observe the colorimetric changes indicative of starch digestion.</li>
                <li>Identify the presence of protein in biological samples.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Column: Simulator */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 w-full text-left mb-4 text-slate-800">
            <TestTube className="w-5 h-5 text-blue-600"/> Interactive Simulator
          </h2>
          
          <div className="flex gap-2 w-full mb-6">
            <button onClick={() => setActiveTab('starch')} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'starch' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Starch Digestion</button>
            <button onClick={() => setActiveTab('protein')} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'protein' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Protein Detection</button>
          </div>

          {activeTab === 'starch' ? (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-100">
                <label className="flex justify-between text-sm font-semibold mb-2 text-slate-700">
                  <span className="flex items-center gap-1"><Thermometer className="w-4 h-4"/> Temperature</span>
                  <span className="text-blue-600">{temperature}°C</span>
                </label>
                <input type="range" min="0" max="100" value={temperature} onChange={e => setTemperature(Number(e.target.value))} disabled={isDigesting || digestionLevel > 0} className="w-full accent-blue-600 cursor-pointer" />
              </div>

              {/* Visualization */}
              <div className="relative w-32 h-56 mt-2 mb-4">
                <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-lg transition-all duration-500">
                  <path d="M 30 10 L 30 160 A 20 20 0 0 0 70 160 L 70 10" fill="none" stroke="#cbd5e1" strokeWidth="6" />
                  <path d="M 33 80 L 33 160 A 17 17 0 0 0 67 160 L 67 80 Z" fill={getStarchColor()} className="transition-colors duration-1000" />
                  <path d="M 38 85 L 38 140" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                </svg>
                {isDigesting && (
                  <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                       <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col bg-blue-50 p-2 rounded border border-blue-100">
                  <span className="text-blue-700 font-semibold text-xs uppercase">Digestion</span>
                  <span className="font-mono font-bold text-lg text-blue-900">{digestionLevel.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 font-semibold text-xs uppercase">Time Elapsed</span>
                  <span className="font-mono font-bold text-lg text-slate-800">{timeElapsed.toFixed(1)} s</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <button onClick={() => setIsDigesting(true)} disabled={isDigesting || digestionLevel >= 100} className="flex items-center justify-center gap-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"><Play className="w-4 h-4"/> Add Amylase</button>
                <button onClick={() => setIodineAdded(true)} disabled={isDigesting} className="flex items-center justify-center gap-1 bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"><Droplets className="w-4 h-4"/> Add Iodine</button>
                <button onClick={resetStarch} className="col-span-2 flex items-center justify-center gap-1 bg-slate-200 text-slate-700 p-3 rounded-lg hover:bg-slate-300 font-medium transition-colors"><RotateCcw className="w-4 h-4"/> Reset Tube</button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
               <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-100">
                <label className="flex flex-col text-sm font-semibold mb-2 text-slate-700 gap-2">
                  <span>Select Sample</span>
                  <select value={proteinSample} onChange={e => setProteinSample(e.target.value as 'egg'|'water')} className="p-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-600 outline-none" disabled={naohAdded || cuso4Added}>
                    <option value="egg">Egg White Solution</option>
                    <option value="water">Distilled Water (Control)</option>
                  </select>
                </label>
              </div>

              <div className="relative w-32 h-56 mt-2 mb-4">
                <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-lg transition-all duration-500">
                  <path d="M 30 10 L 30 160 A 20 20 0 0 0 70 160 L 70 10" fill="none" stroke="#cbd5e1" strokeWidth="6" />
                  <path d="M 33 80 L 33 160 A 17 17 0 0 0 67 160 L 67 80 Z" fill={getProteinColor()} className="transition-colors duration-1000" />
                  <path d="M 38 85 L 38 140" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <button onClick={() => setNaohAdded(true)} disabled={naohAdded} className="flex items-center justify-center gap-1 bg-slate-600 text-white p-3 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"><Droplets className="w-4 h-4"/> Add NaOH</button>
                <button onClick={() => setCuso4Added(true)} disabled={!naohAdded || cuso4Added} className="flex items-center justify-center gap-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"><Droplets className="w-4 h-4"/> Add CuSO₄</button>
                <button onClick={resetProtein} className="col-span-2 flex items-center justify-center gap-1 bg-slate-200 text-slate-700 p-3 rounded-lg hover:bg-slate-300 font-medium transition-colors"><RotateCcw className="w-4 h-4"/> Reset Tube</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <LineChart className="w-5 h-5 text-blue-600"/> Data & Analysis
          </h2>
          
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
             <span className="text-sm text-slate-600 font-medium flex items-center gap-2"><Table2 className="w-4 h-4"/> Data Logger</span>
             <button onClick={recordData} disabled={activeTab !== 'starch' || digestionLevel < 100} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
               Record Measurement
             </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-40">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 border-b">Trial</th>
                  <th className="px-4 py-2 border-b">Temp (°C)</th>
                  <th className="px-4 py-2 border-b">Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.map((dp, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{i + 1}</td>
                    <td className="px-4 py-2">{dp.temp}</td>
                    <td className="px-4 py-2">{dp.time.toFixed(1)}</td>
                  </tr>
                ))}
                {dataPoints.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-slate-400 italic">No data recorded yet. Wait for 100% digestion to log data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* SVG Graph */}
          <div className="w-full h-48 bg-slate-50 rounded-lg relative border border-slate-200 mt-2">
            <h3 className="absolute top-2 left-2 text-xs font-semibold text-slate-500">Reaction Time vs Temperature</h3>
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-6">
              {/* axes */}
              <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1"/>
              <line x1="0" y1="100" x2="0" y2="0" stroke="#94a3b8" strokeWidth="1"/>
              
              {dataPoints.length > 1 && (
                <polyline 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="1.5" 
                  points={dataPoints.map(dp => `${(dp.temp / maxTemp) * 100},${100 - (dp.time / maxTime) * 100}`).join(' ')} 
                />
              )}
              
              {dataPoints.map((dp, i) => (
                <circle key={i} cx={(dp.temp / maxTemp) * 100} cy={100 - (dp.time / maxTime) * 100} r="2.5" fill="#ef4444" className="hover:r-4 transition-all cursor-pointer" />
              ))}
            </svg>
            <span className="absolute bottom-1 right-2 text-[10px] text-slate-400">Temp (°C)</span>
            <span className="absolute top-2 left-1 text-[10px] text-slate-400 -rotate-90 origin-left">Time (s)</span>
          </div>

          {/* Assessment Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
            <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Assessment</h3>
            <p className="text-xs text-blue-800 mb-3 leading-relaxed">
              Based on your latest recorded data point, calculate the average <strong>Rate of Reaction</strong>.
              <br/>
              <span className="font-mono bg-blue-100 px-1 rounded block mt-1">Formula: Rate = 1000 / Time (s)</span>
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Enter calculated rate..." 
                value={studentRate} 
                onChange={e => { setStudentRate(e.target.value); setRateStatus(null); }}
                className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={dataPoints.length === 0}
              />
              <button 
                onClick={checkRate} 
                disabled={dataPoints.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Verify
              </button>
            </div>
            {rateStatus !== null && (
              <div className={`mt-3 text-sm font-medium p-2 rounded ${rateStatus ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {rateStatus ? 'Correct! Excellent calculation.' : 'Incorrect. Check your formula and try again.'}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
