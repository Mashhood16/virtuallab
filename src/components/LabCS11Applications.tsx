import { useState, useMemo } from 'react';
import { Cpu, Radio, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS11Applications({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState<'iot' | 'blockchain'>('iot');

  // IoT State
  const [motion, setMotion] = useState(false);
  const [pressure, setPressure] = useState(0);
  const [pressureThreshold, setPressureThreshold] = useState(50);
  const alarmOn = motion && (pressure > pressureThreshold);

  // Blockchain State
  const [rawBlocks, setRawBlocks] = useState([
    { id: 1, data: 'Genesis', nonce: 42 },
    { id: 2, data: 'Tx1', nonce: 15 },
    { id: 3, data: 'Tx2', nonce: 99 },
  ]);

  const computeHash = (id: number, data: string, prevHash: number, nonce: number) => {
    let dataSum = 0;
    for (let i = 0; i < data.length; i++) dataSum += data.charCodeAt(i);
    return Math.abs(id * 100 + dataSum * 13 + prevHash * 7 + nonce * 31) % 10000;
  };

  const blocks = useMemo(() => {
    const computed = [];
    let prevHash = 0;
    for (const b of rawBlocks) {
      const hash = computeHash(b.id, b.data, prevHash, b.nonce);
      computed.push({ ...b, prevHash, hash });
      prevHash = hash;
    }
    return computed;
  }, [rawBlocks]);

  const updateBlock = (index: number, field: string, value: string | number) => {
    const newRaw = [...rawBlocks];
    newRaw[index] = { ...newRaw[index], [field]: value as never };
    setRawBlocks(newRaw);
  };

  const [assessmentAns, setAssessmentAns] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkAnswer = () => {
    if (activeTab === 'iot') {
      if (parseInt(assessmentAns) === pressureThreshold) {
        setFeedback('Correct! The alarm only triggers when pressure exceeds the threshold AND motion is detected.');
      } else {
        setFeedback('Incorrect. Check your threshold slider setting.');
      }
    } else {
      const b2 = blocks[1];
      if (b2.hash < 1000) {
        if (parseInt(assessmentAns) === b2.nonce) {
          setFeedback('Correct! You successfully mined the block by finding a valid nonce.');
        } else {
          setFeedback('Incorrect. Make sure you entered the correct valid nonce from Block 2.');
        }
      } else {
        setFeedback('Block 2 is not valid yet. Adjust the nonce until its Hash is < 1000 (turns green).');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab: Advanced Tech Applications" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden min-h-0">
        {/* Left Col */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 shrink-0">Concepts & Theory</h2>
          
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg shrink-0">
            <button 
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'iot' ? 'bg-slate-50 shadow text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => { setActiveTab('iot'); setFeedback(null); setAssessmentAns(''); }}
            >
              IoT Systems
            </button>
            <button 
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'blockchain' ? 'bg-slate-50 shadow text-purple-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => { setActiveTab('blockchain'); setFeedback(null); setAssessmentAns(''); }}
            >
              Blockchain
            </button>
          </div>

          <div className="text-slate-600 space-y-4 text-sm mt-2">
            {activeTab === 'iot' ? (
              <>
                <p><strong>Internet of Things (IoT)</strong> refers to interconnected physical devices equipped with sensors, processing ability, and software.</p>
                <p>Our virtual testbench features:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>PIR Sensor:</strong> Detects motion (boolean true/false).</li>
                  <li><strong>Pressure Pad:</strong> Detects physical weight (analog value 0-100).</li>
                  <li><strong>Logic Controller:</strong> Combines inputs using boolean logic to control an actuator (the Alarm system).</li>
                </ul>
                <div className="p-3 bg-slate-50 border rounded-md font-mono text-xs text-blue-800 mt-4">
                  if (motion == true && pressure &gt; threshold) {"{\n  triggerAlarm();\n}"}
                </div>
              </>
            ) : (
              <>
                <p><strong>Blockchain</strong> is a distributed, immutable ledger where transactions are grouped into cryptographically secured blocks.</p>
                <p>Key properties of our simulator:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Cryptographic Hash:</strong> A unique digital fingerprint. If ANY data changes, the hash changes completely.</li>
                  <li><strong>Chain:</strong> Each block contains the previous block's hash. Changing block 1 immediately invalidates blocks 2 and 3!</li>
                  <li><strong>Mining (Proof of Work):</strong> To make a block "valid" on the network, its hash must start with zeros (in our simulator, hash &lt; 1000). You must iteratively guess the <strong>Nonce</strong> to find a valid hash.</li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Middle Col */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4 shrink-0">
            {activeTab === 'iot' ? 'IoT Testbench Simulator' : 'Distributed Ledger Simulator'}
          </h2>

          {activeTab === 'iot' ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 border rounded-lg bg-slate-50 p-6 min-h-[400px]">
              <div className="flex flex-wrap gap-8 items-center w-full justify-center">
                <div className="flex flex-col items-center gap-4 bg-slate-50 p-4 rounded-xl border shadow-sm w-48">
                  <div className="font-semibold text-slate-700 flex items-center gap-2">
                    <Radio size={18} className="text-blue-500" /> PIR Sensor
                  </div>
                  <button 
                    onClick={() => setMotion(!motion)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 font-bold transition-all duration-300 ${motion ? 'border-green-500 bg-green-100 text-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'border-slate-300 bg-slate-100 text-slate-400'}`}
                  >
                    {motion ? 'ON' : 'OFF'}
                  </button>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Toggle Motion</span>
                </div>

                <div className="flex flex-col items-center gap-4 bg-slate-50 p-4 rounded-xl border shadow-sm w-48">
                  <div className="font-semibold text-slate-700 flex items-center gap-2">
                    <Cpu size={18} className="text-orange-500" /> Pressure Pad
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-800">{pressure} kg</div>
                  <input 
                    type="range" min="0" max="100" value={pressure} 
                    onChange={(e) => setPressure(parseInt(e.target.value))} 
                    className="w-full accent-orange-500"
                  />
                  <div className="w-full px-2 mt-2">
                    <label className="text-xs text-slate-500 flex justify-between items-center font-bold">
                      THRESHOLD: 
                      <input 
                        type="number" className="w-14 border rounded px-1 py-1 text-center font-mono text-sm outline-none focus:border-orange-400"
                        value={pressureThreshold} onChange={(e) => setPressureThreshold(parseInt(e.target.value) || 0)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="w-1 h-12 bg-slate-300 relative">
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-3 py-1 text-xs font-bold text-white rounded-md shadow">AND Logic</div>
              </div>

              <div className={`p-6 rounded-2xl border-4 flex items-center justify-center gap-4 w-64 transition-all duration-300 ${alarmOn ? 'bg-red-100 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-slate-100 border-slate-300'}`}>
                <AlertTriangle size={36} className={alarmOn ? 'text-red-600 animate-pulse' : 'text-slate-400'} />
                <span className={`text-2xl font-bold ${alarmOn ? 'text-red-700' : 'text-slate-500'}`}>
                  ALARM {alarmOn ? 'TRIGGERED' : 'OFF'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4 border rounded-lg bg-slate-50 p-4 overflow-y-auto">
              {blocks.map((block, i) => {
                const isValid = block.hash < 1000;
                return (
                  <div key={block.id} className={`p-4 rounded-xl border-2 transition-colors ${isValid ? 'border-green-400 bg-green-50/50' : 'border-red-400 bg-red-50/50'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Shield size={16} className={isValid ? 'text-green-600' : 'text-red-600'} /> 
                        Block #{block.id}
                      </h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isValid ? 'VALID (Hash < 1000)' : 'INVALID'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Payload Data</label>
                        <input 
                          type="text" value={block.data} 
                          onChange={(e) => updateBlock(i, 'data', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1.5 focus:border-purple-400 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Nonce (Mining Guess)</label>
                        <div className="flex gap-1">
                          <input 
                            type="number" value={block.nonce} 
                            onChange={(e) => updateBlock(i, 'nonce', parseInt(e.target.value) || 0)}
                            className="w-full border border-slate-300 rounded px-2 py-1.5 focus:border-purple-400 outline-none font-mono"
                          />
                          <button 
                            onClick={() => updateBlock(i, 'nonce', block.nonce + 1)}
                            className="px-3 bg-slate-200 hover:bg-slate-300 rounded font-bold text-slate-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-between bg-slate-50 p-3 rounded-lg border shadow-sm mt-1">
                        <div className="flex flex-col w-1/2 pr-3 border-r text-xs">
                          <span className="text-slate-400 font-bold uppercase mb-1">Previous Hash</span>
                          <span className="font-mono text-slate-600 text-lg tracking-widest">{block.prevHash.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="flex flex-col w-1/2 pl-3 text-xs">
                          <span className="text-slate-400 font-bold uppercase mb-1">Block Hash</span>
                          <span className={`font-mono font-bold text-lg tracking-widest ${isValid ? 'text-green-600' : 'text-red-600'}`}>{block.hash.toString().padStart(4, '0')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4 shrink-0">Assessment & Validation</h2>
          
          <div className="space-y-6 flex-1 pr-2">
            {activeTab === 'iot' ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Q: IoT Logic Configuration</h3>
                <p className="text-sm text-blue-900 mb-4 leading-relaxed">
                  In order for the alarm to trigger, motion must be ON and the pressure must exceed a specific limit.
                  What is the exact <strong>Threshold</strong> value currently configured in your simulated Logic Controller?
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={assessmentAns}
                    onChange={e => setAssessmentAns(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="Enter threshold..."
                  />
                  <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-sm transition-colors">Submit</button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">Q: Proof of Work (Mining)</h3>
                <p className="text-sm text-purple-900 mb-4 leading-relaxed">
                  A block is only cryptographically valid if its Hash is strictly less than 1000.
                  Find a valid Nonce for <strong>Block 2</strong> by adjusting it until the block turns green. What nonce did you find?
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={assessmentAns}
                    onChange={e => setAssessmentAns(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    placeholder="Enter valid nonce..."
                  />
                  <button onClick={checkAnswer} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-md text-sm transition-colors">Submit</button>
                </div>
              </div>
            )}

            {feedback && (
              <div className={`p-4 rounded-lg flex items-start gap-3 text-sm font-medium border ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                <div className="mt-0.5">
                  {feedback.includes('Correct') ? <CheckCircle size={18} /> : <XCircle size={18} />}
                </div>
                <div className="leading-relaxed">{feedback}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
