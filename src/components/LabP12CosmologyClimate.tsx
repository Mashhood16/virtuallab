import { useState } from 'react';
import { Star, Waves, Orbit } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP12CosmologyClimate({ onExit }: { onExit?: () => void }) {
  const [starTemp, setStarTemp] = useState(5800);
  const [velocityC, setVelocityC] = useState(0);

  const [oceanTemp, setOceanTemp] = useState(15);
  const [salinity, setSalinity] = useState(35);

  const [wienAns, setWienAns] = useState('');
  const [dopplerAns, setDopplerAns] = useState('');
  const [wienFeedback, setWienFeedback] = useState('');
  const [dopplerFeedback, setDopplerFeedback] = useState('');

  const density = 1000 + (salinity * 0.8) - ((oceanTemp - 4) * 0.2); 
  const downwelling = density > 1027;

  const getStarColor = (t: number) => {
    if (t < 4000) return '#ffaaaa'; 
    if (t < 6000) return '#ffddaa'; 
    if (t < 8000) return '#ffffff'; 
    return '#aaffff'; 
  };

  const getPeakWavelength = (t: number) => {
    return (2.898e-3 / t) * 1e9;
  };

  const getShiftedWavelength = (restLambda: number, vC: number) => {
    return restLambda * Math.sqrt((1 + vC) / (1 - vC));
  };

  const checkWien = () => {
    const v = parseFloat(wienAns);
    if (v >= 960 && v <= 970) setWienFeedback('Correct! ~966 nm');
    else setWienFeedback('Incorrect. Use λ = b / T where b = 2.898×10⁻³ m·K');
  };

  const checkDoppler = () => {
    const v = parseFloat(dopplerAns);
    if (v >= 720 && v <= 730) setDopplerFeedback('Correct! ~725 nm');
    else setDopplerFeedback('Incorrect. Use relativistic Doppler formula.');
  };

  const renderSpectrum = () => {
    const lines = [410, 434, 486, 656]; 
    return (
      <svg width="100%" height="60" className="bg-slate-900 rounded-lg mt-2">
        <defs>
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="purple" />
            <stop offset="20%" stopColor="blue" />
            <stop offset="40%" stopColor="cyan" />
            <stop offset="60%" stopColor="green" />
            <stop offset="80%" stopColor="yellow" />
            <stop offset="90%" stopColor="orange" />
            <stop offset="100%" stopColor="red" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#rainbow)" opacity="0.3" />
        
        {lines.map((l, i) => {
          const shifted = getShiftedWavelength(l, velocityC);
          const xRest = ((l - 380) / (750 - 380)) * 100;
          const xShift = ((shifted - 380) / (750 - 380)) * 100;
          
          return (
            <g key={i}>
              <line x1={`${xRest}%`} y1="0" x2={`${xRest}%`} y2="20" stroke="white" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
              {xShift >= 0 && xShift <= 100 && (
                <line x1={`${xShift}%`} y1="0" x2={`${xShift}%`} y2="60" stroke="black" strokeWidth="3" />
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab 12.2: Astrophysics & Climate Dynamics" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-0">
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">Theory</h2>
          
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <section>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Star size={16} className="text-amber-500"/> Wien's Displacement Law
              </h3>
              <p className="mt-1">
                A black body's temperature is inversely proportional to its peak emission wavelength.
                <br/><br/>
                <code className="bg-slate-100 p-1 rounded">λ_max = b / T</code>
                <br/><br/>
                where b = 2.898 × 10⁻³ m·K. Hotter stars appear blue; cooler stars appear red.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 mt-4">
                <Orbit size={16} className="text-blue-500"/> Doppler Red-Shift
              </h3>
              <p className="mt-1">
                As galaxies move away from us, their light waves are stretched (red-shifted). The relativistic Doppler formula is:
                <br/><br/>
                <code className="bg-slate-100 p-1 rounded">λ_obs = λ_rest × √((1 + v/c) / (1 - v/c))</code>
                <br/><br/>
                where v is positive for recession.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 mt-4">
                <Waves size={16} className="text-teal-500"/> Thermohaline Circulation
              </h3>
              <p className="mt-1">
                Ocean currents are driven by density gradients created by surface heat and freshwater fluxes. High salinity and low temperatures increase water density, causing it to sink (downwelling).
              </p>
            </section>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6 overflow-y-auto">
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Stellar Thermometer</h3>
            <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">
              Surface Temperature: {starTemp} K
            </label>
            <input 
              type="range" min="2000" max="15000" step="100" value={starTemp} 
              onChange={(e) => setStarTemp(Number(e.target.value))}
              className="w-full mb-4 accent-amber-500"
            />
            <div className="flex gap-4 items-center bg-slate-900 p-4 rounded-lg overflow-hidden">
               <div 
                 className="w-16 h-16 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] flex-shrink-0"
                 style={{ backgroundColor: getStarColor(starTemp), boxShadow: `0 0 ${starTemp/200}px ${getStarColor(starTemp)}` }}
               />
               <div className="text-white">
                 <p className="text-sm text-slate-300">Peak Wavelength (λ_max):</p>
                 <p className="text-xl font-mono text-cyan-300">{Math.round(getPeakWavelength(starTemp))} nm</p>
                 <p className="text-xs mt-1 opacity-70">Visible light range: ~380 to 750 nm</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Spectrometer (Doppler Shift)</h3>
            <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">
              Relative Velocity (v/c): {velocityC.toFixed(2)}c {velocityC > 0 ? '(Receding)' : velocityC < 0 ? '(Approaching)' : ''}
            </label>
            <input 
              type="range" min="-0.5" max="0.5" step="0.01" value={velocityC} 
              onChange={(e) => setVelocityC(Number(e.target.value))}
              className="w-full mb-2 accent-blue-500"
            />
            {renderSpectrum()}
            <p className="text-xs text-slate-500 mt-2 text-center">Black lines = observed absorption lines. White dashed = rest frame.</p>
          </div>

          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Thermohaline Downwelling</h3>
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="text-xs text-slate-600 block">Temp (°C): {oceanTemp}</label>
                <input type="range" min="-2" max="30" value={oceanTemp} onChange={e=>setOceanTemp(Number(e.target.value))} className="w-full accent-teal-500" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-600 block">Salinity (PSU): {salinity}</label>
                <input type="range" min="30" max="40" value={salinity} onChange={e=>setSalinity(Number(e.target.value))} className="w-full accent-teal-500" />
              </div>
            </div>
            <div className={`p-2 rounded text-center text-sm font-bold ${downwelling ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'}`}>
              {downwelling ? 'Deep Water Formation Active (Sinking)' : 'Surface Water Layer (Stable)'}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">Assessments</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Q1: Red Dwarf Star</h3>
              <p className="text-sm text-slate-600 mb-3">
                Calculate the peak wavelength emitted by a red dwarf star with a surface temperature of 3000 K.
              </p>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" value={wienAns} onChange={e => setWienAns(e.target.value)}
                  placeholder="e.g. 500" 
                  className="flex-1 border rounded px-3 py-1.5 text-sm"
                />
                <span className="text-sm text-slate-600">nm</span>
                <button onClick={checkWien} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700">
                  Check
                </button>
              </div>
              {wienFeedback && <p className={`mt-2 text-sm font-medium ${wienFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{wienFeedback}</p>}
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Q2: Distant Galaxy</h3>
              <p className="text-sm text-slate-600 mb-3">
                A galaxy is receding at 10% the speed of light (v = 0.1c). What is the observed wavelength of the Hydrogen Alpha line (λ_rest = 656 nm)?
              </p>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" value={dopplerAns} onChange={e => setDopplerAns(e.target.value)}
                  placeholder="e.g. 700" 
                  className="flex-1 border rounded px-3 py-1.5 text-sm"
                />
                <span className="text-sm text-slate-600">nm</span>
                <button onClick={checkDoppler} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700">
                  Check
                </button>
              </div>
              {dopplerFeedback && <p className={`mt-2 text-sm font-medium ${dopplerFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{dopplerFeedback}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
