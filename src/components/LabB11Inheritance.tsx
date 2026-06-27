import { useState } from 'react';
import { Activity, HeartPulse, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB11Inheritance({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState<'transfusion' | 'hdn'>('transfusion');

  // Transfusion State
  const [patientType, setPatientType] = useState('A');
  const [patientRh, setPatientRh] = useState('+');
  const [donorType, setDonorType] = useState('A');
  const [donorRh, setDonorRh] = useState('+');
  const [transfusionResult, setTransfusionResult] = useState<'idle' | 'simulating' | 'success' | 'agglutination'>('idle');

  // HDN State
  const [motherRh, setMotherRh] = useState('-');
  const [babyRh, setBabyRh] = useState('+');
  const [rhogamGiven, setRhogamGiven] = useState(false);
  const [hdnResult, setHdnResult] = useState<'idle' | 'simulating' | 'safe' | 'hdn'>('idle');

  // Assessment State
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [q3Answer, setQ3Answer] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');

  // Helpers
  const checkCompatibility = (pType: string, pRh: string, dType: string, dRh: string) => {
    // Check ABO
    let aboCompatible = true;
    if (pType === 'O' && dType !== 'O') aboCompatible = false;
    if (pType === 'A' && (dType === 'B' || dType === 'AB')) aboCompatible = false;
    if (pType === 'B' && (dType === 'A' || dType === 'AB')) aboCompatible = false;
    
    // Check Rh
    let rhCompatible = true;
    if (pRh === '-' && dRh === '+') rhCompatible = false;

    return aboCompatible && rhCompatible;
  };

  const handleTransfuse = () => {
    setTransfusionResult('simulating');
    setTimeout(() => {
      const isCompatible = checkCompatibility(patientType, patientRh, donorType, donorRh);
      setTransfusionResult(isCompatible ? 'success' : 'agglutination');
    }, 1500);
  };

  const handlePregnancy = () => {
    setHdnResult('simulating');
    setTimeout(() => {
      if (motherRh === '-' && babyRh === '+' && !rhogamGiven) {
        setHdnResult('hdn');
      } else {
        setHdnResult('safe');
      }
    }, 1500);
  };

  const checkAnswers = () => {
    setAssessmentStatus('checking');
    setTimeout(() => {
      const q1 = q1Answer.trim().toUpperCase().replace(/\s/g, '');
      const isQ1Correct = q1 === 'O-,B-' || q1 === 'B-,O-';
      
      const q2 = q2Answer.trim().toLowerCase();
      const isQ2Correct = q2 === 'yes';

      const q3 = q3Answer.trim().toUpperCase().replace(/\s/g, '');
      const isQ3Correct = q3 === 'A,B,RH' || q3 === 'A,RH,B' || q3 === 'B,A,RH' || q3 === 'B,RH,A' || q3 === 'RH,A,B' || q3 === 'RH,B,A';

      if (isQ1Correct && isQ2Correct && isQ3Correct) {
        setAssessmentStatus('passed');
      } else {
        setAssessmentStatus('failed');
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none">
      <LabHeader onExit={onExit} title="Genetics & Inheritance Lab" variant="dark" subtitle="Blood Types & Hemolytic Disease" />

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
        
        {/* Column 1: Theory */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 border-r overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">Background Theory</h2>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h3 className="text-lg font-semibold text-rose-700 flex items-center gap-2 mb-2">
                <HeartPulse size={18} /> ABO & Rh Blood Groups
              </h3>
              <p className="mb-2">
                Human blood type is determined by co-dominant alleles (IA and IB) and a recessive allele (i). Red blood cells (RBCs) have surface antigens (A and B).
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm mb-2">
                <li><strong>Type A:</strong> Has A antigens, anti-B antibodies.</li>
                <li><strong>Type B:</strong> Has B antigens, anti-A antibodies.</li>
                <li><strong>Type AB:</strong> Has A & B antigens, no antibodies. (Universal Recipient)</li>
                <li><strong>Type O:</strong> Has no antigens, anti-A & anti-B antibodies. (Universal Donor)</li>
              </ul>
              <p className="text-sm">
                The Rh factor is another antigen. Rh+ means the antigen is present, Rh- means it is absent. Rh- individuals will produce anti-Rh antibodies if exposed to Rh+ blood.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-rose-700 flex items-center gap-2 mb-2">
                <ShieldAlert size={18} /> Hemolytic Disease of the Newborn (HDN)
              </h3>
              <p className="text-sm">
                HDN occurs when an Rh- mother carries an Rh+ fetus. During birth, fetal blood can enter the mother's circulation, causing her to produce anti-Rh antibodies (sensitization). 
              </p>
              <p className="mt-2 text-sm">
                In a subsequent pregnancy with an Rh+ fetus, these maternal antibodies can cross the placenta and destroy the fetal red blood cells. <strong>RhoGAM</strong> is an injection of anti-Rh antibodies given to the mother to prevent sensitization.
              </p>
            </section>
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-slate-100 dark:bg-slate-800 p-6 flex flex-col overflow-y-auto">
          <div className="flex bg-slate-50 dark:bg-slate-900 rounded-lg p-1 shadow-sm mb-6 shrink-0">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'transfusion' ? 'bg-rose-100 text-rose-800' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => { setActiveTab('transfusion'); setTransfusionResult('idle'); }}
            >
              Transfusion Simulator
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'hdn' ? 'bg-rose-100 text-rose-800' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => { setActiveTab('hdn'); setHdnResult('idle'); }}
            >
              HDN Simulator
            </button>
          </div>

          {activeTab === 'transfusion' && (
            <div className="flex-1 flex flex-col">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-4">Cross-Match Simulator</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-bold text-gray-600 mb-2">Patient (Recipient)</h4>
                    <div className="flex gap-2 mb-2">
                      <select className="border rounded p-1 flex-1" value={patientType} onChange={(e) => {setPatientType(e.target.value); setTransfusionResult('idle');}}>
                        <option value="A">Type A</option>
                        <option value="B">Type B</option>
                        <option value="AB">Type AB</option>
                        <option value="O">Type O</option>
                      </select>
                      <select className="border rounded p-1 w-16" value={patientRh} onChange={(e) => {setPatientRh(e.target.value); setTransfusionResult('idle');}}>
                        <option value="+">+</option>
                        <option value="-">-</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <h4 className="text-sm font-bold text-red-800 mb-2">Donor Blood</h4>
                    <div className="flex gap-2 mb-2">
                      <select className="border rounded p-1 flex-1 border-red-200" value={donorType} onChange={(e) => {setDonorType(e.target.value); setTransfusionResult('idle');}}>
                        <option value="A">Type A</option>
                        <option value="B">Type B</option>
                        <option value="AB">Type AB</option>
                        <option value="O">Type O</option>
                      </select>
                      <select className="border rounded p-1 w-16 border-red-200" value={donorRh} onChange={(e) => {setDonorRh(e.target.value); setTransfusionResult('idle');}}>
                        <option value="+">+</option>
                        <option value="-">-</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 relative mb-6 min-h-[200px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-500 overflow-hidden">
                  {transfusionResult === 'idle' && (
                    <div className="text-gray-400 text-sm flex flex-col items-center">
                      <Activity size={32} className="mb-2 opacity-50" />
                      Select blood types and click Transfuse
                    </div>
                  )}
                  {transfusionResult === 'simulating' && (
                    <div className="flex items-center gap-2 text-rose-600 font-bold animate-pulse">
                      <HeartPulse size={24} /> Transfusing...
                    </div>
                  )}
                  {transfusionResult === 'success' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-green-50">
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        {/* Healthy flowing RBCs */}
                        <circle cx="20" cy="50" r="12" fill="#ef4444" className="animate-bounce" />
                        <circle cx="50" cy="50" r="12" fill="#ef4444" className="animate-bounce" style={{animationDelay: '0.1s'}} />
                        <circle cx="80" cy="50" r="12" fill="#ef4444" className="animate-bounce" style={{animationDelay: '0.2s'}} />
                      </svg>
                      <span className="text-green-700 font-bold mt-2 flex items-center gap-1"><CheckCircle size={18}/> Compatible</span>
                      <p className="text-xs text-green-600 mt-1">No immune reaction occurred.</p>
                    </div>
                  )}
                  {transfusionResult === 'agglutination' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        {/* Clumped RBCs with antibodies */}
                        <circle cx="50" cy="40" r="15" fill="#7f1d1d" />
                        <circle cx="40" cy="55" r="15" fill="#991b1b" />
                        <circle cx="60" cy="55" r="15" fill="#7f1d1d" />
                        <path d="M45,40 L55,40 L50,30 Z" fill="#fbbf24" />
                        <path d="M35,50 L45,50 L40,60 Z" fill="#fbbf24" />
                      </svg>
                      <span className="text-red-700 font-bold mt-2 flex items-center gap-1"><XCircle size={18}/> Agglutination!</span>
                      <p className="text-xs text-red-600 mt-1">Patient antibodies attacked donor cells.</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleTransfuse}
                  disabled={transfusionResult === 'simulating'}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  Initiate Transfusion
                </button>
              </div>
            </div>
          )}

          {activeTab === 'hdn' && (
            <div className="flex-1 flex flex-col">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-4">Pregnancy & HDN Simulator</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Mother Rh Factor</label>
                    <select className="w-full border rounded p-2" value={motherRh} onChange={(e) => {setMotherRh(e.target.value); setHdnResult('idle');}}>
                      <option value="-">Rh Negative (-)</option>
                      <option value="+">Rh Positive (+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Fetus Rh Factor</label>
                    <select className="w-full border rounded p-2" value={babyRh} onChange={(e) => {setBabyRh(e.target.value); setHdnResult('idle');}}>
                      <option value="+">Rh Positive (+)</option>
                      <option value="-">Rh Negative (-)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Administer RhoGAM?</h4>
                    <p className="text-xs text-blue-700">Given at 28 weeks & post-partum</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={rhogamGiven} onChange={(e) => {setRhogamGiven(e.target.checked); setHdnResult('idle');}} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-50 dark:bg-slate-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 relative mb-6 min-h-[150px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-500 overflow-hidden p-4">
                  {hdnResult === 'idle' && <p className="text-gray-400 text-sm text-center">Set the Rh factors and simulate the 2nd pregnancy to see if Hemolytic Disease occurs.</p>}
                  {hdnResult === 'simulating' && <p className="text-rose-600 font-bold animate-pulse">Simulating 2nd Pregnancy...</p>}
                  {hdnResult === 'safe' && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
                        <CheckCircle size={32} />
                      </div>
                      <h4 className="font-bold text-green-800">Healthy Baby</h4>
                      <p className="text-xs text-green-600">No antibody attack occurred.</p>
                    </div>
                  )}
                  {hdnResult === 'hdn' && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-2">
                        <ShieldAlert size={32} />
                      </div>
                      <h4 className="font-bold text-red-800">Hemolytic Disease (HDN)</h4>
                      <p className="text-xs text-red-600">Maternal Anti-D antibodies destroyed fetal RBCs.</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handlePregnancy}
                  disabled={hdnResult === 'simulating'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  Simulate Pregnancy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Assessment */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 border-l flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">Assessment</h2>
          
          <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 flex-1 flex flex-col">
            <h3 className="font-bold text-rose-900 mb-4">Clinical Scenarios</h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-1">
                  1. A patient with B- blood needs a transfusion. What blood types can they receive safely?
                </label>
                <input 
                  type="text" 
                  value={q1Answer}
                  onChange={(e) => setQ1Answer(e.target.value)}
                  placeholder="e.g. O+, AB-"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Format: comma separated, no spaces (e.g. A+,B-)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-1">
                  2. An A- mother gives birth to an O+ baby. Does she need to be given RhoGAM? (Yes/No)
                </label>
                <input 
                  type="text" 
                  value={q2Answer}
                  onChange={(e) => setQ2Answer(e.target.value)}
                  placeholder="Yes or No"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-1">
                  3. What surface antigens are present on the red blood cells of a person with AB+ blood?
                </label>
                <input 
                  type="text" 
                  value={q3Answer}
                  onChange={(e) => setQ3Answer(e.target.value)}
                  placeholder="e.g. A, B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">List them separated by commas (e.g. A,B,Rh)</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200">
              <button 
                onClick={checkAnswers}
                disabled={assessmentStatus === 'checking'}
                className="w-full bg-rose-700 hover:bg-rose-800 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {assessmentStatus === 'checking' ? 'Evaluating...' : 'Check Answers'}
              </button>

              {assessmentStatus === 'passed' && (
                <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <CheckCircle size={18} /> Correct! B- receives O- and B-. Mother needs RhoGAM. AB+ has A, B, and Rh antigens.
                </div>
              )}
              {assessmentStatus === 'failed' && (
                <div className="mt-3 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <XCircle size={18} /> Incorrect. Review compatibility rules and ensure formatting is exact.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
