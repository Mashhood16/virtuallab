import { useState, useEffect, useRef } from 'react';
import { BarChart3, Calculator, CheckCircle, XCircle, Play } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabM10StatisticsWheels({ onExit }: LabProps) {
  const [sectorsConfig, setSectorsConfig] = useState<number>(8);
  const sectorsData = [10, 20, 30, 40, 50, 60, 70, 80].slice(0, sectorsConfig);
  
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [outcomes, setOutcomes] = useState<number[]>([]);
  
  const angularVelocityRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  const [ansMedian, setAnsMedian] = useState<string>('');
  const [ansQ1, setAnsQ1] = useState<string>('');
  const [ansProb, setAnsProb] = useState<string>('');
  const [probTarget, setProbTarget] = useState<number>(20);
  const [feedback, setFeedback] = useState<{median: boolean | null, q1: boolean | null, prob: boolean | null}>({median: null, q1: null, prob: null});

  useEffect(() => {
    setOutcomes([]);
    rotationRef.current = 0;
    setRotation(0);
    setAnsMedian('');
    setAnsQ1('');
    setAnsProb('');
    setFeedback({median: null, q1: null, prob: null});
    // Set a new probability target when config changes
    const defaultData = [10, 20, 30, 40, 50, 60, 70, 80].slice(0, sectorsConfig);
    setProbTarget(defaultData[Math.floor(Math.random() * defaultData.length)]);
  }, [sectorsConfig]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Random initial velocity between 15 and 25
    angularVelocityRef.current = 15 + Math.random() * 10; 
    
    const animate = () => {
      rotationRef.current += angularVelocityRef.current;
      angularVelocityRef.current *= 0.985; // Friction

      setRotation(rotationRef.current);

      if (angularVelocityRef.current < 0.1) {
        setIsSpinning(false);
        const R = rotationRef.current % 360;
        const index = Math.floor(((360 - R) % 360) / (360 / sectorsConfig));
        const finalValue = sectorsData[index];
        setOutcomes(prev => [...prev, finalValue]);
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const calculateStats = () => {
    if (outcomes.length === 0) return { median: 0, q1: 0, prob: 0 };
    const sorted = [...outcomes].sort((a, b) => a - b);
    
    const getPercentile = (arr: number[], p: number) => {
      const index = (arr.length - 1) * p;
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index % 1;
      if (lower === upper) return arr[lower];
      return arr[lower] * (1 - weight) + arr[upper] * weight;
    };

    const median = getPercentile(sorted, 0.5);
    const q1 = getPercentile(sorted, 0.25);
    
    const countTarget = outcomes.filter(x => x === probTarget).length;
    const prob = countTarget / outcomes.length;

    return { median, q1, prob };
  };

  const checkAnswers = () => {
    const stats = calculateStats();
    
    const medianCorrect = Math.abs(parseFloat(ansMedian) - stats.median) < 0.1;
    const q1Correct = Math.abs(parseFloat(ansQ1) - stats.q1) < 0.1;
    const probCorrect = Math.abs(parseFloat(ansProb) - stats.prob) < 0.05;

    setFeedback({ median: medianCorrect, q1: q1Correct, prob: probCorrect });
  };

  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

  const createPieSectors = () => {
    const paths = [];
    const radius = 140;
    const cx = 200;
    const cy = 200;

    for (let i = 0; i < sectorsConfig; i++) {
      const startAngle = (i * 360) / sectorsConfig;
      const endAngle = ((i + 1) * 360) / sectorsConfig;
      
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const midRad = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
      const textX = cx + (radius * 0.65) * Math.cos(midRad);
      const textY = cy + (radius * 0.65) * Math.sin(midRad);

      paths.push(
        <g key={i}>
          <path d={d} fill={colors[i % colors.length]} stroke="#ffffff" strokeWidth="2" />
          <text x={textX} y={textY} fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" transform={`rotate(${(startAngle + endAngle)/2}, ${textX}, ${textY})`}>
            {sectorsData[i]}
          </text>
        </g>
      );
    }
    return paths;
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Experimental Probability & Statistics" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto w-full">
        {/* Column 1: Setup & Data */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-teal-800">
            <BarChart3 className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Data Logging</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Number of Sectors: {sectorsConfig}
            </label>
            <input 
              type="range" min="4" max="8" step="2" 
              value={sectorsConfig} onChange={(e) => setSectorsConfig(Number(e.target.value))}
              disabled={isSpinning || outcomes.length > 0}
              className="w-full accent-teal-600 disabled:opacity-50"
            />
            {outcomes.length > 0 && <p className="text-xs text-slate-500 mt-1">Clear data to change wheel config.</p>}
          </div>

          <div className="flex gap-2 mb-4">
            <button 
              onClick={spinWheel}
              disabled={isSpinning}
              className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> {isSpinning ? 'Spinning...' : 'Spin Wheel'}
            </button>
            <button 
              onClick={() => { setOutcomes([]); setFeedback({median: null, q1: null, prob: null}); }}
              disabled={isSpinning}
              className="py-2 px-4 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-medium rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg max-h-[300px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 border-b font-medium text-slate-600">Spin #</th>
                  <th className="px-4 py-2 border-b font-medium text-slate-600">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {outcomes.length === 0 ? (
                  <tr><td colSpan={2} className="px-4 py-4 text-center text-slate-500">No data recorded yet. Spin the wheel!</td></tr>
                ) : (
                  outcomes.map((val, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-slate-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2 font-semibold text-teal-700">{val}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Total Spins: <strong>{outcomes.length}</strong>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Physics Wheel Simulator</h2>
          
          <div className="relative" style={{ width: 400, height: 400 }}>
            {/* Flapper (Pointer) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 drop-shadow-md">
              <svg width="30" height="40" viewBox="0 0 30 40">
                <path d="M 0 0 L 30 0 L 15 35 Z" fill="#334155" />
                <circle cx="15" cy="8" r="4" fill="#94a3b8" />
              </svg>
            </div>

            {/* Wheel */}
            <svg 
              width="400" height="400" 
              className="drop-shadow-lg"
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
            >
              <circle cx="200" cy="200" r="145" fill="#e2e8f0" />
              {createPieSectors()}
              <circle cx="200" cy="200" r="15" fill="#334155" />
              <circle cx="200" cy="200" r="5" fill="#94a3b8" />
            </svg>
          </div>
        </div>

        {/* Column 3: Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-rose-700">
            <Calculator className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Data Analysis</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-sm text-slate-600">
              Spin the wheel at least 5 times to generate a meaningful dataset. Then calculate the statistics for your <strong>{outcomes.length}</strong> recorded outcomes.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                1. What is the Median of your dataset?
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" step="0.1"
                  value={ansMedian} onChange={(e) => setAnsMedian(e.target.value)}
                  disabled={outcomes.length === 0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100"
                />
                {feedback.median === true && <CheckCircle className="text-emerald-500 w-6 h-6" />}
                {feedback.median === false && <XCircle className="text-red-500 w-6 h-6" />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                2. What is the First Quartile (Q1)?
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" step="0.1"
                  value={ansQ1} onChange={(e) => setAnsQ1(e.target.value)}
                  disabled={outcomes.length === 0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100"
                />
                {feedback.q1 === true && <CheckCircle className="text-emerald-500 w-6 h-6" />}
                {feedback.q1 === false && <XCircle className="text-red-500 w-6 h-6" />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                3. What is the Experimental Probability of landing on {probTarget}? (Decimal 0.0 - 1.0)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" step="0.01"
                  value={ansProb} onChange={(e) => setAnsProb(e.target.value)}
                  disabled={outcomes.length === 0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100"
                />
                {feedback.prob === true && <CheckCircle className="text-emerald-500 w-6 h-6" />}
                {feedback.prob === false && <XCircle className="text-red-500 w-6 h-6" />}
              </div>
            </div>

            <button 
              onClick={checkAnswers}
              disabled={outcomes.length === 0}
              className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-medium rounded-lg transition-colors"
            >
              Check Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
