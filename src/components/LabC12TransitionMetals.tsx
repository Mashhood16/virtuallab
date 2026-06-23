import { useState } from 'react';
import { ArrowLeft, Flame, Layers, Activity, CheckCircle } from 'lucide-react';

interface MetalComplex {
  metal: string;
  ligand: string;
  name: string;
  color: string;
  lambda: number; // nm
  spin: string;
}

const complexes: MetalComplex[] = [
  { metal: 'Cu²⁺', ligand: 'H₂O', name: '[Cu(H₂O)₆]²⁺', color: '#93c5fd', lambda: 800, spin: 'High Spin' },
  { metal: 'Cu²⁺', ligand: 'NH₃', name: '[Cu(NH₃)₄(H₂O)₂]²⁺', color: '#1e3a8a', lambda: 600, spin: 'High Spin' },
  { metal: 'Co²⁺', ligand: 'H₂O', name: '[Co(H₂O)₆]²⁺', color: '#fca5a5', lambda: 510, spin: 'High Spin' },
  { metal: 'Co²⁺', ligand: 'Cl⁻', name: '[CoCl₄]²⁻', color: '#3b82f6', lambda: 680, spin: 'High Spin (Tetrahedral)' },
  { metal: 'Fe³⁺', ligand: 'H₂O', name: '[Fe(H₂O)₆]³⁺', color: '#fef08a', lambda: 400, spin: 'High Spin' },
  { metal: 'Fe³⁺', ligand: 'CN⁻', name: '[Fe(CN)₆]³⁻', color: '#991b1b', lambda: 350, spin: 'Low Spin' },
];

