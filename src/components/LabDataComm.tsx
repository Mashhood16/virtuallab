import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabDataComm({ onExit }: LabProps) {
 const [nodes, setNodes] = useState<{ id: string, label: string, slot: number | null }[]>([
 { id: 'n1', label: 'Sender', slot: null },
 { id: 'n2', label: 'Message', slot: null },
 { id: 'n3', label: 'Medium', slot: null },
 { id: 'n4', label: 'Receiver', slot: null },
 { id: 'n5', label: 'Protocol', slot: null },
 ]);

 const slots = [
 { id: 0, title: 'Source Device', correctId: 'n1' },
 { id: 1, title: 'Data/Info', correctId: 'n2' },
 { id: 2, title: 'Rules', correctId: 'n5' },
 { id: 3, title: 'Connection Path', correctId: 'n3' },
 { id: 4, title: 'Destination Device', correctId: 'n4' },
 ];

 const handleDrop = (nodeId: string, slotId: number) => {
 // Check if slot is taken
 if (nodes.some(n => n.slot === slotId)) return;
 
 setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, slot: slotId } : n));
 };

 const handleReturn = (nodeId: string) => {
 setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, slot: null } : n));
 };

 const isComplete = slots.every(s => nodes.find(n => n.slot === s.id && n.id === s.correctId));

 return (
 <div className="w-full h-screen bg-slate-50 dark:!bg-[#000000] flex flex-col font-sans">
  <LabHeader onExit={onExit} title="Act 1.1: Data Communication Model" subtitle="Assemble the components of the communication cycle." variant="dark" />

  <div className="flex-1 flex lg:overflow-hidden">
  
  {/* Lab Area */}
  <div className="flex-1 bg-slate-100 dark:bg-[#121212] p-12 flex flex-col relative border-r-4 border-slate-300 dark:border-[#1c1b1b] shadow-inner bg-[url('https://www.transparenttextures.com/patterns/connected.png')]">
   
   <h2 className="text-2xl font-bold text-slate-700 dark:text-[#ffffff] mb-8 text-center bg-slate-50 dark:!bg-[#121212] py-2 rounded-xl shadow-sm">Build the Network Model</h2>

   <div className="flex-1 relative flex items-center justify-center">
    
    {/* The Diagram Background */}
    <div className="absolute w-[800px] h-[400px] border-4 border-slate-300 dark:border-[#1c1b1b] border-dashed rounded-3xl z-0 opacity-50"></div>
    
    {/* Connections */}
    {isComplete && (
    <svg className="absolute w-[800px] h-[400px] z-10 pointer-events-none">
     {/* Wire from Sender to Receiver */}
     <line x1="100" y1="200" x2="700" y2="200" stroke="#3b82f6" strokeWidth="4" />
     
     {/* Flowing Packets */}
     <circle cx="100" cy="200" r="6" fill="#10b981" className="animate-[slideRight_2s_linear_infinite]" />
     <circle cx="100" cy="200" r="6" fill="#10b981" className="animate-[slideRight_2s_linear_infinite_1s]" />
    </svg>
    )}

    {/* Slots */}
    <div className="absolute w-[800px] h-[400px] z-20 flex flex-col justify-between">
    
    {/* Top Row: Rules */}
    <div className="flex justify-center -mt-8">
     <div 
      className="w-40 h-24 bg-slate-50 dark:bg-[#121212] border-2 border-slate-400 dark:border-[#1c1b1b] border-dashed rounded-xl flex flex-col items-center justify-center p-2"
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e.dataTransfer.getData('nodeId'), 2)}
     >
      <span className="text-xs font-bold text-slate-400 mb-1">{slots[2].title}</span>
      {nodes.find(n => n.slot === 2) && (
      <div 
       className={`w-full h-12 flex items-center justify-center rounded shadow text-white font-bold cursor-pointer ${nodes.find(n => n.slot === 2)?.id === slots[2].correctId ? 'bg-green-500' : 'bg-red-500'}`}
       onClick={() => handleReturn(nodes.find(n => n.slot === 2)!.id)}
      >
       {nodes.find(n => n.slot === 2)?.label}
      </div>
      )}
     </div>
    </div>

    {/* Middle Row: Sender, Msg, Medium, Receiver */}
    <div className="flex justify-between items-center -mt-12 px-8">
     
     {/* Sender */}
     <div 
      className="w-40 h-24 bg-slate-50 dark:bg-[#121212] border-2 border-slate-400 dark:border-[#1c1b1b] border-dashed rounded-xl flex flex-col items-center justify-center p-2"
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e.dataTransfer.getData('nodeId'), 0)}
     >
      <span className="text-xs font-bold text-slate-400 mb-1">{slots[0].title}</span>
      {nodes.find(n => n.slot === 0) && (
      <div 
       className={`w-full h-12 flex items-center justify-center rounded shadow text-white font-bold cursor-pointer ${nodes.find(n => n.slot === 0)?.id === slots[0].correctId ? 'bg-green-500' : 'bg-red-500'}`}
       onClick={() => handleReturn(nodes.find(n => n.slot === 0)!.id)}
      >
       {nodes.find(n => n.slot === 0)?.label}
      </div>
      )}
     </div>

     {/* Message */}
     <div className="flex flex-col gap-4">
      <div 
      className="w-40 h-24 bg-slate-50 dark:bg-[#121212] border-2 border-slate-400 dark:border-[#1c1b1b] border-dashed rounded-xl flex flex-col items-center justify-center p-2"
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e.dataTransfer.getData('nodeId'), 1)}
      >
      <span className="text-xs font-bold text-slate-400 mb-1">{slots[1].title}</span>
      {nodes.find(n => n.slot === 1) && (
       <div 
       className={`w-full h-12 flex items-center justify-center rounded shadow text-white font-bold cursor-pointer ${nodes.find(n => n.slot === 1)?.id === slots[1].correctId ? 'bg-green-500' : 'bg-red-500'}`}
       onClick={() => handleReturn(nodes.find(n => n.slot === 1)!.id)}
       >
       {nodes.find(n => n.slot === 1)?.label}
       </div>
      )}
      </div>
      
      {/* Medium */}
      <div 
      className="w-40 h-24 bg-slate-50 dark:bg-[#121212] border-2 border-slate-400 dark:border-[#1c1b1b] border-dashed rounded-xl flex flex-col items-center justify-center p-2 mt-8"
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e.dataTransfer.getData('nodeId'), 3)}
      >
      <span className="text-xs font-bold text-slate-400 mb-1">{slots[3].title}</span>
      {nodes.find(n => n.slot === 3) && (
       <div 
       className={`w-full h-12 flex items-center justify-center rounded shadow text-white font-bold cursor-pointer ${nodes.find(n => n.slot === 3)?.id === slots[3].correctId ? 'bg-green-500' : 'bg-red-500'}`}
       onClick={() => handleReturn(nodes.find(n => n.slot === 3)!.id)}
       >
       {nodes.find(n => n.slot === 3)?.label}
       </div>
      )}
      </div>
     </div>

     {/* Receiver */}
     <div 
      className="w-40 h-24 bg-slate-50 dark:bg-[#121212] border-2 border-slate-400 dark:border-[#1c1b1b] border-dashed rounded-xl flex flex-col items-center justify-center p-2"
      onDragOver={e => e.preventDefault()}
      onDrop={e => handleDrop(e.dataTransfer.getData('nodeId'), 4)}
     >
      <span className="text-xs font-bold text-slate-400 mb-1">{slots[4].title}</span>
      {nodes.find(n => n.slot === 4) && (
      <div 
       className={`w-full h-12 flex items-center justify-center rounded shadow text-white font-bold cursor-pointer ${nodes.find(n => n.slot === 4)?.id === slots[4].correctId ? 'bg-green-500' : 'bg-red-500'}`}
       onClick={() => handleReturn(nodes.find(n => n.slot === 4)!.id)}
      >
       {nodes.find(n => n.slot === 4)?.label}
      </div>
      )}
     </div>

    </div>
    </div>
   </div>
   
  </div>

  {/* Control Panel */}
  <div className="w-96 bg-slate-50 dark:bg-[#121212] p-8 flex flex-col shadow-[-10px_0_20px_rgba(0,0,0,0.1)] z-10 lg:overflow-y-auto">
   <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 border-b-2 pb-2">Components Rack</h2>
   
   <p className="text-sm text-slate-500 dark:text-[#71717a] mb-6">Drag components from the rack into their correct logical positions in the communication cycle diagram.</p>

   <div className="grid grid-cols-2 gap-4 mb-8">
    {nodes.filter(n => n.slot === null).map(node => (
    <div 
     key={node.id}
     draggable
     onDragStart={e => e.dataTransfer.setData('nodeId', node.id)}
     className="bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md cursor-grab active:cursor-grabbing text-center hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     {node.label}
    </div>
    ))}
   </div>

   {isComplete && (
    <div className="mt-auto bg-green-50 p-6 rounded-xl border border-green-200 animate-fade-in dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold text-green-800 mb-2 uppercase tracking-wider text-sm flex items-center gap-2 dark:text-[#ffffff]">
     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
     Network Online!
    </h3>
    <p className="text-green-700 text-sm">
     The <strong>Sender</strong> transmits a <strong>Message</strong> over a <strong>Medium</strong> to a <strong>Receiver</strong>, while both obey a strict <strong>Protocol</strong> to understand each other.
    </p>
    </div>
   )}
  </div>
  </div>
  <style>{`
  @keyframes slideRight {
   0% { transform: translateX(0); opacity: 0; }
   10% { opacity: 1; }
   90% { opacity: 1; }
   100% { transform: translateX(600px); opacity: 0; }
  }
  `}</style>
 </div>
 );
}
