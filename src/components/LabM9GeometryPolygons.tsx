import { useState, useEffect } from 'react';
import { CheckCircle, Calculator, RefreshCcw, Ruler, HelpCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Point { x: number; y: number; }
interface LabProps { onExit?: () => void; }

export default function LabM9GeometryPolygons({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [points, setPoints] = useState<Point[]>([]);
 const [grassRate, setGrassRate] = useState<number>(10);
 const [fenceRate, setFenceRate] = useState<number>(5);
 
 const [userAns, setUserAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 useEffect(() => {
 setGrassRate(Math.floor(Math.random() * 10) + 5);
 setFenceRate(Math.floor(Math.random() * 8) + 2);
 }, []);

 const SVG_SIZE = 400;
 const GRID_SIZE = 20;
 const scale = SVG_SIZE / GRID_SIZE;

 const handleSvgClick = (e: any) => {
 if (points.length >= 3) return;
 const rect = e.currentTarget.getBoundingClientRect();
 const xRaw = e.clientX - rect.left;
 const yRaw = e.clientY - rect.top;
 
 const x = Math.round(xRaw / scale);
 const y = Math.round((SVG_SIZE - yRaw) / scale);
 
 setPoints([...points, { x, y }]);
 setIsCorrect(null);
 };
 
 const resetPoints = () => {
 setPoints([]);
 setUserAns('');
 setIsCorrect(null);
 };
 
 let area = 0;
 let perimeter = 0;
 let cx = 0;
 let cy = 0;
 
 if (points.length === 3) {
 const [A, B, C] = points;
 area = Math.abs(A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2;
 const d = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
 perimeter = d(A, B) + d(B, C) + d(C, A);
 cx = (A.x + B.x + C.x) / 3;
 cy = (A.y + B.y + C.y) / 3;
 }
 
 const checkAns = () => {
 const total = (area * grassRate) + (perimeter * fenceRate);
 if (Math.abs(parseFloat(userAns) - total) <= 0.5) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Lab M9.2: Geometry & Polygons" />
  

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <HelpCircle className="text-emerald-600" size={20} />
   Area, Perimeter & Centroid
   </h2>
   <div className="prose prose-slate text-sm">
   <p>
    In landscaping, geometric properties help estimate material costs. 
   </p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>Perimeter:</strong> Total distance around the boundary. Used to estimate fencing. <br/><span className="font-mono text-xs text-slate-500 dark:text-[#71717a]">P = d(A,B) + d(B,C) + d(C,A)</span></li>
    <li><strong>Area:</strong> The 2D space enclosed. Used to estimate grass or soil.<br/><span className="font-mono text-xs text-slate-500 dark:text-[#71717a]">Shoelace Formula: ½ |x₁(y₂-y₃) + ...|</span></li>
    <li><strong>Centroid:</strong> The geometric center. Ideal for placing sprinklers.<br/><span className="font-mono text-xs text-slate-500 dark:text-[#71717a]">C = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)</span></li>
   </ul>
   <p className="mt-4">
    <strong>Instructions:</strong> Click anywhere on the 20x20 grid to plot 3 vertices of a triangular yard. The system will automatically compute geometric properties.
   </p>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col gap-4  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Ruler className="text-emerald-600" size={20} />
   Interactive Yard Map
   </h2>
   
   <div className="flex-1 min-w-0 flex flex-col items-center justify-center relative">
   <svg 
    width={SVG_SIZE} 
    height={SVG_SIZE} 
    className={`bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-lg overflow- cursor-crosshair flex-col `}
    onClick={handleSvgClick}
   >
    {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
    <g key={`grid-${i}`}>
     <line x1={i * scale} y1={0} x2={i * scale} y2={SVG_SIZE} stroke="#e2e8f0" strokeWidth={i%5===0 ? 2 : 1} />
     <line x1={0} y1={i * scale} x2={SVG_SIZE} y2={i * scale} stroke="#e2e8f0" strokeWidth={i%5===0 ? 2 : 1} />
    </g>
    ))}
    
    {points.length === 3 && (
    <polygon 
     points={points.map(p => `${p.x * scale},${SVG_SIZE - p.y * scale}`).join(' ')}
     fill="rgba(16, 185, 129, 0.2)"
     stroke="#10b981"
     strokeWidth="2"
    />
    )}
    
    {points.map((p, i) => (
    <g key={i}>
     <circle cx={p.x * scale} cy={SVG_SIZE - p.y * scale} r={5} fill="#047857" />
     <text x={p.x * scale + 8} y={SVG_SIZE - p.y * scale - 8} className="text-xs font-bold fill-emerald-800">
     {['A', 'B', 'C'][i]} ({p.x}, {p.y})
     </text>
    </g>
    ))}

    {points.length === 3 && (
    <g>
     <circle cx={cx * scale} cy={SVG_SIZE - cy * scale} r={6} fill="#ef4444" />
     <text x={cx * scale + 10} y={SVG_SIZE - cy * scale} className="text-xs font-bold fill-red-600">
     Centroid
     </text>
    </g>
    )}
   </svg>
   
   <div className="absolute bottom-2 right-2 text-xs text-slate-400 font-mono bg-slate-50 dark:bg-[#121212]/80 px-1 rounded">
    Grid: 20x20 meters
   </div>
   </div>

   <button 
   onClick={resetPoints} 
   className={`w-full py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 dark:bg-[#121212] transition-colors `}
   >
   <RefreshCcw size={18} /> Reset Canvas
   </button>
  </div>

  {/* Column 3: Analysis */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col gap-4  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Calculator className="text-emerald-600" size={20} />
   Data Log & Cost Estimator
   </h2>
   
   <div className={`flex-1 min-w-0 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 space-y-4 flex-col `}>
   <div>
    <h3 className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">Geometric Data</h3>
    <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-sm">
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-400 block text-xs">Perimeter</span>
     {points.length === 3 ? `${perimeter.toFixed(2)} m` : '-'}
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-400 block text-xs">Area</span>
     {points.length === 3 ? `${area.toFixed(2)} m²` : '-'}
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b] col-span-2">
     <span className="text-slate-400 block text-xs">Centroid (Sprinkler)</span>
     {points.length === 3 ? `(${cx.toFixed(2)}, ${cy.toFixed(2)})` : '-'}
    </div>
    </div>
   </div>

   <div className="border-t border-slate-200 dark:border-[#1c1b1b] pt-4">
    <h3 className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">Cost Rates</h3>
    <ul className="text-sm mt-2 space-y-1">
    <li>Grass (Area): <strong>${grassRate} / m²</strong></li>
    <li>Fencing (Perimeter): <strong>${fenceRate} / m</strong></li>
    </ul>
   </div>
   </div>

   <div className="mt-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
   <h3 className="font-bold text-emerald-900 mb-2">Estimate Landscape Cost</h3>
   <p className="text-sm text-emerald-800 mb-3">
    Calculate the total cost to landscape the yard you plotted. (Round final answer to nearest dollar, or enter exact to 2 decimals).
   </p>
   <div className="flex flex-wrap gap-2">
    <input 
    type="number" 
    placeholder="Total Cost ($)" 
    value={userAns}
    onChange={(e) => setUserAns(e.target.value)}
    disabled={points.length < 3}
    className="flex-1 min-w-0 px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
    />
    <button 
    onClick={checkAns}
    disabled={points.length < 3}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-50 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    Check
    </button>
   </div>
   
   {isCorrect === true && (
    <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
    <CheckCircle size={16} /> Accurate estimation!
    </div>
   )}
   {isCorrect === false && (
    <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
    Incorrect. Calculate (Area × Grass Rate) + (Perimeter × Fence Rate).
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
