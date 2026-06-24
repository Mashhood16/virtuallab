import { useState, useEffect, useRef } from 'react';
import { Play, ArrowDown } from 'lucide-react';
import LabHeader from './LabHeader';

interface AlgoBlock { id: string; type: 'Terminal' | 'InputOutput' | 'Process' | 'Decision'; text: string; }
interface AlgoTask { id: number; title: string; description: string; blocks: AlgoBlock[]; expectedSequence: string[]; }

const tasks: AlgoTask[] = [
  {
    id: 1,
    title: 'Area of Rectangle',
    description: 'Build a sequence to calculate and print the area of a rectangle.',
    expectedSequence: ['b1', 'b2', 'b3', 'b4', 'b5'],
    blocks: [
      { id: 'b1', type: 'Terminal', text: 'Start' },
      { id: 'b2', type: 'InputOutput', text: 'Input Length, Width' },
      { id: 'b3', type: 'Process', text: 'Area = Length * Width' },
      { id: 'b4', type: 'InputOutput', text: 'Print Area' },
      { id: 'b5', type: 'Terminal', text: 'End' },
      { id: 'd1', type: 'Process', text: 'Area = Length + Width' },
    ]
  },
  {
    id: 2,
    title: 'Voting Age (Yes Path)',
    description: 'Build the flow for a 20-year-old checking their voting eligibility.',
    expectedSequence: ['t1', 't2', 't3', 't4', 't5'],
    blocks: [
      { id: 't1', type: 'Terminal', text: 'Start' },
      { id: 't2', type: 'InputOutput', text: 'Input Age (20)' },
      { id: 't3', type: 'Decision', text: 'Age >= 18? (Yes)' },
      { id: 't4', type: 'InputOutput', text: 'Print "Can Vote"' },
      { id: 't5', type: 'Terminal', text: 'End' },
      { id: 'd2', type: 'InputOutput', text: 'Print "Cannot Vote"' },
    ]
  },
  {
    id: 3,
    title: 'Calculate Discount',
    description: 'Calculate 10% discount on a Price, then print Final Price.',
    expectedSequence: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
    blocks: [
      { id: 'c1', type: 'Terminal', text: 'Start' },
      { id: 'c2', type: 'InputOutput', text: 'Input Price' },
      { id: 'c3', type: 'Process', text: 'Discount = Price * 0.10' },
      { id: 'c4', type: 'Process', text: 'Final = Price - Discount' },
      { id: 'c5', type: 'InputOutput', text: 'Print Final Price' },
      { id: 'c6', type: 'Terminal', text: 'End' },
      { id: 'd3', type: 'Process', text: 'Final = Price + Discount' },
    ]
  }
];

