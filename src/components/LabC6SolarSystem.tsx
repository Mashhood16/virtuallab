import { useState } from 'react';
import { Circle, Type, Palette, Trash2, Undo } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

type CanvasItem = {
 id: string;
 type: 'planet' | 'orbit' | 'label';
 x: number;
 y: number;
 color?: string;
 size?: number;
 text?: string;
};

export default function LabC6SolarSystem({ onExit }: LabProps) {
 const [items, setItems] = useState<CanvasItem[]>([]);
 const [selectedTool, setSelectedTool] = useState<'planet' | 'orbit' | 'label' | null>(null);
 const [currentColor, setCurrentColor] = useState('#eab308'); // yellow
 const [currentSize, setCurrentSize] = useState(80);

 const colors = [
 '#eab308', // Sun
 '#94a3b8', // Mercury
 '#fcd34d', // Venus
 '#3b82f6', // Earth
 '#ef4444', // Mars
 '#f59e0b', // Jupiter
 '#d97706', // Saturn
 '#0ea5e9', // Uranus
 '#38bdf8', // Neptune
 ];

 const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
 if (!selectedTool) return;
 
 const rect = e.currentTarget.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;

 if (selectedTool === 'label') {
  const text = prompt("Enter label text:");
  if (!text) return;
  setItems([...items, { id: Date.now().toString(), type: 'label', x, y, text }]);
 } else {
  setItems([...items, {
  id: Date.now().toString(),
  type: selectedTool,
  x,
  y,
  color: currentColor,
  size: currentSize
  }]);
 }

 setSelectedTool(null);
 };

 const undo = () => setItems(items.slice(0, -1));
 const clear = () => setItems([]);

 const renderItem = (item: CanvasItem) => {
 switch (item.type) {
  case 'planet':
  return (
   <div 
   key={item.id} 
   className="absolute rounded-full"
   style={{ 
    left: item.x - (item.size! / 2), 
    top: item.y - (item.size! / 2), 
    width: item.size, 
    height: item.size,
    background: `radial-gradient(circle at 30% 30%, ${item.color}88, ${item.color}, #000)`,
    boxShadow: `0 0 ${item.size! / 2}px ${item.color}40, inset -5px -5px 15px rgba(0,0,0,0.8)`
   }} 
   />
  );
  case 'orbit':
  return (
   <div 
   key={item.id} 
   className="absolute rounded-full border-2 border-dashed border-slate-600 dark:border-[#1c1b1b]"
   style={{ 
    left: item.x - (item.size! / 2), 
    top: item.y - (item.size! / 2), 
    width: item.size, 
    height: item.size,
   }} 
   />
  );
  case 'label':
  return (
   <div 
   key={item.id} 
   className="absolute font-bold text-white tracking-widest uppercase text-xs bg-black/50 px-2 py-1 rounded"
   style={{ left: item.x, top: item.y }}
   >
   {item.text}
   </div>
  );
 }
 };

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Solar System 3D Creator" />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">
  

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">Draw planets using 3D shapes, fill them with colors, draw orbits, and label them.</p>

  <div className="flex gap-6 flex-1 h-[600px]">
   {/* Toolbar */}
   <div className="w-72 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-4 flex flex-col gap-6 lg:overflow-y-auto">
   <div>
    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-3">Tools</h3>
    <div className="flex flex-col gap-2">
    <button
     onClick={() => setSelectedTool('planet')}
     className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left font-bold text-sm transition-colors ${ selectedTool === 'planet' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff]' }`}
    >
     <Circle className="w-5 h-5 fill-current" /> 3D Planet Shape
    </button>
    <button
     onClick={() => setSelectedTool('orbit')}
     className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left font-bold text-sm transition-colors ${ selectedTool === 'orbit' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff]' }`}
    >
     <Circle className="w-5 h-5" strokeDasharray="4 4" /> Draw Orbit
    </button>
    <button
     onClick={() => setSelectedTool('label')}
     className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left font-bold text-sm transition-colors ${ selectedTool === 'label' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff]' }`}
    >
     <Type className="w-5 h-5" /> Text Label
    </button>
    </div>
   </div>

   <div>
    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
    <Palette className="w-4 h-4" /> Colors
    </h3>
    <div className="flex flex-wrap gap-2">
    {colors.map(c => (
     <button
     key={c}
     onClick={() => setCurrentColor(c)}
     className={`w-8 h-8 rounded-full shadow-sm border-2 transition-transform ${currentColor === c ? 'border-[#1c1b1b] dark:border-slate-500 scale-110' : 'border-transparent hover:scale-105'}`}
     style={{ backgroundColor: c }}
     />
    ))}
    </div>
   </div>

   <div>
    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
    Size: {currentSize}px
    </h3>
    <input 
    type="range" 
    min="20" max="400" 
    value={currentSize} 
    onChange={e => setCurrentSize(parseInt(e.target.value))}
    className="w-full accent-blue-600"
    />
   </div>

   <div className="mt-auto flex gap-2 pt-4 border-t border-slate-100">
    <button onClick={undo} disabled={items.length === 0} className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-50 dark:bg-[#121212] disabled:opacity-50">
    <Undo className="w-5 h-5 mb-1" />
    <span className="text-xs font-bold">Undo</span>
    </button>
    <button onClick={clear} disabled={items.length === 0} className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 border-slate-200 dark:border-[#1c1b1b] text-red-600 hover:bg-red-50 disabled:opacity-50">
    <Trash2 className="w-5 h-5 mb-1" />
    <span className="text-xs font-bold">Clear</span>
    </button>
   </div>
   </div>

   {/* Canvas */}
   <div 
   onClick={handleCanvasClick}
   className={`flex-1 bg-[#000000] dark:bg-[#121212] rounded-xl shadow-inner border border-[#1c1b1b] dark:border-slate-500 relative overflow-hidden ${selectedTool ? 'cursor-crosshair border-blue-500' : 'cursor-default'}`}
   style={{
    backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
   }}
   >
   {/* Stars background */}
   <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0))', backgroundSize: '200px 200px' }} />
   
   {items.length === 0 && !selectedTool && (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="text-slate-400 flex flex-col items-center gap-4 bg-[#121212] dark:bg-[#121212]/80 p-8 rounded-2xl border border-[#1c1b1b] dark:border-[#1c1b1b]">
     <Palette className="w-12 h-12" />
     <p className="font-bold">Select a tool to start drawing the Solar System</p>
    </div>
    </div>
   )}
   
   {items.map(renderItem)}
   </div>
  </div>
  </div>
 </div>
 );
}
