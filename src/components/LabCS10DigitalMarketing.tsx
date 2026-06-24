import { useState, useEffect, useRef } from 'react';
import { Presentation, ThumbsUp, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  onExit?: () => void;
}

export default function LabCS10DigitalMarketing({ onExit }: Props) {
  // Social Media Simulator
  const [budget, setBudget] = useState<number>(100);
  const [targeting, setTargeting] = useState<'broad' | 'niche'>('broad');
  const [simRunning, setSimRunning] = useState(false);
  const [metrics, setMetrics] = useState<{t: number, likes: number, clicks: number, sales: number}[]>([]);
  const [simTime, setSimTime] = useState(0);

  const budgetRef = useRef(budget);
  const targetingRef = useRef(targeting);

  useEffect(() => { budgetRef.current = budget; targetingRef.current = targeting; }, [budget, targeting]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (simRunning) {
      timer = setInterval(() => {
        setSimTime(t => t + 1);
        setMetrics(prev => {
          const last = prev[prev.length - 1] || { t: 0, likes: 0, clicks: 0, sales: 0 };
          if (last.t >= 20) {
            setSimRunning(false);
            return prev;
          }
          const isBroad = targetingRef.current === 'broad';
          const newLikes = last.likes + Math.floor(Math.random() * (isBroad ? 25 : 8));
          const newClicks = last.clicks + Math.floor(Math.random() * (isBroad ? 5 : 12));
          const newSales = last.sales + (Math.random() < (isBroad ? 0.05 : 0.3) ? 1 : 0);
          return [...prev, { t: last.t + 1, likes: newLikes, clicks: newClicks, sales: newSales }];
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [simRunning, simTime]);

  const resetSim = () => {
    setMetrics([]);
    setSimTime(0);
    setSimRunning(false);
  };

  const finalMetrics = metrics[metrics.length - 1] || { likes: 0, clicks: 0, sales: 0 };
  const [roiAns, setRoiAns] = useState<string>('');

  // Graph Paths
  const maxLikes = 500;
  const maxSales = 20;
  const pointsLikes = metrics.map((p, i) => `${(i / 20) * 100},${100 - Math.min((p.likes / maxLikes) * 100, 100)}`).join(' ');
  const pointsSales = metrics.map((p, i) => `${(i / 20) * 100},${100 - Math.min((p.sales / maxSales) * 100, 100)}`).join(' ');

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-pink-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp /> Digital Marketing Lab</h1>
        {onExit && <button onClick={onExit} className="bg-pink-800 px-4 py-2 rounded hover:bg-pink-700 transition">Exit Lab</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        
        {/* LEFT COLUMN: Setup */}
        <div className="bg-slate-50 p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">1. Campaign Setup</h2>
          <p className="text-sm text-slate-600 mb-4">Design your social media ad campaign. Broad targeting gets more views, but niche targeting may convert better.</p>
          
          <div>
            <label className="block text-sm font-bold mb-1">Ad Budget ($)</label>
            <input 
              type="range" min="50" max="500" step="50" 
              value={budget} 
              onChange={e => setBudget(Number(e.target.value))}
              disabled={simRunning}
              className="w-full accent-pink-600"
            />
            <div className="text-right font-mono font-bold text-pink-600">${budget}</div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Target Audience</label>
            <select 
              value={targeting} 
              onChange={e => setTargeting(e.target.value as 'broad'|'niche')}
              disabled={simRunning}
              className="w-full p-2 border rounded"
            >
              <option value="broad">Broad (18-65+, Global)</option>
              <option value="niche">Niche (25-34, Local Tech Enthusiasts)</option>
            </select>
          </div>

          <button 
            onClick={() => { resetSim(); setSimRunning(true); }}
            disabled={simRunning}
            className="mt-4 w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 disabled:opacity-50"
          >
            {simRunning ? 'Simulation Running...' : 'Launch Campaign'}
          </button>
        </div>

        {/* MIDDLE COLUMN: Simulation */}
        <div className="bg-slate-50 p-5 rounded-xl shadow-sm flex flex-col items-center justify-center border border-slate-200 relative">
          <div className="w-full max-w-sm bg-slate-100 rounded-xl border border-slate-300 overflow-hidden shadow-sm">
            <div className="p-3 border-b bg-slate-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white"><ThumbsUp size={16}/></div>
              <div>
                <p className="font-bold text-sm">TechGadget Store</p>
                <p className="text-xs text-slate-500">Sponsored</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 text-sm">
              Upgrade your setup with our latest smart accessories! Click to learn more. 🚀
            </div>
            <div className="h-40 bg-slate-200 flex items-center justify-center border-y">
               <Presentation size={48} className="text-slate-400" />
            </div>
            <div className="p-3 bg-slate-50 flex justify-between text-slate-500 text-sm">
               <span className="font-medium text-blue-600">{finalMetrics.likes} Likes</span>
               <span>{finalMetrics.clicks} Clicks</span>
            </div>
          </div>

          {simRunning && (
            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded animate-pulse">
              LIVE DATA...
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Analytics */}
        <div className="bg-slate-50 p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-200 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800">3. Analytics & ROI</h2>
          
          <div className="bg-slate-50 p-4 rounded-lg border">
             <h3 className="font-bold flex items-center gap-2 mb-2"><BarChart3 size={18}/> Performance Graph</h3>
             <svg viewBox="0 0 100 100" className="w-full h-32 bg-slate-50 rounded border overflow-visible">
               {/* Likes line */}
               <polyline points={pointsLikes} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
               {/* Sales line */}
               <polyline points={pointsSales} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
             </svg>
             <div className="flex gap-4 text-xs mt-2 justify-center">
               <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Likes</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Sales</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-sm font-bold">
             <div className="bg-slate-100 p-2 rounded">Sales: <span className="text-green-600">{finalMetrics.sales}</span></div>
             <div className="bg-slate-100 p-2 rounded">Revenue: <span className="text-green-600">${finalMetrics.sales * 50}</span></div>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 mt-auto">
             <h3 className="font-bold mb-2 flex items-center gap-2"><DollarSign size={18}/> Calculate ROI</h3>
             <p className="text-xs mb-2">Revenue = Sales * $50. Calculate Profit (Revenue - Budget). Is it positive or negative?</p>
             <input type="number" value={roiAns} onChange={e => setRoiAns(e.target.value)} className="w-full p-2 border rounded mb-2 text-sm" placeholder="Enter calculated profit ($)" />
             <button className="w-full bg-pink-600 text-white py-2 rounded font-bold" onClick={() => {
               const profit = (finalMetrics.sales * 50) - budget;
               if (Number(roiAns) === profit) alert("Correct! Excellent analysis.");
               else alert(`Incorrect. Formula is: (${finalMetrics.sales} * $50) - $${budget} = $${profit}.`);
             }}>Check Answer</button>
          </div>

        </div>
      </div>
    </div>
  );
}
