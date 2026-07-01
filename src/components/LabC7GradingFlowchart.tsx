import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabC7GradingFlowchart({ onExit }: LabProps) {
 const [nodes, setNodes] = useState<{id: string, label: string, shape: string, placedAt: number | null}[]>([
 { id: 'n1', label: 'Start', shape: 'pill', placedAt: null },
 { id: 'n2', label: 'Input Marks', shape: 'parallelogram', placedAt: null },
 { id: 'n3', label: 'Is Marks >= 50?', shape: 'diamond', placedAt: null },
 { id: 'n4', label: 'Print "Pass"', shape: 'parallelogram', placedAt: null },
 { id: 'n5', label: 'Print "Fail"', shape: 'parallelogram', placedAt: null },
 { id: 'n6', label: 'End', shape: 'pill', placedAt: null }
 ]);

 const [draggedNode, setDraggedNode] = useState<string | null>(null);

 // Correct positions (0 to 5 for the slots in the logical flowchart)
 // 0: Start
 // 1: Input Marks
 // 2: Condition (Marks >= 50)
 // 3: True Branch (Pass)
 // 4: False Branch (Fail)
 // 5: End
 const correctMapping = {
 0: 'n1',
 1: 'n2',
 2: 'n3',
 3: 'n4',
 4: 'n5',
 5: 'n6'
 };

 const handleDrop = (slotIndex: number) => {
 if (draggedNode) {
  setNodes(nodes.map(n => n.id === draggedNode ? { ...n, placedAt: slotIndex } : n));
  setDraggedNode(null);
 }
 };

 const isComplete = Object.entries(correctMapping).every(([slot, nodeId]) => 
 nodes.find(n => n.id === nodeId)?.placedAt === parseInt(slot)
 );

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Grading Flowchart Builder" />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">Drag and drop the flowchart shapes to construct the logic for determining a Pass or Fail grade.</p>

  {isComplete && (
   <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center border border-emerald-300 shadow-sm w-fit">
   <CheckCircle className="w-6 h-6 mr-3" />
   <span className="font-bold">Flowchart Complete!</span> The logic flows correctly.
   </div>
  )}

  <div className="flex gap-8 max-w-5xl mx-auto w-full">
   {/* Palette */}
   <div className="w-64 bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4 uppercase tracking-wider text-sm">Flowchart Nodes</h2>
   <div className="flex flex-col gap-4">
    {nodes.filter(n => n.placedAt === null).map(node => (
    <div 
     key={node.id}
     draggable
     onDragStart={() => setDraggedNode(node.id)}
     onDragEnd={() => setDraggedNode(null)}
     className={`p-4 bg-blue-50 border-2 border-blue-400 text-blue-900 font-medium text-center shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform ${node.shape === 'pill' ? 'rounded-full' : ''} ${node.shape === 'parallelogram' ? 'skew-x-[-15deg]' : ''} ${node.shape === 'diamond' ? 'rotate-45 p-6 w-24 h-24 mx-auto flex items-center justify-center' : ''}`}
    >
     <div className={`${node.shape === 'diamond' ? '-rotate-45 w-[140%] text-xs' : ''} ${node.shape === 'parallelogram' ? 'skew-x-[15deg]' : ''}`}>
     {node.label}
     </div>
    </div>
    ))}
    {nodes.filter(n => n.placedAt === null).length === 0 && !isComplete && (
    <div className="text-rose-500 font-medium text-sm text-center">Some nodes are placed incorrectly.</div>
    )}
   </div>
   </div>

   {/* Canvas */}
   <div className="flex-1 bg-slate-50 dark:bg-[#121212] p-8 rounded-xl shadow-inner border-2 border-slate-200 dark:border-[#1c1b1b] flex flex-col items-center">
   
   {/* Slot 0: Start */}
   <Slot id={0} nodes={nodes} setNodes={setNodes} onDrop={() => handleDrop(0)} />
   <div className="h-8 w-1 bg-slate-300 dark:bg-[#121212] relative"><div className="absolute -bottom-2 -left-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-400"/></div>
   
   {/* Slot 1: Input */}
   <Slot id={1} nodes={nodes} setNodes={setNodes} onDrop={() => handleDrop(1)} />
   <div className="h-8 w-1 bg-slate-300 dark:bg-[#121212] relative"><div className="absolute -bottom-2 -left-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-400"/></div>
   
   {/* Slot 2: Condition */}
   <Slot id={2} nodes={nodes} setNodes={setNodes} onDrop={() => handleDrop(2)} />
   
   <div className="flex w-full justify-center">
    {/* True Branch */}
    <div className="flex flex-col items-end mr-8 mt-4">
    <div className="flex items-center h-1 bg-slate-300 dark:bg-[#121212] w-32 relative">
     <span className="absolute -top-6 left-1/2 font-bold text-emerald-600 text-sm">Yes (True)</span>
    </div>
    <div className="w-1 h-8 bg-slate-300 dark:bg-[#121212] relative"><div className="absolute -bottom-2 -left-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-400"/></div>
    <Slot id={3} nodes={nodes} setNodes={setNodes} onDrop={() => handleDrop(3)} />
    <div className="w-1 h-12 bg-slate-300 dark:bg-[#121212]" />
    </div>

    {/* False Branch */}
    <div className="flex flex-col items-start ml-8 mt-4">
    <div className="flex items-center h-1 bg-slate-300 dark:bg-[#121212] w-32 relative">
     <span className="absolute -top-6 left-1/2 font-bold text-rose-600 text-sm">No (False)</span>
    </div>
    <div className="w-1 h-8 bg-slate-300 dark:bg-[#121212] relative"><div className="absolute -bottom-2 -left-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-400"/></div>
    <Slot id={4} nodes={nodes} setNodes={setNodes} onDrop={() => handleDrop(4)} />
    <div className="w-1 h-12 bg-slate-300 dark:bg-[#121212]" />
    </div>
   </div>

   {/* Merge paths */}
   <div className="flex w-full justify-center">
    <div className="h-1 w-64 bg-slate-300 dark:bg-[#121212] translate-y-[-48px] relative z-0">
    <div className="w-1 h-8 bg-slate-300 dark:bg-[#121212] absolute left-1/2 -translate-x-1/2"><div className="absolute -bottom-2 -left-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-400"/></div>
    </div>
   </div>

   <div className="-mt-8 z-10">
    {/* Slot 5: End */}
    <Slot id={5} nodes={nodes} setNodes={setNodes} onDrop={() => handleDrop(5)} />
   </div>

   </div>
  </div>
  </div>
 </div>
 );
}

