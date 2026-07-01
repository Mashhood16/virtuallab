import { useState } from 'react';
import type { MouseEvent } from 'react';
import { ArrowLeft, RefreshCcw, MapPin, Move, RotateCw, CheckCircle2 } from 'lucide-react';

export default function LabM7Transformations({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'coordinates' | 'translation' | 'rotation'>('coordinates');

 // Coordinates State
 const [targetPoint, setTargetPoint] = useState({ x: 3, y: 4, name: 'Bank' });
 const [clickedPoint, setClickedPoint] = useState<{ x: number, y: number } | null>(null);
 const [coordMessage, setCoordMessage] = useState('');

 const generateNewTarget = () => {
 const places = ['Bank', 'Park', 'School', 'Library', 'Museum'];
 const rx = Math.floor(Math.random() * 10) - 5;
 const ry = Math.floor(Math.random() * 10) - 5;
 const name = places[Math.floor(Math.random() * places.length)];
 setTargetPoint({ x: rx, y: ry, name });
 setClickedPoint(null);
 setCoordMessage('');
 };

 const handleGridClick = (e: MouseEvent<SVGSVGElement>) => {
 if (activeTab !== 'coordinates') return;
 const svg = e.currentTarget;
 const rect = svg.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 
 const gridX = Math.round((x - 200) / 40);
 const gridY = Math.round(-(y - 200) / 40);
 
 if (gridX >= -5 && gridX <= 5 && gridY >= -5 && gridY <= 5) {
  setClickedPoint({ x: gridX, y: gridY });
  if (gridX === targetPoint.x && gridY === targetPoint.y) {
  setCoordMessage('Correct! You found it.');
  } else {
  setCoordMessage('Try again!');
  }
 }
 };

 // Translation State
 const [transX, setTransX] = useState(0);
 const [transY, setTransY] = useState(0);

 // Rotation State
 const [angle, setAngle] = useState(0);
 
 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none overflow-hidden">
  <div className="flex items-center p-4 border-b border-slate-200 dark:border-[#1c1b1b] shadow-sm z-10">
  <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4">
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-2xl font-bold">Unit 7: Transformations & Coordinates</h1>
  </div>

  <div className="flex flex-1 overflow-hidden">
  {/* Left Column */}
  <div className="w-1/3 p-6 border-r border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex flex-col gap-6">
   <div className="flex space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
   <button 
    className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'coordinates' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}
    onClick={() => setActiveTab('coordinates')}
   >
    <MapPin className="w-4 h-4" /> Coordinates
   </button>
   <button 
    className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'translation' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}
    onClick={() => setActiveTab('translation')}
   >
    <Move className="w-4 h-4" /> Translate
   </button>
   <button 
    className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'rotation' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}
    onClick={() => setActiveTab('rotation')}
   >
    <RotateCw className="w-4 h-4" /> Rotate
   </button>
   </div>

   {activeTab === 'coordinates' && (
   <div className="space-y-4">
    <h2 className="text-xl font-bold">City Map Coordinates</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Click on the grid to locate the following place:
    </p>
    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
    <span className="block text-lg font-bold text-blue-700 dark:text-blue-300">
     Find the {targetPoint.name} at ({targetPoint.x}, {targetPoint.y})
    </span>
    </div>
    
    {coordMessage && (
    <div className={`p-3 rounded-lg flex items-center gap-2 font-semibold ${coordMessage.includes('Correct') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
     {coordMessage.includes('Correct') ? <CheckCircle2 className="w-5 h-5" /> : null}
     {coordMessage}
    </div>
    )}

    <button 
    onClick={generateNewTarget}
    className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    <RefreshCcw className="w-4 h-4" /> New Target
    </button>
   </div>
   )}

   {activeTab === 'translation' && (
   <div className="space-y-4">
    <h2 className="text-xl font-bold">Sliding Shapes</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Translate the triangle by changing the x and y offsets. Notice how the shape slides without rotating or changing size.
    </p>
    
    <div className="space-y-6 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
    <div>
     <div className="flex justify-between mb-1">
     <label className="font-medium text-sm">Horizontal Shift (x)</label>
     <span className="font-bold">{transX}</span>
     </div>
     <input 
     type="range" min="-5" max="5" value={transX} 
     onChange={e => setTransX(parseInt(e.target.value))}
     className="w-full accent-indigo-600"
     />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="font-medium text-sm">Vertical Shift (y)</label>
     <span className="font-bold">{transY}</span>
     </div>
     <input 
     type="range" min="-5" max="5" value={transY} 
     onChange={e => setTransY(parseInt(e.target.value))}
     className="w-full accent-indigo-600"
     />
    </div>
    </div>
   </div>
   )}

   {activeTab === 'rotation' && (
   <div className="space-y-4">
    <h2 className="text-xl font-bold">Rotational Symmetry</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Rotate the windmill to see its order of rotational symmetry. How many times does it look exactly the same in one full turn (360°)?
    </p>
    
    <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
    <div className="flex justify-between mb-1">
     <label className="font-medium text-sm">Angle of Rotation</label>
     <span className="font-bold text-indigo-600 dark:text-indigo-400">{angle}°</span>
    </div>
    <input 
     type="range" min="0" max="360" step="15" value={angle} 
     onChange={e => setAngle(parseInt(e.target.value))}
     className="w-full accent-indigo-600 mt-2"
    />
    </div>

    <div className="border border-slate-200 dark:border-[#1c1b1b] p-4 rounded-lg">
    <p className="text-sm font-medium">Matches original shape at:</p>
    <div className="flex gap-2 mt-3">
     {[90, 180, 270, 360].map(a => (
     <span key={a} className={`px-2 py-1 rounded text-xs font-bold transition-colors ${angle >= a ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>
      {a}°
     </span>
     ))}
    </div>
    <p className="text-xs mt-4 text-slate-500 dark:text-[#71717a] font-bold uppercase tracking-wider">Order of symmetry: 4</p>
    </div>
   </div>
   )}

  </div>

  {/* Right Column: Stage */}
  <div className="w-2/3 p-6 bg-slate-200 dark:bg-slate-950 flex items-center justify-center relative">
   <svg 
   width="400" height="400" 
   className={`rounded-lg shadow-xl border border-slate-300 dark:border-slate-600 ${activeTab === 'coordinates' ? 'cursor-crosshair' : ''}`}
   onClick={activeTab === 'coordinates' ? handleGridClick : undefined}
   >
   {/* Grid Lines */}
   <g className="text-slate-200 dark:text-slate-700" stroke="currentColor" strokeWidth="1">
    {Array.from({ length: 11 }).map((_, i) => (
    <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" />
    ))}
    {Array.from({ length: 11 }).map((_, i) => (
    <line key={`h-${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
    ))}
   </g>
   
   {/* Axes */}
   <line x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-[#71717a]" />
   <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-[#71717a]" />
   
   {/* Axis Labels */}
   <text x="385" y="195" className="text-[10px] fill-slate-500 font-bold">x</text>
   <text x="205" y="15" className="text-[10px] fill-slate-500 font-bold">y</text>
   {Array.from({ length: 11 }).map((_, i) => {
    const val = i - 5;
    if (val === 0) return null;
    return (
    <g key={`lbl-${i}`}>
     <text x={i * 40 + 2} y="212" className="text-[8px] fill-slate-400 select-none">{val}</text>
     <text x="202" y={400 - (i * 40) - 2} className="text-[8px] fill-slate-400 select-none">{val}</text>
    </g>
    )
   })}

   {activeTab === 'coordinates' && (
    <>
    <circle 
     cx={200 + targetPoint.x * 40} 
     cy={200 - targetPoint.y * 40} 
     r="6" 
     className="fill-indigo-500 animate-pulse" 
    />
    <text 
     x={200 + targetPoint.x * 40 + 8} 
     y={200 - targetPoint.y * 40 - 8} 
     className="text-xs font-bold fill-indigo-700 dark:fill-indigo-300 select-none pointer-events-none"
    >
     {targetPoint.name}
    </text>
    {clickedPoint && (
     <circle 
     cx={200 + clickedPoint.x * 40} 
     cy={200 - clickedPoint.y * 40} 
     r="5" 
     className={clickedPoint.x === targetPoint.x && clickedPoint.y === targetPoint.y ? 'fill-green-500' : 'fill-red-500'} 
     />
    )}
    </>
   )}

   {activeTab === 'translation' && (
    <>
    {/* Original shape ghost */}
    <polygon 
     points="200,160 160,240 240,240" 
     className="fill-slate-300 dark:fill-slate-600 opacity-50 stroke-slate-400 stroke-1"
    />
    {/* Translated shape */}
    <g transform={`translate(${transX * 40}, ${-transY * 40})`} className="transition-transform duration-300 ease-out">
     <polygon 
     points="200,160 160,240 240,240" 
     className="fill-indigo-500/80 stroke-indigo-600 stroke-2"
     />
     <circle cx="200" cy="160" r="4" className="fill-white" />
     <circle cx="160" cy="240" r="4" className="fill-white" />
     <circle cx="240" cy="240" r="4" className="fill-white" />
    </g>
    </>
   )}

   {activeTab === 'rotation' && (
    <g transform="translate(200, 200)">
    {/* Reference lines for order of symmetry */}
    <circle cx="0" cy="0" r="120" className="fill-none stroke-slate-300 dark:stroke-slate-600 stroke-1 stroke-dasharray-4" strokeDasharray="4 4"/>
    <line x1="-130" y1="0" x2="130" y2="0" className="stroke-slate-300 dark:stroke-slate-600 stroke-1" />
    <line x1="0" y1="-130" x2="0" y2="130" className="stroke-slate-300 dark:stroke-slate-600 stroke-1" />

    <g transform={`rotate(${angle})`} className="transition-transform duration-100 ease-linear">
     {/* 4 Blades */}
     <path d="M 0 0 L -30 -100 L 0 -120 Z" className="fill-blue-500" />
     <path d="M 0 0 L 100 -30 L 120 0 Z" className="fill-indigo-500" />
     <path d="M 0 0 L 30 100 L 0 120 Z" className="fill-violet-500" />
     <path d="M 0 0 L -100 30 L -120 0 Z" className="fill-indigo-500" />
     <circle cx="0" cy="0" r="8" className="fill-slate-800 dark:fill-slate-100" />
    </g>
    </g>
   )}
   </svg>
  </div>
  </div>
 </div>
 );
}