export default function LabCS9Algorithms({ onExit }: { onExit?: () => void }) {
  const [activeTaskIdx] = useState(0);
  const task = tasks[activeTaskIdx];

  const [availableBlocks, setAvailableBlocks] = useState<AlgoBlock[]>([]);
  const [sequence, setSequence] = useState<AlgoBlock[]>([]);

  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailableBlocks([...task.blocks].sort(() => Math.random() - 0.5));
    setSequence([]);
    setLogs([`Task changed: ${task.title}`]);
  }, [activeTaskIdx, task]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const logAction = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleAdd = (block: AlgoBlock) => {
    setSequence(prev => [...prev, block]);
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
    logAction(`Added: ${block.text}`);
  };

  const handleRemove = (block: AlgoBlock, index: number) => {
    setSequence(prev => prev.filter((_, i) => i !== index));
    setAvailableBlocks(prev => [...prev, block]);
    logAction(`Removed: ${block.text}`);
  };

  const checkSequence = () => {
    if (sequence.length !== task.expectedSequence.length) {
      logAction(`Error: Sequence length is incorrect.`);
      return;
    }
    let correct = true;
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i].id !== task.expectedSequence[i]) {
        correct = false;
        break;
      }
    }
    if (correct) {
      logAction(`SUCCESS: Algorithm is correct!`);
    } else {
      logAction(`FAILED: The sequence logic is flawed.`);
    }
  };

  const getShapeClasses = (type: string) => {
    switch(type) {
      case 'Terminal': return 'rounded-full bg-red-100 border-red-400 text-red-900 px-6';
      case 'InputOutput': return '-skew-x-12 bg-blue-100 border-blue-400 text-blue-900 px-8';
      case 'Process': return 'rounded-sm bg-green-100 border-green-400 text-green-900 px-6';
      case 'Decision': return 'rotate-45 bg-yellow-100 border-yellow-400 text-yellow-900 w-24 h-24 flex items-center justify-center';
      default: return 'bg-slate-100 border-slate-400 px-6';
    }
  };

  const renderBlockContent = (block: AlgoBlock) => {
    if (block.type === 'Decision') {
      return <div className="-rotate-45 text-center text-xs font-bold leading-tight">{block.text}</div>;
    }
    if (block.type === 'InputOutput') {
      return <div className="skew-x-12 font-medium">{block.text}</div>;
    }
    return <div className="font-medium">{block.text}</div>;
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Algorithms Lab" />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        
        <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Task Details</h2>
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 mb-2">
            <h3 className="font-bold text-teal-900 mb-1">{task.title}</h3>
            <p className="text-sm text-teal-800">{task.description}</p>
          </div>

          <h3 className="font-bold text-slate-700 mt-2">Flowchart Symbols</h3>
          <div className="flex flex-col gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-6 rounded-full border-2 border-red-400 bg-red-100 shrink-0"></div>
              <span><strong>Terminal:</strong> Start or End of a program.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-6 -skew-x-12 border-2 border-blue-400 bg-blue-100 shrink-0"></div>
              <span><strong>Input/Output:</strong> Getting data or displaying results.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-6 border-2 border-green-400 bg-green-100 shrink-0"></div>
              <span><strong>Process:</strong> Calculations or variable assignments.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rotate-45 border-2 border-yellow-400 bg-yellow-100 shrink-0 mx-2"></div>
              <span><strong>Decision:</strong> Yes/No questions (branching).</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-200 p-4 rounded-xl shadow-inner border border-slate-300 overflow-y-auto flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-2 w-full text-center">Algorithm Canvas</h2>
          
          <div className="w-full bg-slate-50 p-3 rounded-lg border shadow-sm mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 text-center">Available Blocks (Click to add)</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {availableBlocks.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleAdd(b)}
                  className={`border-2 py-2 flex items-center justify-center shadow hover:scale-105 transition-transform ${getShapeClasses(b.type)}`}
                  style={{ minHeight: '3rem' }}
                >
                  {renderBlockContent(b)}
                </button>
              ))}
              {availableBlocks.length === 0 && <span className="text-sm text-slate-400 italic">All blocks used.</span>}
            </div>
          </div>

          <div className="w-full max-w-sm flex flex-col items-center gap-2 pb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Your Sequence (Click to remove)</h3>
            {sequence.length === 0 ? (
              <div className="text-sm text-slate-400 italic border-2 border-dashed border-slate-300 w-full text-center py-8 rounded-lg">Canvas is empty</div>
            ) : (
              sequence.map((b, i) => (
                <div key={b.id + i} className="flex flex-col items-center">
                  <button
                    onClick={() => handleRemove(b, i)}
                    className={`border-2 py-2 flex items-center justify-center shadow hover:opacity-80 transition-opacity ${getShapeClasses(b.type)}`}
                    style={{ minHeight: '3rem' }}
                  >
                    {renderBlockContent(b)}
                  </button>
                  {i < sequence.length - 1 && <ArrowDown className="text-slate-400 w-5 h-5 my-1" />}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Analysis & Validation</h2>
          
          <button 
            onClick={checkSequence}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 shadow-sm"
          >
            <Play className="w-5 h-5" /> Execute / Check Logic
          </button>

          <div className="flex-1 bg-slate-900 text-green-400 font-mono text-xs p-3 rounded-lg overflow-y-auto shadow-inner border border-slate-700">
            <div className="opacity-50 mb-2">--- TRACE LOGS ---</div>
            {logs.map((log, i) => <div key={i} className="mb-1 leading-tight">{log}</div>)}
            <div ref={logsEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
