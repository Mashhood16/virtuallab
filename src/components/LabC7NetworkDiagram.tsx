import { useState } from 'react';
import { Server, Monitor, Printer, Network, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabC7NetworkDiagram({ onExit }: LabProps) {
 const [nodes, setNodes] = useState<{id: string, type: string, x: number, y: number}[]>([]);
 const [selectedTool, setSelectedTool] = useState<string | null>(null);

 const tools = [
 { id: 'server', name: 'Server', icon: <Server className="w-6 h-6" />, color: 'text-indigo-600 bg-indigo-100 border-indigo-300' },
 { id: 'client', name: 'Client PC', icon: <Monitor className="w-6 h-6" />, color: 'text-blue-600 bg-blue-100 border-blue-300' },
 { id: 'printer', name: 'Printer', icon: <Printer className="w-6 h-6" />, color: 'text-slate-600 dark:text-[#ffffff] bg-slate-200 dark:bg-[#121212] border-slate-400 dark:border-slate-500' },
 { id: 'switch', name: 'Switch/Hub', icon: <Network className="w-6 h-6" />, color: 'text-emerald-600 bg-emerald-100 border-emerald-300' }
 ];

 const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
 if (!selectedTool) return;
 
 const rect = e.currentTarget.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;

 setNodes(prev => [...prev, { id: Math.random().toString(), type: selectedTool, x, y }]);
 setSelectedTool(null);
 };

 const clearCanvas = () => setNodes([]);

 // Basic validation: 1 switch, 1 server, >0 clients
 const hasSwitch = nodes.some(n => n.type === 'switch');
 const hasServer = nodes.some(n => n.type === 'server');
 const hasClient = nodes.some(n => n.type === 'client');
 const isValid = hasSwitch && hasServer && hasClient;

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Network Diagram Builder" />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">Select a component from the toolbar and click on the canvas to place it. Build a basic Client-Server network topology.</p>

  {isValid && (
   <div className="bg-emerald-100 text-emerald-800 p-3 rounded-lg flex items-center mb-6 w-fit border border-emerald-300 shadow-sm">
   <CheckCircle className="w-5 h-5 mr-2" />
   Basic network topology complete!
   </div>
  )}

  <div className="flex flex-1 gap-6">
   {/* Toolbar */}
   <div className="w-48 bg-slate-50 dark:!bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl p-4 shadow-sm flex flex-col gap-3">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] text-sm uppercase tracking-wider mb-2">Components</h3>
   {tools.map(tool => (
    <button
    key={tool.id}
    onClick={() => setSelectedTool(tool.id)}
    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${selectedTool === tool.id ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' : 'border-transparent hover:bg-slate-100 dark:bg-[#121212]'}`}
    >
    <div className={`p-2 rounded-md border ${tool.color}`}>
     {tool.icon}
    </div>
    <span className="font-medium text-sm">{tool.name}</span>
    </button>
   ))}
   <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
    <button onClick={clearCanvas} className="w-full py-2 text-sm text-rose-600 font-medium hover:bg-rose-50 rounded-lg transition-colors dark:bg-[#121212] dark:border-[#1c1b1b]">
    Clear Canvas
    </button>
   </div>
   </div>

   {/* Canvas */}
   <div 
   className={`flex-1 bg-slate-50 dark:bg-[#121212] border-2 border-slate-200 dark:border-[#1c1b1b] rounded-xl shadow-inner relative overflow-hidden ${selectedTool ? 'cursor-crosshair bg-blue-50/30' : ''}`}
   onClick={handleCanvasClick}
   >
   {/* Draw lines to switch if it exists */}
   <svg className="absolute inset-0 w-full h-full pointer-events-none">
    {nodes.filter(n => n.type === 'switch').map(sw => (
    nodes.filter(n => n.id !== sw.id).map(n => (
     <line 
     key={`${sw.id}-${n.id}`}
     x1={sw.x} y1={sw.y} x2={n.x} y2={n.y} 
     stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4"
     />
    ))
    ))}
   </svg>

   {nodes.map(node => {
    const toolDef = tools.find(t => t.id === node.type);
    return (
    <div 
     key={node.id}
     className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
     style={{ left: node.x, top: node.y }}
     onClick={(e) => { e.stopPropagation(); setNodes(nodes.filter(n => n.id !== node.id)); }}
    >
     <div className={`p-3 rounded-xl border-2 shadow-lg mb-2 ${toolDef?.color} group-hover:scale-110 transition-transform`}>
     {toolDef?.icon}
     </div>
     <span className="text-xs font-bold bg-slate-50 dark:bg-[#121212] px-2 py-1 rounded border border-slate-200 dark:border-[#1c1b1b] shadow-sm whitespace-nowrap">
     {toolDef?.name}
     </span>
    </div>
    );
   })}
   {nodes.length === 0 && !selectedTool && (
    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium italic">
    Select a tool and click here to place components
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
