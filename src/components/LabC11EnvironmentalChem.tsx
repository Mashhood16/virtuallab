import { useState } from 'react';
import { ArrowRight, Droplet, Sun, CheckCircle, AlertCircle, RefreshCw, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
  onExit?: () => void;
}

export default function LabC11EnvironmentalChem({ onExit }: Props) {
  // State for Water Treatment
  const [treatmentSteps, setTreatmentSteps] = useState<string[]>([]);
  const availableSteps = ['Filtration', 'Chlorination', 'Coagulation', 'Sedimentation'];
  const correctSequence = ['Coagulation', 'Sedimentation', 'Filtration', 'Chlorination'];

  // State for Smog
  const [sunlight, setSunlight] = useState<number>(50);
  const [vocs, setVocs] = useState<number>(50);
  const [nox, setNox] = useState<number>(50);
  
  const [activeTab, setActiveTab] = useState<'water' | 'smog'>('water');

  // Assessment state
  const [chlorineVolume, setChlorineVolume] = useState<string>('');
  const [assessmentFeedback, setAssessmentFeedback] = useState<string | null>(null);
  const [targetDose] = useState<number>(4); // 4 mg/L typical
  const [waterVolume] = useState<number>(100); // 100 ML typical

  const handleAddStep = (step: string) => {
    if (!treatmentSteps.includes(step)) {
      setTreatmentSteps([...treatmentSteps, step]);
    }
  };

  const resetTreatment = () => {
    setTreatmentSteps([]);
  };

  const checkTreatment = () => {
    if (treatmentSteps.length !== 4) return false;
    return treatmentSteps.every((step, index) => step === correctSequence[index]);
  };

  const calculateOzone = () => {
    // Arbitrary model for photochemical smog severity
    return Math.min(100, Math.max(0, (sunlight * 0.5) + (vocs * 0.3) + (nox * 0.2)));
  };

  const checkAssessment = () => {
    // calculate mass = dose * volume
    const correctMass = targetDose * waterVolume; // kg
    if (Math.abs(parseFloat(chlorineVolume) - correctMass) < 0.1) {
      setAssessmentFeedback("Correct! The required mass of chlorine is calculated correctly.");
    } else {
      setAssessmentFeedback(`Incorrect. Hint: Mass (kg) = Dose (mg/L) * Volume (ML). Check your units!`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Environmental Chemistry Lab" />

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-0">
        
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-600" /> Theory & Setup
          </h2>
          
          <div className="space-y-4 text-sm text-slate-700">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <h3 className="font-semibold text-emerald-800 mb-2">Water Treatment</h3>
              <p>Municipal water treatment ensures safe drinking water through a specific sequence:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Coagulation:</strong> Alum is added to neutralize charges on particles.</li>
                <li><strong>Sedimentation:</strong> Flocs settle to the bottom due to gravity.</li>
                <li><strong>Filtration:</strong> Water passes through sand/gravel beds.</li>
                <li><strong>Chlorination:</strong> Disinfection kills remaining pathogens.</li>
              </ul>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="font-semibold text-orange-800 mb-2">Photochemical Smog</h3>
              <p>Smog forms when nitrogen oxides (NOx) and volatile organic compounds (VOCs) react in the presence of sunlight.</p>
              <p className="mt-2 text-xs font-mono bg-slate-50 p-2 rounded">
                NO2 + hv → NO + O<br/>
                O + O2 → O3 (Ozone)<br/>
                NO2 + VOCs → PAN (Peroxyacetyl nitrate)
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <div className="flex gap-2 mb-4 border-b pb-2">
            <button 
              onClick={() => setActiveTab('water')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'water' ? 'bg-emerald-100 text-emerald-800 border-b-2 border-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Water Treatment
            </button>
            <button 
              onClick={() => setActiveTab('smog')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'smog' ? 'bg-orange-100 text-orange-800 border-b-2 border-orange-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Smog Visualizer
            </button>
          </div>

          {activeTab === 'water' && (
            <div className="flex-1 flex flex-col">
              <h3 className="font-semibold text-slate-700 mb-2">Sequence the Treatment Plant</h3>
              <p className="text-sm text-slate-500 mb-4">Click the steps in the correct order to build the plant.</p>
              
              <div className="flex gap-2 mb-6 flex-wrap">
                {availableSteps.map(step => (
                  <button 
                    key={step}
                    onClick={() => handleAddStep(step)}
                    disabled={treatmentSteps.includes(step)}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded shadow-sm hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                  >
                    + {step}
                  </button>
                ))}
              </div>

              <div className="bg-slate-100 rounded-xl p-4 flex-1 flex flex-col justify-center items-center relative overflow-hidden border-2 border-dashed border-slate-300 min-h-[200px]">
                {treatmentSteps.length === 0 ? (
                  <span className="text-slate-400">Plant sequence empty</span>
                ) : (
                  <div className="flex items-center gap-2 max-w-full overflow-x-auto p-4">
                    <Droplet className="w-8 h-8 text-blue-400 animate-bounce shrink-0" />
                    {treatmentSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center shrink-0">
                        {idx > 0 && <ArrowRight className="w-5 h-5 text-slate-400 mx-2" />}
                        <div className="bg-slate-50 border-2 border-emerald-500 rounded-lg p-3 text-center shadow-md animate-in fade-in zoom-in duration-300">
                          <span className="font-bold text-emerald-700 text-sm">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button onClick={resetTreatment} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm">
                  <RefreshCw className="w-4 h-4" /> Reset
                </button>
                {treatmentSteps.length === 4 && (
                  <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg ${checkTreatment() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {checkTreatment() ? <><CheckCircle className="w-4 h-4" /> Correct Sequence</> : <><AlertCircle className="w-4 h-4" /> Incorrect Sequence</>}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'smog' && (
            <div className="flex-1 flex flex-col">
               <h3 className="font-semibold text-slate-700 mb-4">Photochemical Smog Simulator</h3>
               
               <div className="space-y-4 mb-6">
                 <div>
                   <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                     <span>Sunlight Intensity</span>
                     <span>{sunlight}%</span>
                   </label>
                   <input type="range" min="0" max="100" value={sunlight} onChange={e => setSunlight(Number(e.target.value))} className="w-full accent-yellow-500" />
                 </div>
                 <div>
                   <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                     <span>VOCs (Unburned fuel, solvents)</span>
                     <span>{vocs}%</span>
                   </label>
                   <input type="range" min="0" max="100" value={vocs} onChange={e => setVocs(Number(e.target.value))} className="w-full accent-orange-500" />
                 </div>
                 <div>
                   <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                     <span>NOx (Vehicle exhaust)</span>
                     <span>{nox}%</span>
                   </label>
                   <input type="range" min="0" max="100" value={nox} onChange={e => setNox(Number(e.target.value))} className="w-full accent-red-500" />
                 </div>
               </div>

               <div className="bg-sky-100 rounded-xl flex-1 relative overflow-hidden flex items-end justify-center border border-sky-200 min-h-[200px]">
                  {/* Sun */}
                  <div className="absolute top-4 right-4 transition-all duration-300" style={{ opacity: sunlight / 100, transform: `scale(${0.5 + sunlight / 100})` }}>
                    <Sun className="w-16 h-16 text-yellow-400 fill-yellow-400" />
                  </div>
                  
                  {/* Cityscape */}
                  <div className="w-full h-1/3 bg-slate-800 flex items-end justify-around px-4">
                    <div className="w-8 h-24 bg-slate-700" />
                    <div className="w-12 h-32 bg-slate-600" />
                    <div className="w-10 h-16 bg-slate-700" />
                    <div className="w-16 h-20 bg-slate-500" />
                    <div className="w-8 h-28 bg-slate-700" />
                  </div>

                  {/* Smog Layer */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-2/3 bg-orange-500 transition-all duration-500 pointer-events-none mix-blend-multiply"
                    style={{ opacity: calculateOzone() / 150 }}
                  />

                  {/* Indicator */}
                  <div className="absolute top-4 left-4 bg-slate-50/80 p-2 rounded shadow backdrop-blur-sm text-sm font-bold text-slate-800">
                    Ozone / PAN Level: {calculateOzone().toFixed(0)} AQI
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Column 3: Analysis/Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" /> Analysis & Assessment
          </h2>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 shrink-0">
            <h3 className="font-semibold text-slate-800 mb-2">Water Plant Operations Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-2">Step</th>
                    <th className="py-2">Process</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3].map((i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2">{treatmentSteps[i] || '-'}</td>
                      <td className="py-2">
                        {treatmentSteps[i] === correctSequence[i] ? (
                          <span className="text-green-600">Optimal</span>
                        ) : treatmentSteps[i] ? (
                          <span className="text-red-500">Error</span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200 shrink-0">
            <h3 className="font-bold text-slate-800 mb-2">Chlorination Calculation</h3>
            <p className="text-sm text-slate-600 mb-3">
              A water treatment plant processes <strong>{waterVolume} ML</strong> (megaliters) of water per day. 
              The target chlorine dose is <strong>{targetDose} mg/L</strong>. 
              Calculate the mass of chlorine required in <strong>kg/day</strong>.
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={chlorineVolume}
                onChange={e => setChlorineVolume(e.target.value)}
                placeholder="Mass in kg" 
                className="flex-1 p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0"
              />
              <button 
                onClick={checkAssessment}
                className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0"
              >
                Check
              </button>
            </div>
            {assessmentFeedback && (
              <div className={`mt-3 p-3 rounded text-sm font-medium ${assessmentFeedback.includes('Correct') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {assessmentFeedback}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
