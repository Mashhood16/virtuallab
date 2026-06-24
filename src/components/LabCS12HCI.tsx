import { useState, useRef } from 'react';
import { Monitor, Shield, Activity, Eye, CheckCircle, XCircle, Save } from 'lucide-react';
import { useHistory } from '../store';
import LabHeader from './LabHeader';

export default function LabCS12HCI({ onExit }: { onExit?: () => void }) {
  const { addRecord } = useHistory();
  const startTime = useRef(Date.now());
  const [design, setDesign] = useState<'A' | 'B'>('A');
  const [contrast, setContrast] = useState<'Normal' | 'High'>('Normal');
  const [fontSize, setFontSize] = useState<'Normal' | 'Large'>('Normal');
  const [mfa, setMfa] = useState<'None' | 'SMS' | 'App'>('None');

  const accessibility = 40 + (contrast === 'High' ? 30 : 0) + (fontSize === 'Large' ? 30 : 0);
  const security = 20 + (mfa === 'None' ? 0 : mfa === 'SMS' ? 40 : 70);
  const usability = 80 - (mfa === 'SMS' ? 10 : mfa === 'App' ? 20 : 0) + (design === 'B' ? 10 : 0);
  const conversion = 50 + (design === 'B' ? 20 : 0) - (mfa === 'App' ? 15 : 0);

  const [q1Answer, setQ1Answer] = useState<boolean | null>(null);
  const [q2Answer, setQ2Answer] = useState<boolean | null>(null);

  const checkQ1 = () => {
    if (accessibility >= 90 && usability >= 70) {
      setQ1Answer(true);
    } else {
      setQ1Answer(false);
    }
  };

  const checkQ2 = () => {
    if (security >= 80 && conversion >= 50) {
      setQ2Answer(true);
    } else {
      setQ2Answer(false);
    }
  };

  const handleComplete = () => {
    const score = (q1Answer ? 50 : 0) + (q2Answer ? 50 : 0);
    addRecord({
      labId: 'cs12_hci',
      title: 'Human-Computer Interaction (HCI)',
      subject: 'Computer Science',
      score,
      maxScore: 100,
      timeSpentSeconds: Math.floor((Date.now() - startTime.current) / 1000),
      experimentData: {
        'Final Accessibility': accessibility,
        'Final Security': security,
        'Final Usability': usability,
        'Final Conversion': conversion + '%',
      }
    });
    if (onExit) onExit();
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} variant="dark" title="Interactive Software Engineering (HCI)" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Theory Column */}
        <div className="bg-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2">Theory & Context</h2>
          <div className="space-y-4 text-slate-700 overflow-y-auto pr-2 flex-1">
            <p>
              <strong>Human-Computer Interaction (HCI)</strong> is the study of how people interact with computers and to what extent computers are or are not developed for successful interaction with human beings.
            </p>
            <h3 className="font-semibold text-indigo-700 mt-2">A/B Testing</h3>
            <p>
              A/B testing compares two versions of a web page or app against each other to determine which one performs better in terms of user conversion and engagement.
            </p>
            <h3 className="font-semibold text-indigo-700 mt-2">Accessibility</h3>
            <p>
              Accessibility ensures that software is usable by people with various disabilities. High contrast modes and larger text sizes dramatically increase accessibility scores.
            </p>
            <h3 className="font-semibold text-indigo-700 mt-2">Usability vs. Security</h3>
            <p>
              Implementing Multi-Factor Authentication (MFA) increases security but often creates friction, reducing usability and sometimes lowering conversion rates. The goal is to balance these trade-offs.
            </p>
          </div>
        </div>

        {/* Simulation Column */}
        <div className="bg-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2">UI Configurator Simulator</h2>

          <div className="flex-1 flex flex-col gap-4">
            <div className={`flex-1 rounded-lg border-2 border-dashed p-4 flex flex-col items-center justify-center transition-all ${contrast === 'High' ? 'bg-black text-yellow-400 border-yellow-400' : 'bg-slate-100 text-slate-800 border-slate-300'}`}>
              <h3 className={`font-bold mb-2 ${fontSize === 'Large' ? 'text-3xl' : 'text-xl'}`}>
                {design === 'A' ? 'Standard Dashboard (Design A)' : 'Modern Workspace (Design B)'}
              </h3>
              <p className={`text-center mb-4 ${fontSize === 'Large' ? 'text-xl' : 'text-sm'}`}>
                Welcome back. Please authenticate to continue.
              </p>
              {mfa === 'None' && <div className="px-4 py-2 bg-blue-500 text-white rounded">Login via Password</div>}
              {mfa === 'SMS' && <div className="px-4 py-2 bg-blue-600 text-white rounded">Login via Password + SMS OTP</div>}
              {mfa === 'App' && <div className="px-4 py-2 bg-blue-700 text-white rounded">Login via Biometric App Auth</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">Layout Design</label>
                <select value={design} onChange={(e) => setDesign(e.target.value as 'A' | 'B')} className="w-full p-2 border rounded">
                  <option value="A">Design A (Standard)</option>
                  <option value="B">Design B (Modern)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">Contrast Mode</label>
                <select value={contrast} onChange={(e) => setContrast(e.target.value as 'Normal' | 'High')} className="w-full p-2 border rounded">
                  <option value="Normal">Normal Contrast</option>
                  <option value="High">High Contrast</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">Font Size</label>
                <select value={fontSize} onChange={(e) => setFontSize(e.target.value as 'Normal' | 'Large')} className="w-full p-2 border rounded">
                  <option value="Normal">Normal Text</option>
                  <option value="Large">Large Text</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">MFA Level</label>
                <select value={mfa} onChange={(e) => setMfa(e.target.value as 'None' | 'SMS' | 'App')} className="w-full p-2 border rounded">
                  <option value="None">No MFA</option>
                  <option value="SMS">SMS OTP</option>
                  <option value="App">Authenticator App</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2">
              <div className="bg-slate-50 p-2 rounded text-center">
                <div className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1"><Eye size={12} /> A11y</div>
                <div className={`text-lg font-bold ${accessibility >= 90 ? 'text-green-600' : 'text-slate-700'}`}>{accessibility}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded text-center">
                <div className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1"><Shield size={12} /> Sec</div>
                <div className={`text-lg font-bold ${security >= 80 ? 'text-green-600' : 'text-slate-700'}`}>{security}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded text-center">
                <div className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1"><Monitor size={12} /> Usability</div>
                <div className="text-lg font-bold text-slate-700">{usability}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded text-center">
                <div className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1"><Activity size={12} /> Conv</div>
                <div className="text-lg font-bold text-slate-700">{conversion}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Column */}
        <div className="bg-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2">Analysis & Assessment</h2>

          <div className="space-y-6 flex-1">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Task 1: Accessible Design</h3>
              <p className="text-sm text-slate-600 mb-3">
                Configure the UI to achieve an <strong>Accessibility score of 90 or higher</strong> while keeping the <strong>Usability score at 70 or higher</strong>.
              </p>
              <button
                onClick={checkQ1}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Check Configuration
              </button>
              {q1Answer === true && <p className="text-green-600 mt-2 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} /> Target reached!</p>}
              {q1Answer === false && <p className="text-red-500 mt-2 text-sm font-bold flex items-center gap-1"><XCircle size={16} /> Criteria not met yet.</p>}
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Task 2: Secure Conversions</h3>
              <p className="text-sm text-slate-600 mb-3">
                Configure the UI to achieve a <strong>Security score of 80 or higher</strong> while maintaining a <strong>Conversion rate of 50% or higher</strong>.
              </p>
              <button
                onClick={checkQ2}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Check Configuration
              </button>
              {q2Answer === true && <p className="text-green-600 mt-2 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} /> Target reached!</p>}
              {q2Answer === false && <p className="text-red-500 mt-2 text-sm font-bold flex items-center gap-1"><XCircle size={16} /> Criteria not met yet.</p>}
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-800">
              <p className="font-bold mb-1">Engineering Takeaway</p>
              <p>In software engineering, every UI/UX and security decision requires a trade-off. Extreme security reduces user conversions, while high accessibility requires specialized UI layouts.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-auto">
            <button
              onClick={handleComplete}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              <Save size={20} />
              Submit Results & Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
