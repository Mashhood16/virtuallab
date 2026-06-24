import { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, Lock, Server,  Activity, FileWarning, Key, Save } from 'lucide-react';
import { useHistory } from '../store';
import LabHeader from './LabHeader';

export default function LabCS12Cybersecurity({ onExit }: { onExit?: () => void }) {
  const { addRecord } = useHistory();
  const startTime = useRef(Date.now());
  const [activeTab, setActiveTab] = useState<'network' | 'crypto'>('network');
  
  const [attack, setAttack] = useState<'none' | 'ddos' | 'ransomware'>('none');
  const [mitigation, setMitigation] = useState<'none' | 'waf' | 'backup'>('none');
  const [serverHealth, setServerHealth] = useState(100);
  
  const [cipherType, setCipherType] = useState<'caesar' | 'vigenere'>('caesar');
  const [cryptoInput, setCryptoInput] = useState('SECURITY');
  const [cryptoKey, setCryptoKey] = useState('3');
  const [cryptoOutput, setCryptoOutput] = useState('');
  
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (attack === 'ddos' && mitigation !== 'waf') {
        interval = setInterval(() => setServerHealth(h => Math.max(0, h - 5)), 500);
    } else if (attack === 'ransomware' && mitigation !== 'backup') {
        interval = setInterval(() => setServerHealth(h => Math.max(0, h - 10)), 1000);
    } else {
        interval = setInterval(() => setServerHealth(h => Math.min(100, h + 2)), 1000);
    }
    return () => clearInterval(interval);
  }, [attack, mitigation]);

  useEffect(() => {
    if (cipherType === 'caesar') {
      const shift = parseInt(cryptoKey) || 0;
      const out = cryptoInput.toUpperCase().split('').map(c => {
        if (c >= 'A' && c <= 'Z') {
          return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
        }
        return c;
      }).join('');
      setCryptoOutput(out);
    } else {
      const key = cryptoKey.toUpperCase().replace(/[^A-Z]/g, '') || 'A';
      const out = cryptoInput.toUpperCase().split('').map((c, i) => {
        if (c >= 'A' && c <= 'Z') {
          const shift = key.charCodeAt(i % key.length) - 65;
          return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
        }
        return c;
      }).join('');
      setCryptoOutput(out);
    }
  }, [cipherType, cryptoInput, cryptoKey]);

  const checkAnswers = () => {
    const q1Correct = q1Answer.toLowerCase().trim() === 'waf';
    const q2Correct = q2Answer.toUpperCase().trim() === 'HELLO';
    
    if (q1Correct && q2Correct) {
      setAssessmentStatus('Success! You have secured the network and decrypted the message.');
    } else {
      setAssessmentStatus('Some answers are incorrect. Review the concepts and try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans select-none overflow-hidden">
      <LabHeader onExit={onExit} variant="dark" title="Grade 12 InfoSec: Cyber Defense & Cryptography" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
              <Activity size={18} className="text-blue-500" />
              Cyber Threat Landscape
            </h2>
          </div>
          <div className="p-4 space-y-6 text-slate-600 text-sm">
            <section>
              <h3 className="font-semibold text-slate-800 mb-2">Network Attacks</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li><strong>DDoS (Distributed Denial of Service):</strong> Overwhelming a server with massive traffic from multiple sources to make it unavailable.</li>
                <li><strong>Ransomware:</strong> Malware that encrypts system files, demanding payment for the decryption key.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold text-slate-800 mb-2">Mitigation Strategies</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li><strong>WAF (Web Application Firewall):</strong> Filters and blocks malicious traffic patterns before they hit the server.</li>
                <li><strong>Secure Backups:</strong> Offline, immutable backups ensure data recovery without paying ransoms.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold text-slate-800 mb-2">Symmetric Cryptography</h3>
              <p className="mb-2">Uses the same key for encryption and decryption.</p>
              <ul className="list-disc pl-4 space-y-2">
                <li><strong>Caesar Cipher:</strong> A simple substitution cipher that shifts letters by a fixed amount.</li>
                <li><strong>Vigenère Cipher:</strong> Uses a keyword to apply varying Caesar shifts across the message.</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'network' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('network')}
            >
              Network Monitor
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'crypto' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('crypto')}
            >
              Cipher Machine
            </button>
          </div>
          
          <div className="flex-1 p-4 flex flex-col bg-slate-900 text-slate-200 relative overflow-hidden">
            {activeTab === 'network' ? (
              <div className="flex flex-col h-full gap-4">
                <div className="flex justify-between flex-wrap gap-2">
                  <div className="space-x-2">
                    <button onClick={() => setAttack('ddos')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${attack === 'ddos' ? 'bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Simulate DDoS</button>
                    <button onClick={() => setAttack('ransomware')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${attack === 'ransomware' ? 'bg-orange-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Simulate Ransomware</button>
                    <button onClick={() => setAttack('none')} className="px-3 py-1.5 rounded text-xs font-bold bg-slate-700 hover:bg-slate-600 transition-colors">Clear Threats</button>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => setMitigation(mitigation === 'waf' ? 'none' : 'waf')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${mitigation === 'waf' ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Toggle WAF</button>
                    <button onClick={() => setMitigation(mitigation === 'backup' ? 'none' : 'backup')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${mitigation === 'backup' ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Deploy Backup</button>
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className={`flex flex-col items-center transition-colors duration-500 ${serverHealth < 30 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {attack === 'ransomware' && mitigation !== 'backup' ? (
                        <FileWarning size={72} className="animate-pulse" />
                      ) : (
                        <Server size={72} className={attack === 'ddos' && mitigation !== 'waf' ? 'animate-bounce' : ''} />
                      )}
                      <div className="mt-4 font-mono text-sm bg-slate-900 px-3 py-1 rounded border border-slate-800">
                        Main Server ({serverHealth}%)
                      </div>
                    </div>
                  </div>
                  
                  {mitigation === 'waf' && (
                    <div className="absolute left-1/4 top-1/2 -translate-y-1/2 text-blue-500 opacity-80 z-20">
                      <Shield size={120} className="animate-pulse" />
                    </div>
                  )}

                  <div className="absolute left-0 top-0 bottom-0 w-1/4 pointer-events-none z-0">
                    {Array.from({ length: attack === 'ddos' ? 40 : 8 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`absolute h-1.5 w-6 rounded-full ${attack === 'ddos' ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `-${Math.random() * 20}%`,
                          animation: `slideRight ${Math.random() * 1 + 0.5}s linear infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full gap-6">
                <div className="flex gap-6 justify-center bg-slate-800 p-3 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input type="radio" checked={cipherType === 'caesar'} onChange={() => setCipherType('caesar')} className="accent-blue-500 w-4 h-4" /> Caesar Cipher
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input type="radio" checked={cipherType === 'vigenere'} onChange={() => setCipherType('vigenere')} className="accent-blue-500 w-4 h-4" /> Vigenère Cipher
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Plaintext Input</label>
                    <input 
                      type="text" 
                      value={cryptoInput} 
                      onChange={e => setCryptoInput(e.target.value)} 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Encryption Key {cipherType === 'caesar' ? '(Number)' : '(Word)'}</label>
                    <input 
                      type={cipherType === 'caesar' ? 'number' : 'text'} 
                      value={cryptoKey} 
                      onChange={e => setCryptoKey(e.target.value)} 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-emerald-400 font-mono uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Lock size={32} className="text-slate-500 mb-4" />
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-700 w-full text-center shadow-inner">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Ciphertext Output</label>
                    <div className="font-mono text-2xl tracking-[0.25em] text-blue-400 break-all">
                      {cryptoOutput || '...'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <style>{`
              @keyframes slideRight {
                to { transform: translateX(800px); }
              }
            `}</style>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
              <Key size={18} className="text-amber-500" />
              Security Assessment
            </h2>
          </div>
          <div className="p-4 space-y-6 flex-1">
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 leading-relaxed">
                1. Your server is flooded with traffic and the health is rapidly decreasing. What mitigation tool should you deploy? (Hint: 3 letters)
              </label>
              <input
                type="text"
                value={q1Answer}
                onChange={(e) => setQ1Answer(e.target.value)}
                placeholder="Enter acronym..."
                className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono bg-slate-50"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 leading-relaxed">
                2. You intercepted a message encrypted with a Caesar Cipher using Shift = 3. 
                The ciphertext is <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">KHOOR</code>. Use the Cipher Machine backwards (or mental math) to decrypt it.
              </label>
              <input
                type="text"
                value={q2Answer}
                onChange={(e) => setQ2Answer(e.target.value)}
                placeholder="Enter plaintext..."
                className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono bg-slate-50"
              />
            </div>

            <button
              onClick={checkAnswers}
              className="w-full bg-slate-800 text-white font-medium py-3 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
              Verify Solutions
            </button>

            {assessmentStatus && (
              <div className={`p-4 rounded-lg text-sm font-medium border ${assessmentStatus.includes('Success') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                {assessmentStatus}
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 mt-6">
              <button 
                onClick={() => {
                  let score = 0;
                  if (q1Answer.toLowerCase().trim() === 'waf') score += 50;
                  if (q2Answer.toUpperCase().trim() === 'HELLO') score += 50;

                  addRecord({
                    labId: 'cs12_cybersecurity',
                    title: 'InfoSec: Cyber Defense & Cryptography',
                    subject: 'Computer Science',
                    score,
                    maxScore: 100,
                    timeSpentSeconds: Math.floor((Date.now() - startTime.current) / 1000),
                    experimentData: {
                      'Final Server Health': serverHealth + '%',
                      'Active Attack': attack,
                      'Active Mitigation': mitigation,
                      'Cipher Used': cipherType,
                      'Q1 Attempt': q1Answer,
                      'Q2 Attempt': q2Answer
                    }
                  });
                  if (onExit) onExit();
                }}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <Save size={20} />
                Submit Results & Exit
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
