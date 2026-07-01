import { useState, useMemo } from 'react';
import { ArrowLeft, Box, Database, BarChart3, PieChart, CheckCircle } from 'lucide-react';

export default function LabM7MensurationData({ onExit }: { onExit?: () => void }) {
 const [tab, setTab] = useState<'volume' | 'data'>('volume');

 // Volume State
 const [shape, setShape] = useState<'cylinder' | 'prism'>('cylinder');
 const [cylR, setCylR] = useState(3);
 const [cylH, setCylH] = useState(8);
 const [prismL, setPrismL] = useState(4);
 const [prismW, setPrismW] = useState(4);
 const [prismH, setPrismH] = useState(6);
 const [fillPercent, setFillPercent] = useState(50);

 // Data State
 const [dataStr, setDataStr] = useState('5, 2, 8, 5, 2, 5, 9, 10');
 const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
 const [dataAnswer, setDataAnswer] = useState('');
 const [dataQStatus, setDataQStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 // Volume calculations
 const cylVol = (Math.PI * cylR * cylR * cylH).toFixed(1);
 const cylLiq = (Math.PI * cylR * cylR * cylH * (fillPercent / 100)).toFixed(1);

 const prismVol = (prismL * prismW * prismH).toFixed(1);
 const prismLiq = (prismL * prismW * prismH * (fillPercent / 100)).toFixed(1);

 // Data calculations
 const parsedData = useMemo(() => {
 return dataStr
  .split(',')
  .map((s) => parseFloat(s.trim()))
  .filter((n) => !isNaN(n));
 }, [dataStr]);

 const stats = useMemo(() => {
 if (parsedData.length === 0) return { mean: 0, median: 0, mode: 0, freqs: {} };
 const sum = parsedData.reduce((a, b) => a + b, 0);
 const mean = sum / parsedData.length;

 const sorted = [...parsedData].sort((a, b) => a - b);
 const mid = Math.floor(sorted.length / 2);
 const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

 const freqs: Record<number, number> = {};
 parsedData.forEach((v) => (freqs[v] = (freqs[v] || 0) + 1));
 let mode = parsedData[0];
 let maxFreq = 0;
 for (const [vStr, count] of Object.entries(freqs)) {
  if (count > maxFreq) {
  maxFreq = count;
  mode = parseFloat(vStr);
  }
 }

 return { mean, median, mode, freqs };
 }, [parsedData]);

 const checkDataAnswer = () => {
 if (parseFloat(dataAnswer) === stats.mode) {
  setDataQStatus('correct');
 } else {
  setDataQStatus('incorrect');
 }
 };

 const renderVolumeSvg = () => {
 const cx = 300;
 const cy = 250;

 if (shape === 'cylinder') {
  const scale = 15;
  const rPx = cylR * scale;
  const hPx = cylH * scale;
  const topY = cy - hPx / 2;
  const botY = cy + hPx / 2;
  const rx = rPx;
  const ry = rPx * 0.3;
  const liqH = hPx * (fillPercent / 100);
  const liqTopY = botY - liqH;

  return (
  <svg className="w-full h-full drop-shadow-md" viewBox="0 0 600 500">
   <defs>
   <linearGradient id="liqGradCyl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
   </linearGradient>
   </defs>
   <path
   d={`M ${cx - rx} ${botY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${botY}`}
   stroke="currentColor"
   fill="none"
   className="text-slate-400 opacity-50"
   strokeDasharray="4 4"
   />
   {fillPercent > 0 && (
   <g>
    <path
    d={`M ${cx - rx} ${liqTopY} L ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${botY} L ${cx + rx} ${liqTopY} A ${rx} ${ry} 0 0 1 ${cx - rx} ${liqTopY} Z`}
    fill="url(#liqGradCyl)"
    />
    <ellipse cx={cx} cy={liqTopY} rx={rx} ry={ry} fill="#60a5fa" opacity="0.9" />
   </g>
   )}
   <path
   d={`M ${cx - rx} ${topY} L ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${botY} L ${cx + rx} ${topY}`}
   stroke="currentColor"
   fill="none"
   strokeWidth="2"
   className="text-slate-700 dark:text-[#a1a1aa]"
   />
   <ellipse cx={cx} cy={topY} rx={rx} ry={ry} stroke="currentColor" fill="rgba(255,255,255,0.05)" strokeWidth="2" className="text-slate-700 dark:text-[#a1a1aa]" />
   
   {/* Dimension Lines & Labels */}
   <line x1={cx} y1={topY} x2={cx + rx} y2={topY} stroke="currentColor" className="text-rose-500" strokeWidth="2" />
   <text x={cx + rx / 2} y={topY - 10} fill="currentColor" className="text-rose-600 dark:text-rose-400 font-bold" textAnchor="middle">
   r={cylR}
   </text>
   <line x1={cx + rx + 20} y1={topY} x2={cx + rx + 20} y2={botY} stroke="currentColor" className="text-emerald-500" strokeWidth="2" />
   <text x={cx + rx + 30} y={cy} fill="currentColor" className="text-emerald-600 dark:text-emerald-400 font-bold" alignmentBaseline="middle">
   h={cylH}
   </text>
  </svg>
  );
 } else {
  const scale = 15;
  const lPx = prismL * scale;
  const wPx = prismW * scale;
  const hPx = prismH * scale;

  const dx = wPx * 0.6;
  const dy = -wPx * 0.6;

  const v1 = { x: cx - lPx / 2, y: cy - hPx / 2 };
  const v2 = { x: cx + lPx / 2, y: cy - hPx / 2 };
  const v3 = { x: cx + lPx / 2, y: cy + hPx / 2 };
  const v4 = { x: cx - lPx / 2, y: cy + hPx / 2 };

  const b1 = { x: v1.x + dx, y: v1.y + dy };
  const b2 = { x: v2.x + dx, y: v2.y + dy };
  const b3 = { x: v3.x + dx, y: v3.y + dy };
  const b4 = { x: v4.x + dx, y: v4.y + dy };

  const liqH = hPx * (fillPercent / 100);
  const l1 = { x: v4.x, y: v4.y - liqH };
  const l2 = { x: v3.x, y: v3.y - liqH };
  const l3 = { x: b3.x, y: b3.y - liqH };
  const l4 = { x: b4.x, y: b4.y - liqH };

  return (
  <svg className="w-full h-full drop-shadow-md" viewBox="0 0 600 500">
   <line x1={v4.x} y1={v4.y} x2={b4.x} y2={b4.y} stroke="currentColor" className="text-slate-400 opacity-50" strokeDasharray="4 4" />
   <line x1={b1.x} y1={b1.y} x2={b4.x} y2={b4.y} stroke="currentColor" className="text-slate-400 opacity-50" strokeDasharray="4 4" />
   <line x1={b4.x} y1={b4.y} x2={b3.x} y2={b3.y} stroke="currentColor" className="text-slate-400 opacity-50" strokeDasharray="4 4" />

   {fillPercent > 0 && (
   <g>
    <polygon points={`${v4.x},${v4.y} ${v3.x},${v3.y} ${l2.x},${l2.y} ${l1.x},${l1.y}`} fill="#3b82f6" opacity="0.8" />
    <polygon points={`${v3.x},${v3.y} ${b3.x},${b3.y} ${l3.x},${l3.y} ${l2.x},${l2.y}`} fill="#2563eb" opacity="0.85" />
    <polygon points={`${l1.x},${l1.y} ${l2.x},${l2.y} ${l3.x},${l3.y} ${l4.x},${l4.y}`} fill="#60a5fa" opacity="0.9" />
   </g>
   )}

   <polygon points={`${v1.x},${v1.y} ${v2.x},${v2.y} ${v3.x},${v3.y} ${v4.x},${v4.y}`} fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700 dark:text-[#a1a1aa]" />
   <polygon points={`${v1.x},${v1.y} ${b1.x},${b1.y} ${b2.x},${b2.y} ${v2.x},${v2.y}`} fill="rgba(255,255,255,0.05)" stroke="currentColor" strokeWidth="2" className="text-slate-700 dark:text-[#a1a1aa]" />
   <polygon points={`${v2.x},${v2.y} ${b2.x},${b2.y} ${b3.x},${b3.y} ${v3.x},${v3.y}`} fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700 dark:text-[#a1a1aa]" />

   {/* Labels */}
   <text x={(v4.x + v3.x) / 2} y={v4.y + 20} fill="currentColor" className="text-rose-600 dark:text-rose-400 font-bold" textAnchor="middle">
   L={prismL}
   </text>
   <text x={(v3.x + b3.x) / 2 + 10} y={(v3.y + b3.y) / 2 + 10} fill="currentColor" className="text-indigo-600 dark:text-indigo-400 font-bold">
   W={prismW}
   </text>
   <text x={v3.x + 10} y={(v2.y + v3.y) / 2} fill="currentColor" className="text-emerald-600 dark:text-emerald-400 font-bold">
   H={prismH}
   </text>
  </svg>
  );
 }
 };

 const renderBarGraph = () => {
 const width = 600;
 const height = 400;
 const pad = 50;

 const uniqueVals = Object.keys(stats.freqs).map(Number).sort((a, b) => a - b);
 if (uniqueVals.length === 0) return null;

 const minVal = Math.min(...uniqueVals, Math.floor(stats.mean)) - 1;
 const maxVal = Math.max(...uniqueVals, Math.ceil(stats.mean)) + 1;

 const maxFreq = Math.max(...Object.values(stats.freqs), 1);

 const xScale = (v: number) => pad + ((v - minVal) / (maxVal - minVal)) * (width - 2 * pad);
 const yScale = (f: number) => height - pad - (f / (maxFreq + 1)) * (height - 2 * pad);

 return (
  <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
  {/* Axes */}
  <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="currentColor" className="text-slate-800 dark:text-[#ffffff]" strokeWidth="2" />
  <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="currentColor" className="text-slate-800 dark:text-[#ffffff]" strokeWidth="2" />

  {/* Y-axis labels */}
  {Array.from({ length: maxFreq + 2 }).map((_, i) => (
   <text key={i} x={pad - 15} y={yScale(i)} textAnchor="end" alignmentBaseline="middle" fill="currentColor" className="text-xs text-slate-500 font-medium">
   {i}
   </text>
  ))}

  {/* X-axis labels & grid */}
  {uniqueVals.map((v) => (
   <g key={v}>
   <text x={xScale(v)} y={height - pad + 20} textAnchor="middle" fill="currentColor" className="text-xs text-slate-500 font-medium">
    {v}
   </text>
   </g>
  ))}

  {/* Bars */}
  {uniqueVals.map((v) => {
   const h = height - pad - yScale(stats.freqs[v]);
   return (
   <rect
    key={v}
    x={xScale(v) - 15}
    y={yScale(stats.freqs[v])}
    width={30}
    height={h}
    fill="#6366f1"
    className="hover:opacity-80 transition-opacity cursor-pointer drop-shadow-sm"
    rx="2"
   />
   );
  })}

  {/* Mean Line */}
  <line x1={xScale(stats.mean)} y1={pad} x2={xScale(stats.mean)} y2={height - pad} stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
  <text x={xScale(stats.mean)} y={pad - 10} textAnchor="middle" fill="#10b981" className="text-sm font-bold">
   Mean ({stats.mean.toFixed(1)})
  </text>
  </svg>
 );
 };

 const renderPieChart = () => {
 const cx = 300, cy = 200, r = 140;
 const total = parsedData.length;
 if (total === 0) return null;

 let startAngle = 0;
 const uniqueVals = Object.keys(stats.freqs).map(Number).sort((a, b) => a - b);
 const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#5560F1', '#ec4899', '#14b8a6'];

 return (
  <svg className="w-full h-full" viewBox="0 0 600 400">
  {uniqueVals.map((v, i) => {
   const freq = stats.freqs[v];
   const sliceAngle = (freq / total) * 360;

   const x1 = cx + r * Math.cos(((startAngle - 90) * Math.PI) / 180);
   const y1 = cy + r * Math.sin(((startAngle - 90) * Math.PI) / 180);
   const x2 = cx + r * Math.cos(((startAngle + sliceAngle - 90) * Math.PI) / 180);
   const y2 = cy + r * Math.sin(((startAngle + sliceAngle - 90) * Math.PI) / 180);
   const largeArc = sliceAngle > 180 ? 1 : 0;

   const pathData =
   sliceAngle === 360
    ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`
    : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

   const midAngle = startAngle + sliceAngle / 2;
   const lx = cx + r * 1.3 * Math.cos(((midAngle - 90) * Math.PI) / 180);
   const ly = cy + r * 1.3 * Math.sin(((midAngle - 90) * Math.PI) / 180);

   startAngle += sliceAngle;
   const color = colors[i % colors.length];

   return (
   <g key={v}>
    <path d={pathData} fill={color} stroke="currentColor" className="text-white dark:text-slate-800 drop-shadow-sm hover:opacity-90 transition-opacity" strokeWidth="2" />
    {sliceAngle > 5 && (
    <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" fill="currentColor" className="text-sm font-bold text-slate-700 dark:text-[#a1a1aa]">
     {v} ({freq})
    </text>
    )}
   </g>
   );
  })}
  </svg>
 );
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <div className="flex items-center p-4 bg-indigo-600 text-white shadow-md z-10">
  <button onClick={onExit} className="mr-4 hover:bg-indigo-700 p-2 rounded-full transition-colors dark:text-white dark:text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
   <ArrowLeft className="w-5 h-5" />
  </button>
  <h1 className="text-lg md:text-xl font-bold">Class 7 Maths: Mensuration & Data Handling</h1>
  </div>

  <div className="flex flex-1 overflow-hidden">
  {/* Left Column Controls */}
  <div className="w-1/3 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b]">
   {/* Tabs */}
   <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg mb-6 shadow-inner">
   <button
    onClick={() => setTab('volume')}
    className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center transition-colors ${ tab === 'volume' ? 'bg-white dark:bg-slate-600 shadow text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-800 dark:hover:text-slate-200' }`}
   >
    <Box className="w-4 h-4 mr-2" /> Volume
   </button>
   <button
    onClick={() => setTab('data')}
    className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center transition-colors ${ tab === 'data' ? 'bg-white dark:bg-slate-600 shadow text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-800 dark:hover:text-slate-200' }`}
   >
    <BarChart3 className="w-4 h-4 mr-2" /> Data Handling
   </button>
   </div>

   {tab === 'volume' && (
   <div className="space-y-6">
    <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3">Select 3D Shape</label>
    <div className="flex space-x-3">
     <button
     onClick={() => setShape('cylinder')}
     className={`flex-1 flex flex-col items-center py-3 px-4 rounded-xl border transition-colors ${ shape === 'cylinder' ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-300' : 'border-slate-200 dark:border-[#1c1b1b] hover:bg-slate-50 dark:hover:bg-slate-700' }`}
     >
     <Database className="w-6 h-6 mb-1" />
     <span className="text-sm font-medium">Cylinder</span>
     </button>
     <button
     onClick={() => setShape('prism')}
     className={`flex-1 flex flex-col items-center py-3 px-4 rounded-xl border transition-colors ${ shape === 'prism' ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-300' : 'border-slate-200 dark:border-[#1c1b1b] hover:bg-slate-50 dark:hover:bg-slate-700' }`}
     >
     <Box className="w-6 h-6 mb-1" />
     <span className="text-sm font-medium">Prism</span>
     </button>
    </div>
    </div>

    <div className="bg-slate-100 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] space-y-5">
    {shape === 'cylinder' ? (
     <>
     <div>
      <label className="flex justify-between text-sm font-medium mb-2">
      <span>Radius (r)</span>
      <span className="text-indigo-600 dark:text-indigo-400">{cylR} m</span>
      </label>
      <input type="range" min="1" max="10" value={cylR} onChange={(e) => setCylR(Number(e.target.value))} className="w-full accent-indigo-600" />
     </div>
     <div>
      <label className="flex justify-between text-sm font-medium mb-2">
      <span>Height (h)</span>
      <span className="text-indigo-600 dark:text-indigo-400">{cylH} m</span>
      </label>
      <input type="range" min="1" max="20" value={cylH} onChange={(e) => setCylH(Number(e.target.value))} className="w-full accent-indigo-600" />
     </div>
     </>
    ) : (
     <>
     <div>
      <label className="flex justify-between text-sm font-medium mb-2">
      <span>Length (L)</span>
      <span className="text-indigo-600 dark:text-indigo-400">{prismL} m</span>
      </label>
      <input type="range" min="1" max="10" value={prismL} onChange={(e) => setPrismL(Number(e.target.value))} className="w-full accent-indigo-600" />
     </div>
     <div>
      <label className="flex justify-between text-sm font-medium mb-2">
      <span>Width (W)</span>
      <span className="text-indigo-600 dark:text-indigo-400">{prismW} m</span>
      </label>
      <input type="range" min="1" max="10" value={prismW} onChange={(e) => setPrismW(Number(e.target.value))} className="w-full accent-indigo-600" />
     </div>
     <div>
      <label className="flex justify-between text-sm font-medium mb-2">
      <span>Height (H)</span>
      <span className="text-indigo-600 dark:text-indigo-400">{prismH} m</span>
      </label>
      <input type="range" min="1" max="20" value={prismH} onChange={(e) => setPrismH(Number(e.target.value))} className="w-full accent-indigo-600" />
     </div>
     </>
    )}
    </div>

    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-5 rounded-xl border border-indigo-200 dark:border-indigo-800">
    <h3 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Total Volume Capacity</h3>
    <p className="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{shape === 'cylinder' ? cylVol : prismVol} m³</p>
    <p className="text-sm font-medium text-indigo-500 mt-2">
     {shape === 'cylinder' ? `Formula: π × ${cylR}² × ${cylH}` : `Formula: ${prismL} × ${prismW} × ${prismH}`}
    </p>
    </div>

    <div className="pt-4">
    <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3">
     <span>Fill with Liquid</span>
     <span className="text-blue-600 dark:text-blue-400">{fillPercent}%</span>
    </label>
    <input type="range" min="0" max="100" value={fillPercent} onChange={(e) => setFillPercent(Number(e.target.value))} className="w-full accent-blue-500" />
    <p className="text-sm font-medium mt-3 text-slate-600 dark:text-[#71717a]">
     Current Liquid Volume:{' '}
     <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{shape === 'cylinder' ? cylLiq : prismLiq} m³</span>
    </p>
    </div>
   </div>
   )}

   {tab === 'data' && (
   <div className="space-y-6">
    <div>
    <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-[#a1a1aa]">Survey Dataset (comma separated)</label>
    <textarea
     value={dataStr}
     onChange={(e) => setDataStr(e.target.value)}
     className="w-full p-4 font-mono text-sm border border-slate-300 dark:border-[#1c1b1b] rounded-xl bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
     rows={3}
    />
    <p className="text-xs font-medium text-slate-500 dark:text-[#71717a] mt-2">Example: 1, 2, 3, 2, 4</p>
    </div>

    <div className="grid grid-cols-3 gap-3">
    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
     <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Mean</div>
     <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-1">{stats.mean.toFixed(2)}</div>
    </div>
    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
     <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Median</div>
     <div className="text-2xl font-mono font-bold text-amber-700 dark:text-amber-300 mt-1">{stats.median}</div>
    </div>
    <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-200 dark:border-rose-800 text-center">
     <div className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">Mode</div>
     <div className="text-2xl font-mono font-bold text-rose-700 dark:text-rose-300 mt-1">{stats.mode}</div>
    </div>
    </div>

    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-200 dark:border-indigo-800 mt-6">
    <h3 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Assessment</h3>
    <p className="text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-4">
     If you add the number <b>20</b> to this dataset, what will the new Mode be?
    </p>
    <div className="flex space-x-2">
     <input
     type="number"
     value={dataAnswer}
     onChange={(e) => setDataAnswer(e.target.value)}
     className="flex-1 min-w-0 p-2 font-mono text-sm border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-[#1c1b1b] focus:ring-2 focus:ring-indigo-500 outline-none"
     placeholder="Enter mode"
     />
     <button
     onClick={checkDataAnswer}
     className="whitespace-nowrap flex-shrink-0 bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     >
     Check
     </button>
    </div>
    {dataQStatus === 'correct' && (
     <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold mt-3 flex items-center">
     <CheckCircle className="w-4 h-4 mr-1" /> Correct! The mode (most frequent number) stays the same.
     </p>
    )}
    {dataQStatus === 'incorrect' && (
     <p className="text-rose-600 dark:text-rose-400 text-sm font-bold mt-3">
     Incorrect. Remember, Mode is the number that appears most frequently.
     </p>
    )}
    </div>
   </div>
   )}
  </div>

  {/* Right Column Stage */}
  <div className="w-2/3 p-8 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#121212] relative">
   <div className="w-full max-w-2xl bg-white dark:!bg-[#121212] rounded-2xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center justify-center aspect-video relative">
   {tab === 'volume' ? renderVolumeSvg() : chartType === 'bar' ? renderBarGraph() : renderPieChart()}

   {tab === 'data' && (
    <div className="absolute top-6 right-6 flex space-x-2 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-lg shadow-sm">
    <button
     onClick={() => setChartType('bar')}
     className={`p-2 rounded-md transition-colors ${chartType === 'bar' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
     title="Bar Graph"
    >
     <BarChart3 className="w-5 h-5" />
    </button>
    <button
     onClick={() => setChartType('pie')}
     className={`p-2 rounded-md transition-colors ${chartType === 'pie' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
     title="Pie Chart"
    >
     <PieChart className="w-5 h-5" />
    </button>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
