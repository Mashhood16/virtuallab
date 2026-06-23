import { useState, useEffect } from 'react';
import { ArrowLeft, FlaskConical, CheckCircle, BookOpen, RotateCcw } from 'lucide-react';

type BottleId = 'zn' | 'caco3' | 'h2o2' | 'mno2' | 'hcl' | 'cu' | 'na' | 'k';

interface Bottle {
  id: BottleId;
  label: string;
  formula: string;
  type: 'solid' | 'liquid';
  color: string;
}

const GAS_BOTTLES: Bottle[] = [
  { id: 'zn', label: 'Zinc Granules', formula: 'Zn(s)', type: 'solid', color: '#94a3b8' },
  { id: 'caco3', label: 'Marble Chips', formula: 'CaCO3(s)', type: 'solid', color: '#f8fafc' },
  { id: 'h2o2', label: 'Hydrogen Peroxide', formula: 'H2O2(aq)', type: 'liquid', color: '#e0f2fe' },
  { id: 'mno2', label: 'MnO2 Catalyst', formula: 'MnO2(s)', type: 'solid', color: '#1e293b' },
  { id: 'hcl', label: 'Hydrochloric Acid', formula: 'HCl(aq)', type: 'liquid', color: '#f1f5f9' },
];

const FLAME_BOTTLES: Bottle[] = [
  { id: 'cu', label: 'Copper(II) Ion', formula: 'Cu²⁺', type: 'solid', color: '#059669' },
  { id: 'na', label: 'Sodium Ion', formula: 'Na⁺', type: 'solid', color: '#ffffff' },
  { id: 'k', label: 'Potassium Ion', formula: 'K⁺', type: 'solid', color: '#f1f5f9' },
];

interface Props {
  onExit?: () => void;
}

