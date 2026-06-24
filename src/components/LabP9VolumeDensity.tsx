import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9VolumeDensity({ onExit }: { onExit?: () => void }) {
  const [objectData, setObjectData] = useState({ mass: 0, volume: 0, density: 0, name: '' });
  const [step, setStep] = useState<'start' | 'on_balance' | 'in_water'>('start');
  
  const [massInput, setMassInput] = useState('');
  const [v1Input, setV1Input] = useState('');
  const [v2Input, setV2Input] = useState('');
  const [densityInput, setDensityInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const materials = [
    { name: 'Aluminium', density: 2.7 },
    { name: 'Iron', density: 7.8 },
    { name: 'Copper', density: 8.9 },
    { name: 'Lead', density: 11.3 }
  ];

  const v1 = 50; // Initial water volume in mL

  useEffect(() => {
    generateObject();
  }, []);

  const generateObject = () => {
    const mat = materials[Math.floor(Math.random() * materials.length)];
    // random volume between 15 and 40 cm^3
    const vol = Math.floor(Math.random() * 25 + 15);
    const mass = parseFloat((vol * mat.density).toFixed(1));
    setObjectData({ mass, volume: vol, density: mat.density, name: mat.name });
    setStep('start');
    setMassInput('');
    setV1Input('');
    setV2Input('');
    setDensityInput('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const m = parseFloat(massInput);
    const v1_val = parseFloat(v1Input);
    const v2_val = parseFloat(v2Input);
    const d = parseFloat(densityInput);
    
    if (Math.abs(m - objectData.mass) > 0.1 || Math.abs(v1_val - v1) > 0.1 || Math.abs(v2_val - (v1 + objectData.volume)) > 0.1) {
      setFeedback('measurements_error');
      return;
    }

    const calcDensity = m / (v2_val - v1_val);
    if (Math.abs(calcDensity - d) < 0.2) {
      setFeedback('correct');
    } else {
      setFeedback('density_error');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
      <LabHeader onExit={onExit} title="Physics Grade 9: Volume & Density" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b pb-2">Theory: Density</h2>
          <div className="prose prose-sm">
            <p>
              <strong>Density</strong> is the mass per unit volume of a substance. 
            </p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-900 my-2 flex justify-center text-lg">
              &rho; = m / V
            </div>
            <p>
              To find the density of an irregular solid:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Measure its mass (m) using an electronic balance.</li>
              <li>Measure initial water volume (V<sub>1</sub>) in a measuring cylinder.</li>
              <li>Immerse the solid completely in the water.</li>
              <li>Measure the final water volume (V<sub>2</sub>).</li>
              <li>The volume of the solid is V = V<sub>2</sub> - V<sub>1</sub>.</li>
            </ul>
            <p className="text-xs text-slate-500 mt-4">
              Note: 1 mL of water = 1 cm&sup3; of volume.
            </p>
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col items-center relative">
          <h2 className="text-lg font-bold border-b pb-2 w-full mb-4">Laboratory Bench</h2>

          <div className="flex gap-2 w-full justify-center mb-6">
            <button 
              onClick={() => setStep('start')}
              className={`px-3 py-1 rounded border text-sm ${step === 'start' ? 'bg-blue-100 border-blue-300' : 'bg-slate-50 hover:bg-slate-50'}`}
            >
              Table
            </button>
            <button 
              onClick={() => setStep('on_balance')}
              className={`px-3 py-1 rounded border text-sm ${step === 'on_balance' ? 'bg-blue-100 border-blue-300' : 'bg-slate-50 hover:bg-slate-50'}`}
            >
              Put on Balance
            </button>
            <button 
              onClick={() => setStep('in_water')}
              className={`px-3 py-1 rounded border text-sm ${step === 'in_water' ? 'bg-blue-100 border-blue-300' : 'bg-slate-50 hover:bg-slate-50'}`}
            >
              Drop in Cylinder
            </button>
            <button 
              onClick={generateObject}
              className="px-3 py-1 rounded border text-sm ml-auto flex items-center gap-1 hover:bg-slate-100"
            >
              <RotateCcw size={14}/> Reset
            </button>
          </div>

          <div className="relative w-full h-[300px] bg-slate-100 rounded-lg border flex items-end justify-center p-4">
            
            {/* Balance */}
            <div className="absolute left-10 bottom-4 w-32 h-16 bg-slate-300 rounded flex flex-col items-center shadow-md border border-slate-400">
              <div className="w-24 h-2 bg-slate-400 mt-2 rounded"></div>
              <div className="mt-4 bg-black text-green-400 font-mono px-2 py-1 rounded w-20 text-center text-sm border border-slate-600">
                {step === 'on_balance' ? objectData.mass.toFixed(1) : '0.0'} g
              </div>
            </div>

            {/* Cylinder */}
            <div className="absolute right-20 bottom-4 w-16 h-48 border-x-2 border-b-2 border-slate-400 bg-slate-50/50 rounded-b-lg relative overflow-hidden">
              {/* Ticks */}
              {[20, 40, 60, 80, 100].map(val => (
                <div key={val} className="absolute w-4 border-b border-slate-400" style={{ bottom: `${val}%` }}>
                  <span className="absolute left-6 text-[10px] -translate-y-1/2">{val}</span>
                </div>
              ))}
              {/* Water */}
              <div 
                className="absolute bottom-0 w-full bg-blue-400/50 transition-all duration-1000 ease-in-out border-t-2 border-blue-500"
                style={{ height: `${step === 'in_water' ? v1 + objectData.volume : v1}%` }}
              ></div>
              {/* Object in water */}
              {step === 'in_water' && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-600 rounded-lg shadow-inner"></div>
              )}
            </div>

            {/* Object on table / balance */}
            {step === 'start' && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-600 rounded-lg shadow-lg cursor-pointer hover:bg-slate-500"></div>
            )}
            {step === 'on_balance' && (
              <div className="absolute bottom-20 left-10 translate-x-12 w-8 h-8 bg-slate-600 rounded-lg shadow-lg"></div>
            )}
          </div>
        </div>

        {/* Column 3: Analysis */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b pb-2">Record Data</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mass (g)</label>
              <input type="number" value={massInput} onChange={e=>setMassInput(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0.0"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">V1 (mL)</label>
              <input type="number" value={v1Input} onChange={e=>setV1Input(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">V2 (mL)</label>
              <input type="number" value={v2Input} onChange={e=>setV2Input(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Calculated Density (g/cm&sup3;)</label>
              <input type="number" value={densityInput} onChange={e=>setDensityInput(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0.0"/>
            </div>
          </div>
          
          <button 
            onClick={checkAnswer}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2"
          >
            Verify Calculations
          </button>

          {feedback === 'measurements_error' && (
            <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-start gap-2 text-sm">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>Your raw measurements (Mass, V1, or V2) are incorrect. Check the balance and cylinder readings carefully.</span>
            </div>
          )}

          {feedback === 'density_error' && (
            <div className="p-3 bg-orange-100 text-orange-800 rounded-lg flex items-start gap-2 text-sm">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>Measurements are correct, but your calculated density is wrong. Use &rho; = m / (V2 - V1).</span>
            </div>
          )}

          {feedback === 'correct' && (
            <div className="p-3 bg-green-100 text-green-800 rounded-lg flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <strong>Excellent!</strong><br />
                The density is {parseFloat(densityInput).toFixed(1)} g/cm&sup3;.<br/>
                Based on this, the material is likely <strong>{objectData.name}</strong>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
