import { useState } from 'react';
import { ArrowLeft, Activity, Target, Save, Info, CheckCircle, XCircle } from 'lucide-react';

export default function LabP11Solids({ onExit }: { onExit?: () => void }) {
  const [material, setMaterial] = useState('Steel');
  const [mass, setMass] = useState(10);
  const [dataPoints, setDataPoints] = useState<{ material: string, force: number, extension: number }[]>([]);
  const [assessmentAnswer, setAssessmentAnswer] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const materials: Record<string, number> = {
    Steel: 200e9,
    Copper: 117e9,
    Aluminum: 69e9
  };

  const E = materials[material];
  const force = mass * 9.81;
  const area = 0.785e-6; // 1mm diameter
  const length = 2.0;
  
  // Deterministic noise based on mass and material
  const noiseSeed = ((mass * 100) + E) % 100 / 100;
  const noise = 1 + (noiseSeed * 0.02 - 0.01); 
  const extensionM = (force * length) / (area * E) * noise;
  const extensionMm = extensionM * 1000;

  const handleRecord = () => {
    setDataPoints(prev => [...prev, { material, force, extension: extensionMm }]);
  };

  const checkAssessment = () => {
    const val = parseFloat(assessmentAnswer);
    if (!isNaN(val) && Math.abs(val - 98) < 2) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={onExit} className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Solids: Young's Modulus Material Tester</h1>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theory & Setup */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Info className="text-blue-500" />
            <h2 className="text-lg font-semibold">Theory & Setup</h2>
          </div>
          <div className="text-sm text-slate-600 space-y-2">
            <p><strong>Young's Modulus (E):</strong> A measure of mechanical property of linear elastic solid materials. It defines the relationship between stress and strain.</p>
            <p><strong>Formula:</strong> <br/> <code className="bg-slate-100 px-1 rounded">E = (F * L) / (A * e)</code></p>
            <p>Where <strong>e</strong> is the extension of the wire.</p>
          </div>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Wire Material (Length: 2.0m, Diam: 1.0mm)</label>
              <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50">
                <option value="Steel">Steel</option>
                <option value="Copper">Copper</option>
                <option value="Aluminum">Aluminum</option>
              </select>
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700">
                <span>Applied Mass (kg)</span>
                <span>{mass} kg</span>
              </label>
              <input type="range" min="0" max="50" step="1" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full mt-1" />
            </div>
          </div>
        </div>

        {/* Simulator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Activity className="text-green-500" />
            <h2 className="text-lg font-semibold">Interactive Simulator</h2>
          </div>
          <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden border border-slate-200 min-h-[300px]">
            <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
              {/* Clamp */}
              <rect x="180" y="0" width="40" height="20" fill="#475569" />
              {/* Wire */}
              <line x1="200" y1="20" x2="200" y2="150" stroke="#854d0e" strokeWidth={material === 'Steel' ? 2 : material === 'Copper' ? 3 : 4} />
              {/* Weight */}
              <rect x="175" y="150" width="50" height={20 + mass * 0.5} fill="#1e293b" />
              <text x="230" y="170" className="text-xs font-bold fill-slate-700">{mass} kg</text>
              
              {/* Magnifier */}
              <circle cx="300" cy="200" r="80" fill="white" stroke="#94a3b8" strokeWidth="4" />
              <text x="260" y="140" className="text-xs font-bold fill-slate-500">Micrometer</text>
              <line x1="260" y1="200" x2="340" y2="200" stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
              <rect x="290" y={200 + extensionMm * 10} width="20" height="80" fill="#64748b" />
              <text x="250" y="280" className="text-sm font-bold fill-slate-800">{extensionMm.toFixed(3)} mm</text>
            </svg>
          </div>
        </div>

        {/* Data & Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center gap-2 border-b pb-2">
            <Target className="text-purple-500" />
            <h2 className="text-lg font-semibold">Data & Assessment</h2>
          </div>
          
          <button onClick={handleRecord} className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            <Save size={18} /> Record Data Point
          </button>
          
          {dataPoints.length > 0 && (
            <div className="mt-2 text-sm max-h-40 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border p-1">Material</th>
                    <th className="border p-1">Force (N)</th>
                    <th className="border p-1">Ext (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPoints.map((d, i) => (
                    <tr key={i} className="text-center">
                      <td className="border p-1">{d.material}</td>
                      <td className="border p-1">{d.force.toFixed(1)}</td>
                      <td className="border p-1">{d.extension.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">Analysis Question</h3>
            <p className="text-sm text-purple-800 mb-3">
              A wire of length 2.0m and cross-sectional area 0.8 mm² stretches by 2.5 mm under a 10 kg load (g=9.8). Calculate the Young's Modulus in GPa.
            </p>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                value={assessmentAnswer} 
                onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }} 
                className="flex-1 p-2 border border-purple-200 rounded outline-none focus:border-purple-500"
                placeholder="Enter E in GPa..."
              />
              <button onClick={checkAssessment} className="py-2 px-4 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && <div className="mt-2 text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> Correct! E = FL / Ae.</div>}
            {assessmentStatus === 'incorrect' && <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><XCircle size={16}/> Incorrect. Ensure units are converted to SI before calculation.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