export default function LabC9QualitativeAnalysis({ onExit }: Props) {
  const [activeTab, setActiveTab] = useState<'gas' | 'flame'>('gas');

  // Gas Test State
  const [flaskContents, setFlaskContents] = useState<BottleId[]>([]);
  const [reactionGas, setReactionGas] = useState<'H2' | 'O2' | 'CO2' | null>(null);
  const [reactionEquation, setReactionEquation] = useState<string>('');
  const [testResult, setTestResult] = useState<string | null>(null);

  // Flame Test State
  const [wireLoop, setWireLoop] = useState<BottleId | null>(null);
  const [flameColor, setFlameColor] = useState<string>('#38bdf8'); // default blue bunsen flame

  // Real-time Equation & Reactions Logic
  useEffect(() => {
    if (flaskContents.includes('zn') && flaskContents.includes('hcl')) {
      setReactionGas('H2');
      setReactionEquation('Zn(s) + 2HCl(aq) ➔ ZnCl2(aq) + H2(g) ↑');
    } else if (flaskContents.includes('caco3') && flaskContents.includes('hcl')) {
      setReactionGas('CO2');
      setReactionEquation('CaCO3(s) + 2HCl(aq) ➔ CaCl2(aq) + H2O(l) + CO2(g) ↑');
    } else if (flaskContents.includes('h2o2') && flaskContents.includes('mno2')) {
      setReactionGas('O2');
      setReactionEquation('2H2O2(aq) ➔ 2H2O(l) + O2(g) ↑  [MnO2 catalyst]');
    } else {
      setReactionGas(null);
      // Dynamically build partial equation as user adds bottles
      const parts = flaskContents.map(id => GAS_BOTTLES.find(b => b.id === id)?.formula).filter(Boolean);
      if (parts.length > 0) {
         setReactionEquation(parts.join(' + ') + ' ➔ ...');
      } else {
         setReactionEquation('');
      }
    }
    setTestResult(null);
  }, [flaskContents]);

  // Gas Test Actions
  const addToFlask = (id: BottleId) => {
    if (!flaskContents.includes(id) && flaskContents.length < 3) {
      setFlaskContents([...flaskContents, id]);
    }
  };

  const performGasTest = (testType: 'lit_splint' | 'glowing_splint' | 'limewater') => {
    if (!reactionGas) {
      setTestResult('No reaction happening, or no gas produced.');
      return;
    }
    if (testType === 'lit_splint' && reactionGas === 'H2') {
      setTestResult('💥 POP! (Squeaky pop sound - Hydrogen gas confirmed)');
    } else if (testType === 'glowing_splint' && reactionGas === 'O2') {
      setTestResult('🔥 Splint relights! (Oxygen gas confirmed)');
    } else if (testType === 'limewater' && reactionGas === 'CO2') {
      setTestResult('☁️ Limewater turns milky/cloudy. (Carbon Dioxide confirmed)');
    } else {
      setTestResult('Negative result. Nothing happens.');
    }
  };

  const resetFlask = () => {
    setFlaskContents([]);
  };

  // Flame Test Actions
  const dipWire = (id: BottleId) => {
    setWireLoop(id);
    setFlameColor('#38bdf8'); // reset to blue until put in flame
  };

  const putInFlame = () => {
    if (!wireLoop) return;
    if (wireLoop === 'cu') setFlameColor('#10b981'); // blue-green
    else if (wireLoop === 'na') setFlameColor('#f59e0b'); // yellow-orange
    else if (wireLoop === 'k') setFlameColor('#d946ef'); // lilac
    else setFlameColor('#38bdf8');
  };

  const cleanWire = () => {
    setWireLoop(null);
    setFlameColor('#38bdf8');
  };

  // Assessment State
  const [gasAnswer, setGasAnswer] = useState('');
  const [flameAnswer, setFlameAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const checkAnswers = () => {
    let msg = '';
    if (gasAnswer.trim().toLowerCase() === 'co2' || gasAnswer.trim().toLowerCase() === 'carbon dioxide') {
      msg += '✅ Gas identification is correct.\n';
    } else {
      msg += '❌ Gas identification is incorrect (Hint: Limewater test).\n';
    }
    if (flameAnswer.trim().toLowerCase() === 'cu' || flameAnswer.trim().toLowerCase() === 'copper') {
      msg += '✅ Metal identification is correct.';
    } else {
      msg += '❌ Metal identification is incorrect (Hint: Blue-green flame).';
    }
    setFeedback(msg);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-emerald-600 text-white p-4 shadow-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="hover:bg-emerald-700 p-2 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold">Grade 9 Chemistry: Qualitative Analysis</h1>
        </div>
        <FlaskConical size={28} />
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Theory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 text-emerald-800">
            <BookOpen size={24} />
            <h2 className="text-xl font-semibold">Theory & Context</h2>
          </div>
          
          <div className="space-y-4 text-slate-700">
            <p>
              Qualitative analysis is used to identify unknown ions or gases in a substance, rather than measuring how much is present.
            </p>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-2">1. Testing for Gases</h3>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li><strong>Hydrogen (H₂):</strong> Ignites with a squeaky "pop" sound when exposed to a lit splint.</li>
                <li><strong>Oxygen (O₂):</strong> Relights a glowing splint due to supporting combustion.</li>
                <li><strong>Carbon Dioxide (CO₂):</strong> Reacts with limewater (calcium hydroxide solution) to form a cloudy white precipitate of calcium carbonate.</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="font-bold text-orange-900 mb-2">2. Flame Tests</h3>
              <p className="text-sm mb-2">
                Metal ions emit specific wavelengths of light when heated, producing characteristic flame colors:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><span className="font-semibold text-yellow-600">Sodium (Na⁺):</span> Yellow / Orange</li>
                <li><span className="font-semibold text-emerald-600">Copper (Cu²⁺):</span> Blue-Green</li>
                <li><span className="font-semibold text-purple-600">Potassium (K⁺):</span> Lilac / Pale Purple</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px] lg:h-auto">
          <div className="flex gap-4 mb-4 shrink-0">
            <button 
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'gas' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setActiveTab('gas')}
            >
              Gas Tests
            </button>
            <button 
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'flame' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setActiveTab('flame')}
            >
              Flame Tests
            </button>
          </div>

          <div className="flex-1 relative flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto">
            {activeTab === 'gas' && (
              <>
                <p className="text-center text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Chemical Shelf</p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {GAS_BOTTLES.map(b => (
                    <button 
                      key={b.id} 
                      className={`flex flex-col items-center cursor-pointer transform transition-transform p-2 rounded-lg border-2 ${flaskContents.includes(b.id) ? 'border-emerald-500 bg-emerald-50 opacity-50 scale-95' : 'border-slate-200 bg-white hover:-translate-y-1 shadow-sm'}`}
                      onClick={() => addToFlask(b.id)}
                      disabled={flaskContents.includes(b.id) || flaskContents.length >= 3}
                    >
                      <div className={`w-10 h-12 rounded-t-lg rounded-b-sm border-2 border-slate-300 relative overflow-hidden ${b.type === 'liquid' ? 'bg-blue-50' : 'bg-slate-50'}`}>
                        <div className="absolute top-0 w-full h-2 bg-slate-200 border-b border-slate-300"></div>
                        {b.type === 'solid' && <div className="absolute bottom-0 w-full h-3" style={{ backgroundColor: b.color }}></div>}
                        {b.type === 'liquid' && <div className="absolute bottom-0 w-full h-5" style={{ backgroundColor: b.color, opacity: 0.7 }}></div>}
                      </div>
                      <div className="mt-1 text-[10px] font-bold text-center w-16 leading-tight text-slate-700">{b.label}</div>
                    </button>
                  ))}
                </div>

                {/* Real-time Equation Display */}
                <div className="bg-slate-900 text-green-400 font-mono p-3 rounded-lg min-h-[60px] flex items-center justify-center text-center mb-6 shadow-inner">
                  {reactionEquation ? (
                    <span className="text-sm md:text-base font-bold tracking-wider">{reactionEquation}</span>
                  ) : (
                    <span className="text-slate-500 italic text-sm">Mix chemicals to build an equation...</span>
                  )}
                </div>

                {/* Flask Area */}
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 120" className="w-full h-full">
                      {/* Flask Outline */}
                      <path d="M40,10 L40,40 L10,100 A10,10 0 0,0 20,115 L80,115 A10,10 0 0,0 90,100 L60,40 L60,10 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="4" />
                      <rect x="35" y="5" width="30" height="5" fill="#475569" />
                      
                      {/* Contents */}
                      {flaskContents.some(id => GAS_BOTTLES.find(b => b.id === id)?.type === 'liquid') && (
                        <path d="M15,90 L85,90 L80,110 A5,5 0 0,1 75,115 L25,115 A5,5 0 0,1 20,110 Z" fill="#bae6fd" opacity="0.6" />
                      )}
                      
                      {flaskContents.some(id => GAS_BOTTLES.find(b => b.id === id)?.type === 'solid') && (
                        <path d="M25,110 L75,110 L70,115 L30,115 Z" fill="#64748b" />
                      )}
                      
                      {/* Bubbles if reaction is happening */}
                      {reactionGas && (
                        <g>
                          <circle cx="40" cy="80" r="2" fill="#fff" className="animate-bounce" />
                          <circle cx="50" cy="70" r="3" fill="#fff" className="animate-ping" />
                          <circle cx="60" cy="85" r="2" fill="#fff" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <circle cx="45" cy="50" r="2" fill="#fff" className="animate-ping" style={{ animationDelay: '0.1s' }} />
                        </g>
                      )}
                    </svg>
                  </div>
                  
                  {/* Test Tools */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <button onClick={() => performGasTest('lit_splint')} className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-semibold rounded-md border border-red-200 hover:bg-red-200 transition-colors">🔥 Lit Splint</button>
                    <button onClick={() => performGasTest('glowing_splint')} className="px-3 py-1.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-md border border-orange-200 hover:bg-orange-200 transition-colors">✨ Glowing Splint</button>
                    <button onClick={() => performGasTest('limewater')} className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md border border-blue-200 hover:bg-blue-200 transition-colors">💧 Limewater</button>
                  </div>

                  {testResult && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-yellow-800 text-sm font-semibold w-full">
                      {testResult}
                    </div>
                  )}

                  <button 
                    className="flex items-center gap-2 px-4 py-2 mt-4 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                    onClick={resetFlask}
                  >
                    <RotateCcw size={16} /> Empty Flask
                  </button>
                </div>
              </>
            )}

            {activeTab === 'flame' && (
              <div className="w-full h-full flex flex-col items-center p-2">
                <p className="text-center text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Salt Samples</p>
                <div className="flex justify-center gap-6 mb-8">
                  {FLAME_BOTTLES.map(b => (
                    <button 
                      key={b.id} 
                      className={`flex flex-col items-center cursor-pointer p-2 rounded-lg border-2 transition-colors ${wireLoop === b.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'}`} 
                      onClick={() => dipWire(b.id)}
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center mb-2 shadow-inner">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: b.color, opacity: 0.8 }}></div>
                      </div>
                      <div className="text-xs font-bold text-slate-700 text-center w-20">{b.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{b.formula}</div>
                    </button>
                  ))}
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                   <p className="text-sm text-slate-500 italic mb-4">Click the flame to insert the wire loop</p>
                   {/* Bunsen Burner SVG */}
                   <svg viewBox="0 0 100 150" className="w-24 h-36 cursor-pointer hover:scale-105 transition-transform" onClick={putInFlame}>
                     {/* burner base */}
                     <path d="M40,150 L60,150 L60,80 L40,80 Z" fill="#94a3b8" />
                     <rect x="30" y="140" width="40" height="10" fill="#475569" />
                     {/* Air hole */}
                     <circle cx="50" cy="130" r="4" fill="#334155" />
                     {/* Flame */}
                     <path d="M50,5 Q25,60 40,80 L60,80 Q75,60 50,5 Z" fill={flameColor} opacity="0.85" className="animate-pulse" />
                     <path d="M50,30 Q35,60 45,80 L55,80 Q65,60 50,30 Z" fill="#bae6fd" opacity="0.5" />
                   </svg>
                   
                   {/* Wire loop indicator */}
                   {wireLoop && (
                     <div className="absolute top-1/3 right-10 flex items-center pointer-events-none">
                       <div className="w-16 h-1 bg-slate-400"></div>
                       <div 
                         className="w-5 h-5 rounded-full border-4 border-slate-400 bg-transparent" 
                         style={{ borderColor: FLAME_BOTTLES.find(b=>b.id===wireLoop)?.color || '#94a3b8' }}
                       ></div>
                     </div>
                   )}
                </div>
                
                <button 
                  onClick={cleanWire} 
                  className="mt-6 px-5 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors text-sm"
                >
                  Clean Wire
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Assessment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 text-emerald-800">
            <CheckCircle size={24} />
            <h2 className="text-xl font-semibold">Assessment</h2>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Unknown Sample Analysis</h3>
              <p className="text-sm text-slate-600 mb-4">
                You are given an unknown solid. When reacted with Hydrochloric Acid (HCl), it bubbles rapidly. The gas turns limewater cloudy. When the solid undergoes a flame test, a blue-green flame is observed.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    1. What gas was produced?
                  </label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="Enter gas name or formula"
                    value={gasAnswer}
                    onChange={e => setGasAnswer(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    2. What metal ion is present?
                  </label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="Enter metal name or formula"
                    value={flameAnswer}
                    onChange={e => setFlameAnswer(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={checkAnswers}
                  className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Verify Findings
                </button>
              </div>
              
              {feedback && (
                <div className="mt-4 p-3 rounded-md text-sm font-medium whitespace-pre-wrap bg-slate-100 border border-slate-300 text-slate-800">
                  {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
