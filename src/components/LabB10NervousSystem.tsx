import { useState, useEffect, useRef } from 'react';
import { Activity, Zap, CheckCircle2 } from 'lucide-react';
import LabHeader from './LabHeader';

type SimState = 'idle' | 'striking' | 'sensory' | 'synapse' | 'motor' | 'kicking';

export default function LabB10NervousSystem({ onExit }: { onExit?: () => void }) {
  const [simState, setSimState] = useState<SimState>('idle');
  const [bioTimeMs, setBioTimeMs] = useState(0);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [q1Correct, setQ1Correct] = useState<boolean | null>(null);
  const [q2Correct, setQ2Correct] = useState<boolean | null>(null);

  const animate = (time: number) => {
    // 1 biological ms = 40 real ms. 50 bio ms = 2000 real ms.
    const elapsedReal = time - startTimeRef.current;
    const currentBioTime = elapsedReal / 40;
    
    setBioTimeMs(currentBioTime);

    if (currentBioTime < 5) {
      setSimState('striking');
      requestRef.current = requestAnimationFrame(animate);
    } else if (currentBioTime < 25) {
      setSimState('sensory');
      requestRef.current = requestAnimationFrame(animate);
    } else if (currentBioTime < 30) {
      setSimState('synapse');
      requestRef.current = requestAnimationFrame(animate);
    } else if (currentBioTime < 50) {
      setSimState('motor');
      requestRef.current = requestAnimationFrame(animate);
    } else if (currentBioTime < 80) {
      setSimState('kicking');
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setSimState('idle');
      setBioTimeMs(0);
    }
  };

  const triggerReflex = () => {
    if (simState !== 'idle') return;
    setBioTimeMs(0);
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const getQuadBezierPoint = (t: number, p0: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}) => {
    const x = Math.pow(1-t, 2)*p0.x + 2*(1-t)*t*p1.x + Math.pow(t, 2)*p2.x;
    const y = Math.pow(1-t, 2)*p0.y + 2*(1-t)*t*p1.y + Math.pow(t, 2)*p2.y;
    return {x, y};
  };

  let sensoryDot = null;
  if (simState === 'sensory') {
    const t = (bioTimeMs - 5) / 20; // 5 to 25
    const pt = getQuadBezierPoint(Math.min(1, Math.max(0, t)), {x:250, y:250}, {x:480, y:250}, {x:480, y:150});
    sensoryDot = <circle cx={pt.x} cy={pt.y} r="6" fill="#3b82f6" className="animate-pulse" filter="drop-shadow(0 0 4px #3b82f6)" />;
  }

  let motorDot = null;
  if (simState === 'motor') {
    const t = (bioTimeMs - 30) / 20; // 30 to 50
    const pt = getQuadBezierPoint(Math.min(1, Math.max(0, t)), {x:420, y:150}, {x:300, y:150}, {x:180, y:180});
    motorDot = <circle cx={pt.x} cy={pt.y} r="6" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 4px #ef4444)" />;
  }

  let kickAngle = 0;
  if (simState === 'kicking') {
    // kick from bioTime 50 to 80, max at 65
    const progress = (bioTimeMs - 50) / 30; // 0 to 1
    kickAngle = Math.sin(progress * Math.PI) * -45; // up to -45 deg
  }

  const checkAnswers = () => {
    setQ1Correct(q1Answer.trim() === '50');
    setQ2Correct(q2Answer === 'sensory');
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Biology Lab: Nervous System & Reflex Arc" subtitle="Investigate the speed and pathways of a monosynaptic patellar reflex." />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        {/* Left Column: Theory */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4">The Patellar Reflex Arc</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              A reflex arc is a neural pathway that controls a reflex. In vertebrates, most sensory neurons do not pass directly into the brain, but synapse in the spinal cord. This allows for faster reflex actions.
            </p>
            <h3 className="text-lg font-semibold text-slate-800">Key Components</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Receptor:</strong> The muscle spindle in the patellar tendon detects the stretch from the hammer strike.
              </li>
              <li>
                <strong>Sensory (Afferent) Neuron:</strong> Carries the electrical action potential towards the Central Nervous System (CNS) via the dorsal root.
              </li>
              <li>
                <strong>Integration Center:</strong> In a monosynaptic reflex like this one, the sensory neuron directly synapses with the motor neuron in the spinal cord (gray matter).
              </li>
              <li>
                <strong>Motor (Efferent) Neuron:</strong> Carries the signal away from the CNS via the ventral root to the effector organ.
              </li>
              <li>
                <strong>Effector:</strong> The quadriceps muscle contracts, causing the lower leg to kick forward.
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-900 flex items-center mb-1"><Zap className="w-4 h-4 mr-2" /> Did you know?</h4>
              <p className="text-sm text-blue-800">The entire process, from hammer strike to muscle contraction, takes roughly 50 milliseconds (0.05 seconds).</p>
            </div>
          </div>
        </div>

        {/* Middle Column: Simulator */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center relative">
          <div className="flex items-center justify-between w-full mb-4">
            <h2 className="text-xl font-bold text-slate-800">Interactive Simulation</h2>
            <button
              onClick={triggerReflex}
              disabled={simState !== 'idle'}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Strike Knee
            </button>
          </div>

          <div className="bg-slate-800 w-full flex-1 rounded-xl flex items-center justify-center overflow-hidden border-4 border-slate-700 relative">
            <svg viewBox="0 0 600 400" className="w-full h-full">
              <defs>
                <filter id="glow-synapse">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Spinal Cord Cross Section */}
              <g transform="translate(450, 150)">
                <circle cx="0" cy="0" r="60" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="4" />
                <path d="M -10,-40 L 10,-40 L 10,-10 L 30,-20 L 30,20 L 10,10 L 10,40 L -10,40 L -10,10 L -30,20 L -30,-20 L -10,-10 Z" fill="#94a3b8" />
                
                {/* Synapse effect */}
                {simState === 'synapse' && (
                  <circle cx="0" cy="0" r="15" fill="#eab308" filter="url(#glow-synapse)" className="animate-ping" opacity="0.8" />
                )}
              </g>

              {/* Thigh */}
              <path d="M 50,100 L 100,50 L 280,220 L 220,280 Z" fill="#fca5a5" />
              
              {/* Muscle Quadriceps */}
              <ellipse cx="180" cy="180" rx="40" ry="20" fill={simState === 'kicking' ? '#ef4444' : '#f87171'} transform="rotate(45, 180, 180)" className="transition-colors duration-150" />

              {/* Lower Leg Group (rotates around knee) */}
              <g transform={`translate(250, 250) rotate(${kickAngle})`}>
                <path d="M -30,0 L 30,0 L 10,180 L -30,180 Z" fill="#fca5a5" />
                <circle cx="0" cy="0" r="30" fill="#f87171" />
              </g>

              {/* Nerve Pathways */}
              <path d="M 250,250 Q 480,250 480,150" fill="none" stroke="#60a5fa" strokeWidth="4" strokeDasharray="6 6" />
              <path d="M 420,150 Q 300,150 180,180" fill="none" stroke="#f87171" strokeWidth="4" strokeDasharray="6 6" />

              {/* Animated Signals */}
              {sensoryDot}
              {motorDot}

              {/* Hammer */}
              <g transform={`translate(280, 220) rotate(${simState === 'striking' ? (bioTimeMs/5)*-30 : 0})`}>
                <path d="M 0,0 L -15,30 L -25,25 L -10,-5 Z" fill="#78350f" />
                <circle cx="-20" cy="27" r="8" fill="#94a3b8" />
              </g>
            </svg>

            <div className="absolute top-4 left-4 bg-slate-900/80 text-white px-4 py-3 rounded-xl backdrop-blur-sm shadow-lg w-64 border border-slate-700">
              <div className="flex items-center text-sm font-semibold mb-2">
                <Activity className="w-4 h-4 mr-2 text-indigo-400" />
                Data Logger
              </div>
              <div className="space-y-1 text-sm font-mono text-slate-300">
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="text-white capitalize">{simState}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Elapsed:</span>
                  <span className="text-white">{bioTimeMs.toFixed(1)} ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Laboratory Assessment</h2>
            <p className="text-slate-600 text-sm mb-4">
              Observe the simulation data log. The hammer strikes at t=0ms. It takes ~24ms for the signal to reach the spinal cord and another ~26ms for the motor signal to reach the muscle and initiate contraction.
            </p>
          </div>

          <div className="flex-1 border-t border-slate-200 pt-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  1. If the distance from the knee to the spinal cord is exactly 1.2 meters, and the sensory signal takes 24 ms to arrive, calculate the conduction velocity of the sensory neuron.
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={q1Answer}
                    onChange={(e) => setQ1Answer(e.target.value)}
                    placeholder="e.g. 10"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="flex items-center text-slate-600 font-medium">m/s</span>
                </div>
                {q1Correct !== null && (
                  <div className={`mt-2 p-3 rounded-lg flex items-start space-x-2 ${q1Correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {q1Correct ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">Correct! v = d/t = 1.2 m / 0.024 s = 50 m/s.</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium ml-7">Incorrect. Remember to convert milliseconds (ms) to seconds (s) before dividing distance by time.</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  2. Which type of neuron carries the electrical signal <i>towards</i> the Central Nervous System?
                </label>
                <select
                  value={q2Answer}
                  onChange={(e) => setQ2Answer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                >
                  <option value="">Select a neuron type...</option>
                  <option value="motor">Motor Neuron (Efferent)</option>
                  <option value="sensory">Sensory Neuron (Afferent)</option>
                  <option value="interneuron">Interneuron</option>
                </select>
                {q2Correct !== null && (
                  <div className={`mt-2 p-3 rounded-lg flex items-start space-x-2 ${q2Correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {q2Correct ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">Correct! Afferent sensory neurons transmit the signal to the CNS.</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium ml-7">Incorrect. Try again.</span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={checkAnswers}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm flex justify-center items-center"
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