function Slot({ id, nodes, setNodes, onDrop }: { id: number, nodes: any[], setNodes: any, onDrop: () => void }) {
 const node = nodes.find(n => n.placedAt === id);

 return (
 <div 
  onDragOver={(e) => e.preventDefault()}
  onDrop={onDrop}
  className={`min-w-[160px] min-h-[60px] border-2 border-dashed rounded-lg flex items-center justify-center relative transition-colors ${node ? 'border-transparent bg-transparent' : 'border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212]'}`}
 >
  {node && (
  <div 
   onClick={() => setNodes(nodes.map((n:any) => n.id === node.id ? { ...n, placedAt: null } : n))}
   className={`p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-bold text-center shadow-lg cursor-pointer hover:bg-rose-50 hover:border-rose-500 hover:text-rose-900 absolute z-10 w-48 ${node.shape === 'pill' ? 'rounded-full' : ''} ${node.shape === 'parallelogram' ? 'skew-x-[-15deg]' : ''} ${node.shape === 'diamond' ? 'rotate-45 p-6 w-28 h-28 mx-auto flex items-center justify-center' : ''}`}
  >
   <div className={`${node.shape === 'diamond' ? '-rotate-45 w-[140%] text-xs' : ''} ${node.shape === 'parallelogram' ? 'skew-x-[15deg]' : ''}`}>
   {node.label}
   </div>
  </div>
  )}
 </div>
 )
}
