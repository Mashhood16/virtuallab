import { useState, useEffect, useRef } from 'react';
import { Server, Box, CheckCircle } from 'lucide-react';

interface ComponentItem { id: string; type: string; name: string; }
interface SlotItem { id: string; name: string; expected: string; filledBy: ComponentItem | null; }
interface RoleItem { id: string; desc: string; layer: number; }
interface LayerItem { num: number; name: string; expectedLayer: number; filledBy: RoleItem | null; }

export default function LabCS9ComputerSystems({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState<'hardware' | 'osi'>('hardware');

  const [hwSlots, setHwSlots] = useState<SlotItem[]>([
    { id: 'cpu', name: 'CPU Socket', expected: 'CPU', filledBy: null },
    { id: 'ram', name: 'RAM Slots', expected: 'RAM', filledBy: null },
    { id: 'gpu', name: 'PCIe Slot', expected: 'GPU', filledBy: null },
    { id: 'ssd', name: 'M.2 Slot', expected: 'SSD', filledBy: null },
    { id: 'psu', name: 'Power Connector', expected: 'PSU', filledBy: null },
  ]);

  const [availableHw, setAvailableHw] = useState<ComponentItem[]>([
    { id: 'c1', type: 'RAM', name: '16GB DDR4 RAM' },
    { id: 'c2', type: 'CPU', name: 'Multi-core Processor' },
    { id: 'c3', type: 'GPU', name: 'Graphics Card' },
    { id: 'c4', type: 'PSU', name: '650W Power Supply' },
    { id: 'c5', type: 'SSD', name: '1TB NVMe SSD' },
  ]);

  const [selectedHw, setSelectedHw] = useState<ComponentItem | null>(null);

  const [osiLayers, setOsiLayers] = useState<LayerItem[]>([
    { num: 7, name: 'Application', expectedLayer: 7, filledBy: null },
    { num: 6, name: 'Presentation', expectedLayer: 6, filledBy: null },
    { num: 5, name: 'Session', expectedLayer: 5, filledBy: null },
    { num: 4, name: 'Transport', expectedLayer: 4, filledBy: null },
    { num: 3, name: 'Network', expectedLayer: 3, filledBy: null },
    { num: 2, name: 'Data Link', expectedLayer: 2, filledBy: null },
    { num: 1, name: 'Physical', expectedLayer: 1, filledBy: null },
  ]);

  const [availableRoles, setAvailableRoles] = useState<RoleItem[]>([
    { id: 'r1', layer: 7, desc: 'Network applications (HTTP, FTP)' },
    { id: 'r2', layer: 6, desc: 'Data formatting, encryption' },
    { id: 'r3', layer: 5, desc: 'Establishes & manages connections' },
    { id: 'r4', layer: 4, desc: 'End-to-end reliability (TCP/UDP)' },
    { id: 'r5', layer: 3, desc: 'Routing and logical addressing (IP)' },
    { id: 'r6', layer: 2, desc: 'MAC addressing, switches' },
    { id: 'r7', layer: 1, desc: 'Cables, bits, hubs' },
  ].sort(() => Math.random() - 0.5));

  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const logAction = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleHwSlotClick = (slotId: string) => {
    if (selectedHw) {
      setHwSlots(prev => prev.map(s => {
        if (s.id === slotId) {
          if (s.filledBy) setAvailableHw(a => [...a, s.filledBy!]);
          return { ...s, filledBy: selectedHw };
        }
        return s;
      }));
      setAvailableHw(prev => prev.filter(c => c.id !== selectedHw.id));
      setSelectedHw(null);
      logAction(`Placed ${selectedHw.name} into Motherboard Slot`);
    } else {
      const slot = hwSlots.find(s => s.id === slotId);
      if (slot?.filledBy) {
        setAvailableHw(prev => [...prev, slot.filledBy!]);
        setHwSlots(prev => prev.map(s => s.id === slotId ? { ...s, filledBy: null } : s));
        logAction(`Removed ${slot.filledBy.name}`);
      }
    }
  };

  const handleOsiSlotClick = (layerNum: number) => {
    if (selectedRole) {
      setOsiLayers(prev => prev.map(l => {
        if (l.num === layerNum) {
          if (l.filledBy) setAvailableRoles(a => [...a, l.filledBy!]);
          return { ...l, filledBy: selectedRole };
        }
        return l;
      }));
      setAvailableRoles(prev => prev.filter(r => r.id !== selectedRole.id));
      setSelectedRole(null);
      logAction(`Assigned role to Layer ${layerNum}`);
    } else {
      const layer = osiLayers.find(l => l.num === layerNum);
      if (layer?.filledBy) {
        setAvailableRoles(prev => [...prev, layer.filledBy!]);
        setOsiLayers(prev => prev.map(l => l.num === layerNum ? { ...l, filledBy: null } : l));
        logAction(`Removed role from Layer ${layerNum}`);
      }
    }
  };

  const checkHw = () => {
    let score = 0;
    hwSlots.forEach(s => { if (s.filledBy?.type === s.expected) score++; });
    logAction(`Checked Hardware: ${score}/${hwSlots.length} correct`);
  };

  const checkOsi = () => {
    let score = 0;
    osiLayers.forEach(l => { if (l.filledBy?.layer === l.expectedLayer) score++; });
    logAction(`Checked OSI Model: ${score}/${osiLayers.length} correct`);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md shrink-0">
        <div>
          <h1 className="text-xl font-bold">Computer Systems Lab</h1>
          <p className="text-sm opacity-80">Hardware Assembly & Networking Basics</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-indigo-800 rounded-lg p-1">
            <button onClick={() => setActiveTab('hardware')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'hardware' ? 'bg-indigo-500 font-bold' : 'hover:bg-indigo-700'}`}>Hardware</button>
            <button onClick={() => setActiveTab('osi')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'osi' ? 'bg-indigo-500 font-bold' : 'hover:bg-indigo-700'}`}>OSI Model</button>
          </div>
          {onExit && (
            <button onClick={onExit} className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md font-semibold transition-colors">
              Exit Lab
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Theory & Context</h2>
          {activeTab === 'hardware' ? (
            <div className="text-slate-600 space-y-4 text-sm leading-relaxed">
              <p><strong>CPU (Central Processing Unit):</strong> The brain of the computer, handling instructions and processing data.</p>
              <p><strong>RAM (Random Access Memory):</strong> Short-term volatile memory used for active tasks and applications.</p>
              <p><strong>GPU (Graphics Processing Unit):</strong> Specialized processor for rendering images and video.</p>
              <p><strong>SSD (Solid State Drive):</strong> Long-term non-volatile storage for the OS and files.</p>
              <p><strong>PSU (Power Supply Unit):</strong> Converts electrical power from an outlet into usable power for components.</p>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <strong className="text-blue-800">Task:</strong> Select a component from the list and place it into the correct motherboard slot.
              </div>
            </div>
          ) : (
            <div className="text-slate-600 space-y-4 text-sm leading-relaxed">
              <p>The <strong>OSI Model</strong> (Open Systems Interconnection) conceptualizes how data is transmitted over a network in 7 distinct layers.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>7. Application:</strong> End-user apps.</li>
                <li><strong>6. Presentation:</strong> Data format, encryption.</li>
                <li><strong>5. Session:</strong> Connection management.</li>
                <li><strong>4. Transport:</strong> Reliability, TCP/UDP.</li>
                <li><strong>3. Network:</strong> Routing, IP addresses.</li>
                <li><strong>2. Data Link:</strong> MAC addresses, switches.</li>
                <li><strong>1. Physical:</strong> Raw bits over cables/radio.</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <strong className="text-blue-800">Task:</strong> Assign the correct functional role to each layer of the OSI stack.
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-100 p-4 rounded-xl shadow-inner border border-slate-300 overflow-y-auto flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-4 w-full text-center">Interactive Workspace</h2>
          
          {activeTab === 'hardware' && (
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {availableHw.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedHw(c)}
                    className={`p-2 rounded-md border-2 text-sm flex items-center gap-2 transition-transform hover:scale-105 ${selectedHw?.id === c.id ? 'border-indigo-500 bg-indigo-100 font-bold' : 'border-slate-300 bg-white'}`}
                  >
                    <Server className="w-4 h-4" /> {c.name}
                  </button>
                ))}
                {availableHw.length === 0 && <span className="text-sm text-slate-400 italic">All components placed.</span>}
              </div>

              <div className="bg-green-800 rounded-xl p-6 relative w-full max-w-md mx-auto aspect-[3/4] border-4 border-green-900 shadow-2xl flex flex-col gap-4">
                <div className="absolute top-2 left-2 text-green-400 opacity-50 font-mono text-xs">MOTHERBOARD_V1</div>
                {hwSlots.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleHwSlotClick(s.id)}
                    className={`flex-1 border-2 border-dashed rounded-lg flex items-center justify-center p-2 transition-colors
                      ${selectedHw ? 'hover:bg-green-700 border-yellow-400 cursor-pointer' : ''}
                      ${s.filledBy ? 'bg-slate-800 border-slate-600 text-white' : 'border-green-600 text-green-300'}`}
                  >
                    {s.filledBy ? (
                      <div className="flex flex-col items-center">
                        <Box className="w-6 h-6 mb-1 text-indigo-300" />
                        <span className="text-xs font-bold">{s.filledBy.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm">{s.name}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'osi' && (
            <div className="w-full flex flex-col lg:flex-row gap-6 h-full">
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="font-bold text-sm text-slate-500 text-center uppercase tracking-wider">Roles</h3>
                {availableRoles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r)}
                    className={`p-3 rounded-lg border-2 text-sm text-left transition-all hover:translate-x-1 ${selectedRole?.id === r.id ? 'border-indigo-500 bg-indigo-50 font-bold shadow-md' : 'border-slate-300 bg-white shadow-sm'}`}
                  >
                    {r.desc}
                  </button>
                ))}
                {availableRoles.length === 0 && <div className="text-center text-sm text-slate-400 italic p-4">All roles assigned.</div>}
              </div>
              
              <div className="flex-1 flex flex-col gap-1">
                <h3 className="font-bold text-sm text-slate-500 text-center uppercase tracking-wider">OSI Layers</h3>
                {osiLayers.map(l => (
                  <div key={l.num} className="flex gap-2 items-stretch h-14">
                    <div className="w-12 bg-slate-800 text-white font-bold flex items-center justify-center rounded-l-lg shrink-0 shadow-sm border border-slate-700">
                      L{l.num}
                    </div>
                    <button
                      onClick={() => handleOsiSlotClick(l.num)}
                      className={`flex-1 border-2 border-dashed rounded-r-lg flex items-center p-2 text-sm text-left transition-colors
                        ${selectedRole ? 'hover:bg-indigo-50 border-indigo-400 cursor-pointer' : ''}
                        ${l.filledBy ? 'bg-indigo-600 border-indigo-700 text-white shadow-inner font-medium' : 'border-slate-300 bg-slate-50 text-slate-400'}`}
                    >
                      {l.filledBy ? l.filledBy.desc : <span className="opacity-50">{l.name} - Select a role...</span>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Assessment & Logs</h2>
          
          <div className="mb-6 flex flex-col gap-2">
            <button 
              onClick={activeTab === 'hardware' ? checkHw : checkOsi}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Check {activeTab === 'hardware' ? 'Hardware' : 'OSI Layers'}
            </button>
            <div className="text-xs text-slate-500 text-center mt-1">
              Assemble all parts before checking.
            </div>
          </div>

          <div className="flex-1 bg-slate-900 text-green-400 font-mono text-xs p-3 rounded-lg overflow-y-auto shadow-inner border border-slate-700">
            <div className="opacity-50 mb-2">--- SYSTEM LOGS ---</div>
            {logs.length === 0 ? (
              <div className="opacity-50 italic">Waiting for activity...</div>
            ) : (
              logs.map((log, i) => <div key={i} className="mb-1 leading-tight">{log}</div>)
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
