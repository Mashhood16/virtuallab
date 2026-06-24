import { useState } from 'react';
import { Shield, Waves, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12PharmacologyEcology({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState<'pharma' | 'ecology'>('pharma');
  
  // Pharma state
  const [penicillinDose, setPenicillinDose] = useState(0);
  
  // Ecology state
  const [pCO2, setPCO2] = useState(280);
  
  // Assessment state
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [ans3, setAns3] = useState('');
  const [feedback, setFeedback] = useState('');

  const currentPH = (8.2 - ((pCO2 - 280) * 0.0007)).toFixed(2);
  const isBleached = parseFloat(currentPH) < 7.9;
  const isBurst = penicillinDose > 70;

  const checkAnswers = () => {
    let score = 0;
    if (ans1.trim().toLowerCase() === 'transpeptidase') score++;
    if (ans2.trim() === '3') score++;
    if (ans3.trim() === '8.1') score++;
    
    if (score === 3) setFeedback('Excellent! All systems analyzed correctly.');
    else setFeedback(`You scored ${score}/3. Review the theory sections and try again.`);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-teal-800 text-white p-4 shadow-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <LabHeader onExit={onExit} title="Lab 12.3: Pharmacology & Ecosystems" />
          <h1 className="text-xl font-bold">Lab 12.3: Pharmacology & Ecosystems</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('pharma')}
            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${activeTab === 'pharma' ? 'bg-slate-50 text-teal-800' : 'bg-teal-700 text-white hover:bg-teal-600'}`}>
            <Shield className="w-4 h-4" /> Pharma
          </button>
          <button 
            onClick={() => setActiveTab('ecology')}
            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${activeTab === 'ecology' ? 'bg-slate-50 text-teal-800' : 'bg-teal-700 text-white hover:bg-teal-600'}`}>
            <Waves className="w-4 h-4" /> Ecology
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 min-h-0">
        {/* Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">
            {activeTab === 'pharma' ? 'Pharmacology Theory' : 'Ecology Theory'}
          </h2>
          
          {activeTab === 'pharma' ? (
            <div className="space-y-4 text-sm text-slate-600">
              <p><strong>Penicillin Mechanism:</strong> Beta-lactam antibiotics irreversibly inhibit the enzyme <em>transpeptidase</em>, which forms cross-links in the bacterial peptidoglycan cell wall.</p>
              <p>Without cross-links, the cell wall weakens. Due to high internal osmotic pressure, water rushes into the bacterium, causing it to lyse (burst).</p>
              <p><strong>Clinical Trials:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Phase 1:</strong> Safety, dosage, and pharmacokinetics in healthy volunteers (20-100 people).</li>
                <li><strong>Phase 2:</strong> Efficacy and side effects in patients with the disease (100-300).</li>
                <li><strong>Phase 3:</strong> Large-scale comparison with standard treatments (1000+ patients).</li>
                <li><strong>Phase 4:</strong> Post-marketing surveillance.</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-slate-600">
              <p><strong>Ocean Acidification:</strong> Increased atmospheric carbon dioxide dissolves into ocean water, forming carbonic acid:</p>
              <p className="font-mono bg-slate-100 p-2 rounded text-center text-xs border border-slate-200">
                CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺
              </p>
              <p>This increases the concentration of hydrogen ions [H⁺], lowering the pH.</p>
              <p><strong>Coral Bleaching:</strong> Corals live in symbiosis with photosynthetic algae (zooxanthellae). Environmental stress (low pH, high temp) causes corals to expel these algae, leaving their white calcium carbonate (CaCO₃) skeletons visible.</p>
            </div>
          )}
        </div>

        {/* Interactive */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">
            {activeTab === 'pharma' ? 'Bacterial Lysis Simulator' : 'Coral Reef Simulator'}
          </h2>
          
          {activeTab === 'pharma' ? (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full mb-6">
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Penicillin Concentration (mg/L)</span>
                  <span className="font-bold text-teal-600">{penicillinDose}</span>
                </label>
                <input 
                  type="range" min="0" max="100" value={penicillinDose}
                  onChange={(e) => setPenicillinDose(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
              
              <div className="relative w-64 h-64 bg-slate-100 rounded-full flex items-center justify-center border border-slate-300 overflow-hidden shadow-inner">
                <svg viewBox="0 0 200 200" className={`w-full h-full transition-all duration-500 ${isBurst ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
                  {/* Cell interior */}
                  <ellipse cx="100" cy="100" rx={60 + (penicillinDose * 0.2)} ry={40 + (penicillinDose * 0.1)} fill="#fecaca" />
                  {/* DNA */}
                  <path d="M 90 90 Q 100 80 110 90 T 100 110 T 80 100" fill="none" stroke="#dc2626" strokeWidth="2" />
                  {/* Cell Wall (peptidoglycan) */}
                  <ellipse cx="100" cy="100" rx={64 + (penicillinDose * 0.2)} ry={44 + (penicillinDose * 0.1)} fill="none" stroke="#059669" strokeWidth="6" 
                    strokeDasharray={penicillinDose > 20 ? (penicillinDose > 50 ? "10 20" : "20 5") : "none"} 
                  />
                  {/* Water rushing in */}
                  {penicillinDose > 30 && (
                    <g className="animate-pulse">
                      <circle cx="20" cy="100" r="3" fill="#3b82f6" />
                      <circle cx="30" cy="110" r="3" fill="#3b82f6" />
                      <circle cx="180" cy="90" r="3" fill="#3b82f6" />
                      <circle cx="170" cy="80" r="3" fill="#3b82f6" />
                      <path d="M 30 100 L 50 100 M 170 100 L 150 100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
                    </g>
                  )}
                </svg>
                {isBurst && (
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-red-600 text-xl tracking-widest bg-red-50/80">
                    CELL LYSED
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full mb-6">
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Atmospheric pCO₂ (ppm)</span>
                  <span className="font-bold text-blue-600">{pCO2}</span>
                </label>
                <input 
                  type="range" min="280" max="1000" value={pCO2}
                  onChange={(e) => setPCO2(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="text-center text-xs mt-2 font-mono bg-blue-50 p-1 rounded border border-blue-200">Ocean pH: {currentPH}</div>
              </div>

              <div className="relative w-64 h-64 bg-cyan-900 rounded-lg flex items-center justify-center border-4 border-cyan-800 overflow-hidden shadow-inner">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Water background */}
                  <rect width="200" height="200" fill={isBleached ? "#083344" : "#164e63"} className="transition-colors duration-1000" />
                  
                  {/* Coral Skeleton */}
                  <path d="M 50 200 Q 60 140 40 100 Q 80 120 100 160 Q 120 80 160 110 Q 140 160 150 200 Z" fill={isBleached ? "#f8fafc" : "#fdba74"} className="transition-colors duration-1000" />
                  
                  {/* Zooxanthellae */}
                  {!isBleached && (
                    <g className="opacity-80 transition-opacity duration-1000">
                      <circle cx="60" cy="130" r="3" fill="#166534" />
                      <circle cx="70" cy="150" r="2" fill="#166534" />
                      <circle cx="110" cy="140" r="3" fill="#166534" />
                      <circle cx="130" cy="120" r="2" fill="#166534" />
                      <circle cx="140" cy="170" r="3" fill="#166534" />
                      <circle cx="50" cy="170" r="2" fill="#166534" />
                    </g>
                  )}
                  {/* Escaping Zooxanthellae */}
                  {isBleached && (
                    <g className="animate-[bounce_3s_ease-in-out_infinite] opacity-50">
                      <circle cx="80" cy="50" r="3" fill="#166534" />
                      <circle cx="120" cy="30" r="2" fill="#166534" />
                      <circle cx="160" cy="60" r="3" fill="#166534" />
                    </g>
                  )}
                </svg>
                {isBleached && (
                  <div className="absolute top-4 bg-slate-50/90 px-2 py-1 rounded text-xs font-bold text-red-600 shadow">
                    Bleaching Event
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Comprehensive Assessment</h2>
          
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="block font-medium text-slate-700">
                1. Which specific bacterial enzyme does Penicillin irreversibly inhibit?
              </label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                value={ans1}
                onChange={e => setAns1(e.target.value)}
                placeholder="e.g. amylase"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-700">
                2. Which phase of a clinical trial involves a large-scale comparison (1000+ patients) to standard treatments? (Enter 1, 2, 3, or 4)
              </label>
              <input 
                type="number" min="1" max="4"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                value={ans2}
                onChange={e => setAns2(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-700">
                3. If the concentration of [H⁺] ions in ocean water is measured at 1.0 × 10⁻⁸.¹ M, what is the pH of the water?
              </label>
              <input 
                type="number" step="0.1"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                value={ans3}
                onChange={e => setAns3(e.target.value)}
                placeholder="e.g. 7.5"
              />
            </div>

            <button 
              onClick={checkAnswers}
              className="w-full bg-slate-800 text-white font-semibold py-2 mt-4 rounded hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> Submit Assessment
            </button>

            {feedback && (
              <div className={`p-3 mt-2 rounded text-sm font-medium ${feedback.includes('Excellent') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
