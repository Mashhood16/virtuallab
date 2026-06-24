import { useState, useRef, useEffect } from 'react';
import { Layers, CheckCircle, XCircle, Play, Save } from 'lucide-react';
import { useHistory } from '../store';
import LabHeader from './LabHeader';

export default function LabCS12DataStructures({ onExit }: { onExit?: () => void }) {
  const { addRecord } = useHistory();
  const startTime = useRef(Date.now());
  const [activeTab, setActiveTab] = useState<'Stack' | 'Queue' | 'Tree'>('Tree');
  
  // Stack State
  const [stack, setStack] = useState<number[]>([]);
  const pushStack = () => setStack([...stack, Math.floor(Math.random() * 100)]);
  const popStack = () => setStack(stack.slice(0, -1));

  // Queue State
  const [queue, setQueue] = useState<number[]>([]);
  const enqueue = () => setQueue([...queue, Math.floor(Math.random() * 100)]);
  const dequeue = () => setQueue(queue.slice(1));

  // Tree State
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const treeNodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const preOrder = ['A', 'B', 'D', 'E', 'C', 'F', 'G'];
  const inOrder = ['D', 'B', 'E', 'A', 'F', 'C', 'G'];
  const postOrder = ['D', 'E', 'B', 'F', 'G', 'C', 'A'];

  const animateTraversal = (sequence: string[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveNode(null);
    let i = 0;
    const step = () => {
      if (i < sequence.length) {
        setActiveNode(sequence[i]);
        i++;
        timeoutRef.current = setTimeout(step, 800);
      } else {
        timeoutRef.current = setTimeout(() => setActiveNode(null), 800);
      }
    };
    step();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Assessment State
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  
  const [q1Status, setQ1Status] = useState<boolean | null>(null);
  const [q2Status, setQ2Status] = useState<boolean | null>(null);
  const [q3Status, setQ3Status] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} variant="dark" title="Interactive Memory Management" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Theory Column */}
        <div className="bg-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-teal-800 border-b pb-2">Theory & Context</h2>
          <div className="space-y-4 text-slate-700 overflow-y-auto pr-2 flex-1 text-sm">
            <p>
              <strong>Data Structures</strong> organize and store data to enable efficient access and modification.
            </p>
            <h3 className="font-semibold text-teal-700 mt-2">Stacks (LIFO)</h3>
            <p>
              A Stack follows the Last-In-First-Out principle. Operations like <code>Push</code> (add to top) and <code>Pop</code> (remove from top) execute in O(1) time. Used in undo mechanisms and call stacks.
            </p>
            <h3 className="font-semibold text-teal-700 mt-2">Queues (FIFO)</h3>
            <p>
              A Queue follows the First-In-First-Out principle. <code>Enqueue</code> adds to the back, <code>Dequeue</code> removes from the front. Used in task scheduling and breadth-first search.
            </p>
            <h3 className="font-semibold text-teal-700 mt-2">Binary Trees</h3>
            <p>
              A hierarchical structure where each node has at most two children. 
              <br/>- <strong>Pre-Order:</strong> Root, Left, Right
              <br/>- <strong>In-Order:</strong> Left, Root, Right
              <br/>- <strong>Post-Order:</strong> Left, Right, Root
            </p>
          </div>
        </div>

        {/* Simulation Column */}
        <div className="bg-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-teal-800 border-b pb-2">Visualizer</h2>
          
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab('Tree')} className={`px-4 py-1 rounded-full text-sm font-bold ${activeTab === 'Tree' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>Tree</button>
            <button onClick={() => setActiveTab('Stack')} className={`px-4 py-1 rounded-full text-sm font-bold ${activeTab === 'Stack' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>Stack</button>
            <button onClick={() => setActiveTab('Queue')} className={`px-4 py-1 rounded-full text-sm font-bold ${activeTab === 'Queue' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>Queue</button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-slate-200 p-4 relative overflow-hidden">
            {activeTab === 'Tree' && (
              <div className="w-full flex flex-col items-center">
                <svg width="100%" height="220" viewBox="0 0 300 200" className="mt-2">
                  <line x1="150" y1="30" x2="75" y2="100" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="150" y1="30" x2="225" y2="100" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="75" y1="100" x2="37.5" y2="170" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="75" y1="100" x2="112.5" y2="170" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="225" y1="100" x2="187.5" y2="170" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="225" y1="100" x2="262.5" y2="170" stroke="#94a3b8" strokeWidth="2" />

                  {treeNodes.map((node, i) => {
                    const coords = [
                      { x: 150, y: 30 }, { x: 75, y: 100 }, { x: 225, y: 100 },
                      { x: 37.5, y: 170 }, { x: 112.5, y: 170 }, { x: 187.5, y: 170 }, { x: 262.5, y: 170 }
                    ];
                    const isActive = activeNode === node;
                    return (
                      <g key={node}>
                        <circle cx={coords[i].x} cy={coords[i].y} r="18" fill={isActive ? '#14b8a6' : '#e2e8f0'} stroke="#0f766e" strokeWidth="2" className="transition-colors duration-300" />
                        <text x={coords[i].x} y={coords[i].y} textAnchor="middle" dy=".3em" fill={isActive ? '#ffffff' : '#0f766e'} fontSize="14" fontWeight="bold">
                          {node}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => animateTraversal(preOrder)} className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 flex items-center gap-1"><Play size={12}/> Pre-Order</button>
                  <button onClick={() => animateTraversal(inOrder)} className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 flex items-center gap-1"><Play size={12}/> In-Order</button>
                  <button onClick={() => animateTraversal(postOrder)} className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 flex items-center gap-1"><Play size={12}/> Post-Order</button>
                </div>
              </div>
            )}

            {activeTab === 'Stack' && (
              <div className="w-full flex flex-col items-center h-full justify-end pb-4">
                <div className="flex gap-2 mb-6">
                  <button onClick={pushStack} className="px-4 py-2 bg-teal-600 text-white rounded font-bold hover:bg-teal-700">Push</button>
                  <button onClick={popStack} disabled={stack.length === 0} className="px-4 py-2 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 disabled:opacity-50">Pop</button>
                </div>
                <div className="w-32 border-x-4 border-b-4 border-slate-700 min-h-[150px] flex flex-col-reverse items-center justify-start p-1 bg-slate-50">
                  {stack.map((val, idx) => (
                    <div key={idx} className="w-full bg-teal-500 text-white text-center font-bold py-2 mb-1 rounded border border-teal-700 animate-fade-in">
                      {val}
                    </div>
                  ))}
                  {stack.length === 0 && <span className="text-slate-400 text-sm mt-auto mb-2">Empty Stack</span>}
                </div>
              </div>
            )}

            {activeTab === 'Queue' && (
              <div className="w-full flex flex-col items-center h-full justify-center">
                <div className="flex gap-2 mb-6">
                  <button onClick={enqueue} className="px-4 py-2 bg-teal-600 text-white rounded font-bold hover:bg-teal-700">Enqueue</button>
                  <button onClick={dequeue} disabled={queue.length === 0} className="px-4 py-2 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 disabled:opacity-50">Dequeue</button>
                </div>
                <div className="w-full max-w-sm h-20 border-y-4 border-slate-700 flex items-center p-1 bg-slate-50 overflow-x-auto gap-1">
                  {queue.length === 0 && <span className="text-slate-400 text-sm mx-auto">Empty Queue</span>}
                  {queue.map((val, idx) => (
                    <div key={idx} className="min-w-[3rem] h-full bg-teal-500 text-white flex items-center justify-center font-bold rounded border border-teal-700">
                      {val}
                    </div>
                  ))}
                </div>
                <div className="w-full max-w-sm flex justify-between mt-2 text-xs font-bold text-slate-500">
                  <span>← Front (Dequeue)</span>
                  <span>Back (Enqueue) ←</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Column */}
        <div className="bg-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-teal-800 border-b pb-2">Analysis & Assessment</h2>
          
          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-2">Q1: If an empty Stack performs Push(5), Push(10), Pop(), Push(3), what is the top element?</label>
              <div className="flex gap-2">
                <input type="text" value={q1} onChange={e => setQ1(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Enter number..." />
                <button onClick={() => setQ1Status(q1.trim() === '3')} className="bg-teal-600 text-white px-3 py-1 rounded font-bold text-sm">Check</button>
              </div>
              {q1Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
              {q1Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-2">Q2: Based on the visualizer Tree, what is the exact Pre-Order traversal sequence? (e.g. A,B,C...)</label>
              <div className="flex gap-2">
                <input type="text" value={q2} onChange={e => setQ2(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="A,B,D,E,C,F,G" />
                <button onClick={() => setQ2Status(q2.replace(/\s/g, '').toUpperCase() === 'A,B,D,E,C,F,G')} className="bg-teal-600 text-white px-3 py-1 rounded font-bold text-sm">Check</button>
              </div>
              {q2Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
              {q2Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-2">Q3: Which data structure operates on a FIFO (First-In-First-Out) principle?</label>
              <div className="flex gap-2">
                <input type="text" value={q3} onChange={e => setQ3(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="e.g. Stack or Queue" />
                <button onClick={() => setQ3Status(q3.trim().toLowerCase() === 'queue')} className="bg-teal-600 text-white px-3 py-1 rounded font-bold text-sm">Check</button>
              </div>
              {q3Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
              {q3Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <button 
                onClick={() => {
                  let score = 0;
                  if (q1Status) score += 33;
                  if (q2Status) score += 33;
                  if (q3Status) score += 34;

                  addRecord({
                    labId: 'cs12_datastructures',
                    title: 'Interactive Memory Management',
                    subject: 'Computer Science',
                    score,
                    maxScore: 100,
                    timeSpentSeconds: Math.floor((Date.now() - startTime.current) / 1000),
                    experimentData: {
                      'Final Stack Size': stack.length,
                      'Final Queue Size': queue.length,
                      'Last Viewed Tab': activeTab,
                      'Q1 Correct': q1Status ? 'Yes' : 'No',
                      'Q2 Correct': q2Status ? 'Yes' : 'No',
                      'Q3 Correct': q3Status ? 'Yes' : 'No'
                    }
                  });
                  if (onExit) onExit();
                }}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <Save size={20} />
                Submit Results & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
