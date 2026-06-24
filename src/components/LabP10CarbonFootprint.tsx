import  { useState, useEffect } from 'react';
import {Play, Plus, CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10CarbonFootprint({ onExit }: LabProps) {
  // State
  const [mode, setMode] = useState<string>('Car');
  const [distance, setDistance] = useState<number>(10);
  const [passengers, setPassengers] = useState<number>(1);
  
  const [isDriving, setIsDriving] = useState(false);
  const [driveProgress, setDriveProgress] = useState(0);
  
  const [dataLog, setDataLog] = useState<{id: number, mode: string, dist: number, pax: number, totalCO2: number, perPaxCO2: number}[]>([]);
  
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const modes: Record<string, { factor: number, maxPax: number, emoji: string, name: string }> = {
    'Bike': { factor: 0, maxPax: 1, emoji: '🚲', name: 'Bicycle / Walk' },
    'Car': { factor: 0.2, maxPax: 5, emoji: '🚗', name: 'Standard Car' },
    'SUV': { factor: 0.35, maxPax: 7, emoji: '🚙', name: 'Large SUV' },
    'Bus': { factor: 0.8, maxPax: 50, emoji: '🚌', name: 'City Bus' },
  };

  // Clamp passengers when mode changes
  useEffect(() => {
    if (passengers > modes[mode].maxPax) {
      setPassengers(modes[mode].maxPax);
    }
  }, [mode, passengers, modes]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isDriving) {
      timer = setInterval(() => {
        setDriveProgress(p => {
          if (p >= 100) {
            setIsDriving(false);
            return 100;
          }
          return p + 2;
        });
      }, 30);
    }
    return () => clearInterval(timer);
  }, [isDriving]);

  const handleDrive = () => {
    if (isDriving) return;
    setDriveProgress(0);
    setIsDriving(true);
  };

  const handleRecord = () => {
    const totalCO2 = distance * modes[mode].factor;
    const perPaxCO2 = totalCO2 / passengers;
    setDataLog(prev => [...prev, { id: Date.now(), mode, dist: distance, pax: passengers, totalCO2, perPaxCO2 }]);
  };

  const checkAnswer = () => {
    // Question: What is the per-passenger CO2 footprint (in kg) for a 15 km trip in an SUV (0.35 kg/km) carrying 3 passengers?
    const expected = (15 * 0.35) / 3; // 1.75
    const ans = parseFloat(studentAnswer);
    if (!isNaN(ans) && Math.abs(ans - expected) < 0.05) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const currentTotal = distance * modes[mode].factor;
  const simulatedEmissions = (driveProgress / 100) * currentTotal;

  // Max for graph
  const maxPerPax = Math.max(0.5, ...dataLog.map(d => d.perPaxCO2));

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Carbon Footprint of Transport" subtitle="Investigate the environmental impact of commuting and the benefits of carpooling/public transit." />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory & Setup</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Combustion of fossil fuels in vehicles releases Carbon Dioxide (CO₂), a greenhouse gas. 
              The total emissions depend on the distance traveled and the vehicle's emission factor. 
              <strong>Per-capita emissions</strong> are found by dividing the total emissions by the number of passengers.
            </p>
            <div className="bg-emerald-50 p-3 rounded-lg flex items-start gap-2 border border-emerald-100">
              <Info className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-800">
                Formula: <br />
                <code className="bg-emerald-100 px-1 rounded">Total CO₂ = Distance × Emission Factor</code><br />
                <code className="bg-emerald-100 px-1 rounded mt-1 inline-block">Per-Passenger = Total CO₂ / Passengers</code>
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Transport Mode</label>
              <select 
                value={mode} 
                onChange={(e) => { setMode(e.target.value); setDriveProgress(0); }}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(modes).map(([key, m]) => (
                  <option key={key} value={key}>{m.name} ({m.factor} kg/km)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                <span>Trip Distance</span>
                <span className="text-emerald-700">{distance} km</span>
              </label>
              <input 
                type="range" min="1" max="50" step="1" 
                value={distance} 
                onChange={(e) => { setDistance(Number(e.target.value)); setDriveProgress(0); }}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                <span>Number of Passengers</span>
                <span className="text-emerald-700">{passengers}</span>
              </label>
              <input 
                type="range" min="1" max={modes[mode].maxPax} step="1" 
                value={passengers} 
                onChange={(e) => { setPassengers(Number(e.target.value)); setDriveProgress(0); }}
                className="w-full accent-emerald-600"
              />
              <p className="text-xs text-slate-500 mt-1">Max capacity for {modes[mode].name} is {modes[mode].maxPax}.</p>
            </div>
          </div>
          
          <div className="mt-auto">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Assessment</h3>
            <p className="text-xs text-slate-600 mb-3">
              Calculate the per-passenger CO₂ footprint (in kg) for a 15 km trip in an SUV (0.35 kg/km) carrying 3 passengers.
            </p>
            <div className="flex gap-2">
              <input 
                type="number" step="0.01"
                placeholder="e.g. 1.25"
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
              />
              <button 
                onClick={checkAnswer}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
              >
                Check
              </button>
            </div>
            {isCorrect === true && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Correct! Excellent.</p>}
            {isCorrect === false && <p className="text-red-500 text-xs mt-2">Incorrect. Check your math: (Distance × Factor) / Passengers.</p>}
          </div>
        </div>

        {/* Middle Column: Simulation */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between gap-4 mb-4">
             <div className="flex-1 text-center bg-slate-100 p-3 rounded-lg border border-slate-200">
               <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Emitted</p>
               <p className="text-2xl font-mono text-slate-800">{simulatedEmissions.toFixed(2)} <span className="text-sm">kg</span></p>
             </div>
             <div className="flex-1 text-center bg-emerald-50 p-3 rounded-lg border border-emerald-200">
               <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider">Per Passenger</p>
               <p className="text-2xl font-mono text-emerald-700">{((simulatedEmissions) / passengers).toFixed(2)} <span className="text-sm">kg</span></p>
             </div>
          </div>

          <div className="relative flex-1 w-full bg-sky-100 rounded-xl overflow-hidden border border-sky-200 min-h-[250px] flex items-end">
            {/* Background elements */}
            <div className="absolute top-10 left-10 text-4xl opacity-50">☁️</div>
            <div className="absolute top-20 right-20 text-4xl opacity-50">☁️</div>
            <div className="absolute top-5 right-5 text-yellow-400 text-5xl">☀️</div>
            
            {/* Road */}
            <div className="w-full h-1/3 bg-slate-700 relative">
              {/* Road lines */}
              <div className="absolute top-1/2 w-full flex justify-around">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-8 h-2 bg-slate-50 opacity-50 rounded-sm"></div>
                ))}
              </div>

              {/* Vehicle & Exhaust */}
              <div 
                className="absolute bottom-4 text-6xl transition-all duration-75"
                style={{ left: `${-10 + driveProgress}%` }}
              >
                {modes[mode].emoji}
                
                {/* Exhaust clouds */}
                {mode !== 'Bike' && isDriving && driveProgress > 5 && driveProgress % 4 < 2 && (
                  <div className="absolute -left-8 bottom-0 text-3xl animate-ping opacity-60">
                    💨
                  </div>
                )}
                {/* Visual CO2 accumulation representation */}
                {mode !== 'Bike' && (
                  <div 
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap opacity-80"
                  >
                    +{(simulatedEmissions).toFixed(1)} kg CO₂
                  </div>
                )}
              </div>
            </div>
            
            {/* Distance Marker */}
            <div className="absolute bottom-2 right-4 text-white text-sm font-bold opacity-80">
              {distance} km
            </div>
          </div>

          <div className="flex gap-4 mt-4 w-full justify-center">
            <button 
              onClick={handleDrive}
              disabled={isDriving}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                isDriving ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'
              } disabled:opacity-50`}
            >
              <Play className="w-5 h-5"/> Drive!
            </button>
            <button 
              onClick={handleRecord}
              disabled={isDriving || driveProgress < 100}
              className="flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all disabled:opacity-50"
            >
              <Plus className="w-5 h-5"/> Record
            </button>
          </div>
        </div>

        {/* Right Column: Data & Graph */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800">Results & Comparison</h2>
          
          <div className="h-48 border border-slate-200 rounded-lg overflow-y-auto bg-slate-50">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700">Mode</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Pax</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Total (kg)</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Per Pax (kg)</th>
                </tr>
              </thead>
              <tbody>
                {dataLog.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">No scenarios recorded. Drive and record to compare.</td></tr>
                ) : (
                  dataLog.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-100 transition-colors">
                      <td className="px-3 py-1.5">{modes[row.mode].emoji} {row.mode}</td>
                      <td className="px-3 py-1.5">{row.pax}</td>
                      <td className="px-3 py-1.5 font-mono text-slate-600">{row.totalCO2.toFixed(2)}</td>
                      <td className="px-3 py-1.5 font-mono text-emerald-600 font-bold">{row.perPaxCO2.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 relative min-h-[200px] flex items-end justify-around pb-8 pt-4">
             {dataLog.length === 0 ? (
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic">Bar Chart: Per-Passenger CO₂</div>
             ) : (
               <>
                 {/* Y Axis line */}
                 <div className="absolute left-8 top-4 bottom-8 w-px bg-slate-300"></div>
                 <div className="absolute left-8 bottom-8 right-4 h-px bg-slate-300"></div>
                 
                 {/* Max Label */}
                 <div className="absolute left-1 top-4 text-[10px] text-slate-500">{maxPerPax.toFixed(1)}</div>
                 <div className="absolute left-4 bottom-8 text-[10px] text-slate-500">0</div>
                 <div className="absolute -left-4 top-1/2 -rotate-90 text-xs text-slate-500 whitespace-nowrap">Per-Pax CO₂ (kg)</div>

                 {/* Bars */}
                 {dataLog.map((row) => {
                   const heightPct = (row.perPaxCO2 / maxPerPax) * 100;
                   return (
                     <div key={row.id} className="relative w-8 mx-2 group z-10 flex flex-col justify-end h-full">
                       <div 
                         className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out"
                         style={{ height: `${heightPct}%` }}
                       >
                         {/* Tooltip */}
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                           {row.perPaxCO2.toFixed(2)} kg
                         </div>
                       </div>
                       <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm">
                         {modes[row.mode].emoji}
                       </div>
                     </div>
                   );
                 })}
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
