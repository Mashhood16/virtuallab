import { useState, useEffect } from 'react';
import { ArrowLeft, Thermometer, Wind, Sun, Moon, Play, RotateCcw, CheckCircle, Info, Flame, Droplet, Activity, Save } from 'lucide-react';

export default function LabB9PlantPhysiology({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState<'Potometer' | 'Hydrilla' | 'Indicator'>('Potometer');

  // Potometer State
  const [temp, setTemp] = useState(25);
  const [wind, setWind] = useState(0);
  const [bubblePos, setBubblePos] = useState(0);
  const [potometerRunning, setPotometerRunning] = useState(false);

  // Hydrilla State
  const [lightIntensity, setLightIntensity] = useState(50);
  const [gasVolume, setGasVolume] = useState(0);
  const [hydrillaRunning, setHydrillaRunning] = useState(false);
  const [matchstickState, setMatchstickState] = useState<'hidden' | 'testing' | 'pop'>('hidden');

  // Indicator State
  const [isLight, setIsLight] = useState(true);
  const [indicatorTime, setIndicatorTime] = useState(0);
  const [indicatorRunning, setIndicatorRunning] = useState(false);

  // Assessment & Data
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [feedback, setFeedback] = useState('');
  const [dataPoints, setDataPoints] = useState<{ id: number; type: string; val1: string; val2: string; result: string }[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (potometerRunning && activeTab === 'Potometer') {
      interval = setInterval(() => {
        setBubblePos(p => {
          const rate = Math.max(0.1, (temp - 10) * 0.05 + wind * 0.2);
          if (p + rate >= 100) {
            setPotometerRunning(false);
            return 100;
          }
          return p + rate;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [potometerRunning, temp, wind, activeTab]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (hydrillaRunning && activeTab === 'Hydrilla') {
      interval = setInterval(() => {
        setGasVolume(p => {
          const rate = lightIntensity * 0.02;
          if (p + rate >= 100) {
            setHydrillaRunning(false);
            return 100;
          }
          return p + rate;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [hydrillaRunning, lightIntensity, activeTab]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (indicatorRunning && activeTab === 'Indicator') {
      interval = setInterval(() => {
        setIndicatorTime(p => {
          if (p >= 100) {
            setIndicatorRunning(false);
            return 100;
          }
          return p + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [indicatorRunning, activeTab]);

  useEffect(() => {
    setIndicatorTime(0);
    setIndicatorRunning(false);
  }, [isLight]);

  const handleTestGas = () => {
    if (gasVolume > 30) {
      setMatchstickState('testing');
      setTimeout(() => setMatchstickState('pop'), 1500);
      setTimeout(() => { setMatchstickState('hidden'); setGasVolume(0); }, 3500);
    } else {
      setMatchstickState('hidden');
    }
  };

  const recordData = () => {
    let newDp;
    if (activeTab === 'Potometer') {
      newDp = { id: Date.now(), type: 'Transpiration', val1: `${temp}°C`, val2: `Wind: ${wind}`, result: `${Math.round(bubblePos)}mm` };
    } else if (activeTab === 'Hydrilla') {
      newDp = { id: Date.now(), type: 'Photosynthesis', val1: `Light: ${lightIntensity}%`, val2: '-', result: `${Math.round(gasVolume)}mL O2` };
    } else {
      newDp = { id: Date.now(), type: 'Respiration', val1: isLight ? 'Light' : 'Dark', val2: '-', result: `Time: ${Math.round(indicatorTime)}s` };
    }
    setDataPoints(prev => [...prev, newDp]);
  };

  const checkAnswers = () => {
    let correct = 0;
    if (q1.trim().toLowerCase().includes('increase')) correct++;
    if (q2.trim().toLowerCase() === 'oxygen' || q2.trim().toLowerCase() === 'o2') correct++;
    if (q3.trim().toLowerCase() === 'respiration') correct++;
    
    if (correct === 3) setFeedback('Excellent! All correct.');
    else setFeedback(`You got ${correct} out of 3 correct. Review your simulations.`);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <button onClick={onExit} className="p-2 hover:bg-emerald-600 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Virtual Lab: Plant Physiology</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6" />
          <span className="font-semibold">Biology B9</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column: Theory & Setup */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-2">
              <Info className="w-5 h-5 mr-2 text-emerald-600" />
              Theory & Context
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Plants perform essential physiological processes: <strong>Transpiration</strong> (water loss), <strong>Photosynthesis</strong> (producing oxygen in light), and <strong>Respiration</strong> (producing CO₂ continuously).
            </p>
          </div>

          <div className="space-y-4 flex-1">
            <h3 className="font-bold text-gray-700">Lab Setup: {activeTab}</h3>
            
            {activeTab === 'Potometer' && (
              <>
                <div className="space-y-2 pt-4">
                  <label className="flex justify-between text-sm font-medium text-gray-700">
                    <span className="flex items-center"><Thermometer className="w-4 h-4 mr-1 text-red-500" /> Temperature (°C)</span>
                    <span>{temp}°C</span>
                  </label>
                  <input type="range" min="10" max="40" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full accent-emerald-600" />
                </div>
                <div className="space-y-2 pt-4">
                  <label className="flex justify-between text-sm font-medium text-gray-700">
                    <span className="flex items-center"><Wind className="w-4 h-4 mr-1 text-slate-500" /> Wind Speed</span>
                    <span>{wind}</span>
                  </label>
                  <input type="range" min="0" max="10" value={wind} onChange={(e) => setWind(Number(e.target.value))} className="w-full accent-emerald-600" />
                </div>
              </>
            )}

            {activeTab === 'Hydrilla' && (
              <div className="space-y-2 pt-4">
                <label className="flex justify-between text-sm font-medium text-gray-700">
                  <span className="flex items-center"><Sun className="w-4 h-4 mr-1 text-yellow-500" /> Light Intensity (%)</span>
                  <span>{lightIntensity}%</span>
                </label>
                <input type="range" min="0" max="100" value={lightIntensity} onChange={(e) => setLightIntensity(Number(e.target.value))} className="w-full accent-emerald-600" />
              </div>
            )}

            {activeTab === 'Indicator' && (
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">Environment State</label>
                <div className="flex space-x-2">
                  <button onClick={() => setIsLight(true)} className={`flex-1 py-2 flex justify-center items-center rounded-md text-sm font-semibold transition-colors ${isLight ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </button>
                  <button onClick={() => setIsLight(false)} className={`flex-1 py-2 flex justify-center items-center rounded-md text-sm font-semibold transition-colors ${!isLight ? 'bg-slate-700 text-white border-2 border-slate-900' : 'bg-gray-100 text-gray-600'}`}>
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Middle Column: Simulator */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex space-x-2 mb-4">
            <button onClick={() => {setActiveTab('Potometer'); setBubblePos(0); setPotometerRunning(false);}} className={`px-2 py-2 flex-1 rounded-lg text-xs font-semibold transition ${activeTab === 'Potometer' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}><Droplet className="w-4 h-4 inline mr-1" /> Potometer</button>
            <button onClick={() => {setActiveTab('Hydrilla'); setGasVolume(0); setHydrillaRunning(false);}} className={`px-2 py-2 flex-1 rounded-lg text-xs font-semibold transition ${activeTab === 'Hydrilla' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}><Sun className="w-4 h-4 inline mr-1" /> Hydrilla</button>
            <button onClick={() => {setActiveTab('Indicator'); setIndicatorTime(0); setIndicatorRunning(false);}} className={`px-2 py-2 flex-1 rounded-lg text-xs font-semibold transition ${activeTab === 'Indicator' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}><Activity className="w-4 h-4 inline mr-1" /> Indicator</button>
          </div>

          <div className="relative bg-slate-100 rounded-xl aspect-video overflow-hidden border-2 border-slate-200 flex-1 flex flex-col items-center justify-center p-4">
            {activeTab === 'Potometer' && (
              <svg viewBox="0 0 400 300" className="w-full h-full">
                 <path d="M 50 180 L 50 280 L 150 280 L 150 180" fill="none" stroke="#94a3b8" strokeWidth="4" />
                 <rect x="52" y="200" width="96" height="78" fill="#bae6fd" opacity="0.6" />
                 <path d="M 100 180 L 100 250 L 350 250" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                 <path d="M 100 180 L 100 250 L 350 250" fill="none" stroke="#bae6fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                 
                 {/* Plant */}
                 <path d="M 100 180 Q 80 120 120 60" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
                 <path d="M 105 150 Q 140 140 130 110" fill="#22c55e" />
                 <path d="M 95 130 Q 60 120 70 90" fill="#22c55e" />
                 <path d="M 112 100 Q 150 90 140 60" fill="#22c55e" />
                 
                 {/* Ruler */}
                 {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`tick-${i}`} x1={150 + i * 18} y1="260" x2={150 + i * 18} y2="265" stroke="black" strokeWidth="2" />
                 ))}
                 
                 {/* Bubble */}
                 <circle cx={150 + (bubblePos / 100) * 180} cy="250" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                 
                 {/* Wind effect */}
                 {wind > 0 && potometerRunning && (
                    <g opacity="0.5">
                      <animateTransform attributeName="transform" type="translate" values="-20,0; 20,0" dur={`${2/wind}s`} repeatCount="indefinite" />
                      <path d="M 10 100 Q 30 90 50 100" fill="none" stroke="#9ca3af" strokeWidth="2" />
                      <path d="M 20 120 Q 40 110 60 120" fill="none" stroke="#9ca3af" strokeWidth="2" />
                    </g>
                 )}
              </svg>
            )}
            
            {activeTab === 'Hydrilla' && (
              <svg viewBox="0 0 400 300" className="w-full h-full">
                 {/* Lamp */}
                 <rect x="20" y="50" width="40" height="80" rx="10" fill="#64748b" />
                 <polygon points="60,70 100,50 100,130 60,110" fill={`rgba(253, 224, 71, ${lightIntensity / 100})`} />
                 
                 {/* Beaker */}
                 <path d="M 150 100 L 150 280 L 300 280 L 300 100" fill="none" stroke="#94a3b8" strokeWidth="4" />
                 <rect x="152" y="120" width="146" height="158" fill="#bae6fd" opacity="0.6" />
                 
                 {/* Hydrilla Plant */}
                 <path d="M 225 270 Q 210 240 230 200 Q 210 170 225 150" fill="none" stroke="#15803d" strokeWidth="6" />
                 <path d="M 225 250 Q 200 240 210 230" fill="none" stroke="#22c55e" strokeWidth="4" />
                 <path d="M 225 220 Q 250 210 240 200" fill="none" stroke="#22c55e" strokeWidth="4" />
                 <path d="M 225 180 Q 200 170 210 160" fill="none" stroke="#22c55e" strokeWidth="4" />
                 
                 {/* Funnel & Tube */}
                 <path d="M 180 250 L 270 250 L 240 140 L 210 140 Z" fill="none" stroke="#e2e8f0" strokeWidth="3" opacity="0.8" />
                 <rect x="210" y="40" width="30" height="100" rx="4" fill="none" stroke="#e2e8f0" strokeWidth="3" opacity="0.8" />
                 
                 {/* Gas collected */}
                 <rect x="212" y="42" width="26" height={gasVolume} fill="#f8fafc" opacity="0.9" />
                 
                 {/* Bubbles animation */}
                 {hydrillaRunning && lightIntensity > 0 && gasVolume < 100 && (
                    <g>
                      <animateTransform attributeName="transform" type="translate" values="0,150; 0,50" dur={`${100/(lightIntensity+1)}s`} repeatCount="indefinite" />
                      <circle cx="220" cy="0" r="3" fill="#ffffff" opacity="0.8" />
                      <circle cx="230" cy="10" r="2" fill="#ffffff" opacity="0.8" />
                      <circle cx="225" cy="-10" r="2.5" fill="#ffffff" opacity="0.8" />
                    </g>
                 )}

                 {/* Matchstick test */}
                 {matchstickState !== 'hidden' && (
                   <g transform="translate(225, 20)">
                     <rect x="-2" y="-30" width="4" height="40" fill="#d97706" />
                     {matchstickState === 'testing' && <circle cx="0" cy="-30" r="4" fill="#ef4444" opacity="0.8">
                       <animate attributeName="r" values="4;5;4" dur="0.2s" repeatCount="indefinite" />
                     </circle>}
                     {matchstickState === 'pop' && (
                       <g>
                         <path d="M 0 -30 Q -10 -45 0 -60 Q 10 -45 0 -30 Z" fill="#facc15" stroke="#ef4444" strokeWidth="2" />
                         <text x="0" y="-70" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">Relights!</text>
                       </g>
                     )}
                   </g>
                 )}
              </svg>
            )}

            {activeTab === 'Indicator' && (
              <svg viewBox="0 0 400 300" className="w-full h-full">
                 {/* Tube 1 (Control) */}
                 <rect x="100" y="80" width="40" height="180" rx="20" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                 <rect x="102" y="150" width="36" height="108" rx="18" fill="#ef4444" opacity="0.6" />
                 <text x="120" y="280" textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="bold">Control</text>

                 {/* Tube 2 (Leaf) */}
                 <rect x="250" y="80" width="40" height="180" rx="20" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                 <rect x="252" y="150" width="36" height="108" rx="18" fill={isLight ? `rgb(${239 - indicatorTime}, ${68 - indicatorTime*0.4}, ${68 + indicatorTime*1.5})` : `rgb(${239 + indicatorTime*0.1}, ${68 + indicatorTime*1.5}, ${68 - indicatorTime*0.5})`} opacity="0.6" />
                 <path d="M 270 180 Q 255 200 270 230 Q 285 200 270 180 Z" fill="#22c55e" />
                 <text x="270" y="280" textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="bold">Leaf</text>
                 
                 {/* Environment Icon */}
                 {isLight ? <Sun className="text-yellow-500 w-12 h-12" x="180" y="20" /> : <Moon className="text-slate-400 w-12 h-12" x="180" y="20" />}
              </svg>
            )}
          </div>

          <div className="flex justify-between items-center mt-4 space-x-2">
            <div className="flex space-x-2">
              {activeTab === 'Potometer' && (
                <button onClick={() => { setPotometerRunning(!potometerRunning); if(bubblePos >= 100) setBubblePos(0); }} className={`p-2 flex items-center rounded-lg text-sm font-semibold ${potometerRunning ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {potometerRunning ? <RotateCcw className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />} {potometerRunning ? 'Stop' : 'Start'}
                </button>
              )}
              {activeTab === 'Hydrilla' && (
                <>
                  <button onClick={() => { setHydrillaRunning(!hydrillaRunning); if(gasVolume >= 100) setGasVolume(0); }} className={`p-2 flex items-center rounded-lg text-sm font-semibold ${hydrillaRunning ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {hydrillaRunning ? <RotateCcw className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />} {hydrillaRunning ? 'Stop' : 'Start'}
                  </button>
                  <button onClick={handleTestGas} disabled={gasVolume < 30} className="p-2 flex items-center rounded-lg text-sm font-semibold bg-amber-100 text-amber-700 disabled:opacity-50">
                    <Flame className="w-4 h-4 mr-1" /> Test Gas
                  </button>
                </>
              )}
              {activeTab === 'Indicator' && (
                <button onClick={() => { setIndicatorRunning(!indicatorRunning); if(indicatorTime >= 100) setIndicatorTime(0); }} className={`p-2 flex items-center rounded-lg text-sm font-semibold ${indicatorRunning ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {indicatorRunning ? <RotateCcw className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />} {indicatorRunning ? 'Stop' : 'Start'}
                </button>
              )}
            </div>
            
            <button onClick={() => {
              if(activeTab === 'Potometer') { setBubblePos(0); setPotometerRunning(false); }
              if(activeTab === 'Hydrilla') { setGasVolume(0); setHydrillaRunning(false); }
              if(activeTab === 'Indicator') { setIndicatorTime(0); setIndicatorRunning(false); }
            }} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200" title="Reset">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Data & Assessment */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <Save className="w-5 h-5 mr-2 text-emerald-600" />
            Data Logging & Analysis
          </h2>
          
          <button onClick={recordData} className="w-full py-2 mb-4 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center">
            <CheckCircle className="w-4 h-4 mr-2" /> Record Data
          </button>

          <div className="overflow-y-auto max-h-40 mb-6 border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 py-2">Exp.</th>
                  <th className="px-2 py-2">Cond 1</th>
                  <th className="px-2 py-2">Cond 2</th>
                  <th className="px-2 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.map(dp => (
                  <tr key={dp.id} className="border-t">
                    <td className="px-2 py-1 font-medium">{dp.type.substring(0,5)}</td>
                    <td className="px-2 py-1">{dp.val1}</td>
                    <td className="px-2 py-1">{dp.val2}</td>
                    <td className="px-2 py-1 font-bold text-emerald-600">{dp.result}</td>
                  </tr>
                ))}
                {dataPoints.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-gray-400">No data recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="font-bold text-gray-700">Assessment</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">1. How does increasing wind affect the transpiration rate?</label>
                <input type="text" value={q1} onChange={(e) => setQ1(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="e.g. increases" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">2. What gas is collected in the Hydrilla test tube?</label>
                <input type="text" value={q2} onChange={(e) => setQ2(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="Name of gas..." />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">3. In the dark, the indicator turns yellow due to CO₂ production. What process causes this?</label>
                <input type="text" value={q3} onChange={(e) => setQ3(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="Process name..." />
              </div>
            </div>
            <button onClick={checkAnswers} className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors mt-2">
              Check Answers
            </button>
            {feedback && (
              <div className={`p-3 mt-2 rounded-lg text-sm font-medium ${feedback.includes('Excellent') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