export default function LabC12TransitionMetals({ onExit }: { onExit?: () => void }) {
  const [complexIdx, setComplexIdx] = useState<number>(0);
  const [ansEnergy, setAnsEnergy] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  
  const activeComplex = complexes[complexIdx];

  const checkAnswer = () => {
    // E = hc/lambda -> E in Joules
    const E = (6.626e-34 * 3.0e8) / (activeComplex.lambda * 1e-9);
    // multiply by Na / 1000 for kJ/mol
    const kJmol = (E * 6.022e23) / 1000;
    
    const val = parseFloat(ansEnergy);
    if (!isNaN(val) && Math.abs(val - kJmol) < Math.abs(kJmol * 0.05)) {
      setFeedback(`Correct! The crystal field splitting energy (Δ) is ~${kJmol.toFixed(0)} kJ/mol.`);
    } else {
      setFeedback(`Incorrect. Hint: E = (hc/λ)*Na / 1000. Expected around ${kJmol.toFixed(0)} kJ/mol.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="flex items-center p-4 bg-teal-900 text-white shadow-md">
        {onExit && (
          <button onClick={onExit} className="mr-4 hover:bg-teal-800 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}
        <Layers className="mr-3" size={28} />
        <h1 className="text-2xl font-bold">Virtual Lab: Transition Metals & Complexes</h1>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto border border-slate-200">
          <h2 className="text-xl font-bold text-teal-900 mb-4 flex items-center">
            <Flame className="mr-2" /> Theory
          </h2>
          <div className="prose text-sm text-slate-700">
            <p><strong>Transition Metals</strong> form complex ions with ligands. The ligands cause the d-orbitals of the central metal ion to split into different energy levels (e.g., e_g and t_2g in octahedral fields).</p>
            
            <h3 className="text-md font-semibold mt-4">Crystal Field Theory & Colors</h3>
            <p>The energy gap (Δ) between split d-orbitals corresponds to the wavelength of light absorbed:</p>
            <div className="bg-slate-100 p-3 rounded text-center font-mono my-2">
              ΔE = hc / λ
            </div>
            <p>The observed color is the <strong>complementary color</strong> of the absorbed light.</p>
            
            <h3 className="text-md font-semibold mt-4">Spectrochemical Series</h3>
            <p>Ligands split d-orbitals by different amounts:<br/>
              I⁻ &lt; Cl⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NH₃ &lt; CN⁻ &lt; CO
            </p>

            <h3 className="text-md font-semibold mt-4">Industrial Catalysis</h3>
            <ul className="list-disc pl-5">
              <li><strong>Haber Process (NH₃):</strong> Uses Iron (Fe) catalyst.</li>
              <li><strong>Contact Process (H₂SO₄):</strong> Uses Vanadium(V) oxide (V₂O₅).</li>
            </ul>
            <p>Transition metals make good catalysts due to their variable oxidation states and ability to adsorb reactants on their surface.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center border border-slate-200">
          <h2 className="text-xl font-bold text-teal-900 mb-4">Ligand Swapping Simulator</h2>
          
          <select 
            className="w-full max-w-sm p-2 border rounded bg-slate-50 mb-6 font-mono font-bold text-center"
            value={complexIdx}
            onChange={e => setComplexIdx(parseInt(e.target.value))}
          >
            {complexes.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
          </select>

          <div className="w-full flex gap-4">
            <div className="w-1/2 flex flex-col items-center">
              <h3 className="text-sm font-semibold mb-2">Solution Color</h3>
              <div 
                className="w-24 h-32 rounded-b-xl border-x-4 border-b-4 border-slate-300 relative overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: activeComplex.color }}
              >
                <div className="absolute top-0 w-full h-4 bg-white/30"></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Absorbs ~{activeComplex.lambda} nm</p>
            </div>
            
            <div className="w-1/2 flex flex-col items-center">
              <h3 className="text-sm font-semibold mb-2">d-Orbital Splitting</h3>
              <div className="w-full h-32 bg-slate-100 rounded border border-slate-200 relative flex items-center justify-center p-2">
                {/* Render Octahedral Splitting Diagram symbolically */}
                <div className="flex flex-col items-center w-full h-full justify-around">
                  {/* eg level */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 border-b-2 border-slate-800 relative">
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>
                    </div>
                    <div className="w-6 h-6 border-b-2 border-slate-800 relative">
                      {activeComplex.spin === 'High Spin' && <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>}
                    </div>
                  </div>
                  
                  {/* Delta E arrow */}
                  <div className="h-8 border-l-2 border-dashed border-teal-500 flex items-center">
                    <span className="ml-1 text-xs text-teal-700 font-bold">Δ</span>
                  </div>

                  {/* t2g level */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 border-b-2 border-slate-800 relative">
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑↓</span>
                    </div>
                    <div className="w-6 h-6 border-b-2 border-slate-800 relative">
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>
                    </div>
                    <div className="w-6 h-6 border-b-2 border-slate-800 relative">
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{activeComplex.spin}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold text-teal-900 mb-4 flex items-center">
            <Activity className="mr-2" /> Assessment
          </h2>
          
          <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex-1">
            <h3 className="font-semibold text-teal-900 mb-2">Calculate Crystal Field Splitting</h3>
            <p className="text-sm text-teal-800 mb-3">
              The complex <strong>{activeComplex.name}</strong> absorbs light at <strong>{activeComplex.lambda} nm</strong>.
              <br/><br/>
              Calculate the crystal field splitting energy (Δ) in <strong>kJ/mol</strong>.
              <br/><br/>
              <span className="text-xs text-slate-500">
                h = 6.626 × 10⁻³⁴ J·s <br/>
                c = 3.00 × 10⁸ m/s <br/>
                N_A = 6.022 × 10²³ mol⁻¹
              </span>
            </p>
            <input 
              type="text" 
              placeholder="Enter value in kJ/mol..." 
              value={ansEnergy}
              onChange={e => setAnsEnergy(e.target.value)}
              className="w-full p-2 border border-teal-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
            />
            <button 
              onClick={checkAnswer}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center"
            >
              <CheckCircle className="mr-2" size={18} /> Check Answer
            </button>
            {feedback && (
              <p className={`mt-3 text-sm font-semibold p-2 rounded ${feedback.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
