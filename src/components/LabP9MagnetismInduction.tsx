import { useState, useRef } from 'react';
import { Info, RefreshCw, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Domain {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface LogEntry {
  id: number;
  action: string;
  strength: number;
}

export default function LabP9MagnetismInduction({ onExit }: { onExit?: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [magnetPos, setMagnetPos] = useState({ x: 200, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [domains, setDomains] = useState<Domain[]>(() => 
    Array.from({length: 24}).map((_, i) => ({
      id: i,
      x: 120 + (i % 8) * 22,
      y: 185 + Math.floor(i / 8) * 15,
      angle: Math.random() * 360
    }))
  );
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [barAlignment, setBarAlignment] = useState<'EW' | 'NS'>('EW');
  const [assessmentAnswer, setAssessmentAnswer] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);

  const calculateStrength = (currentDomains: Domain[]) => {
    let sumX = 0;
    let sumY = 0;
    currentDomains.forEach(d => {
      const rad = d.angle * Math.PI / 180;
      sumX += Math.cos(rad);
      sumY += Math.sin(rad);
    });
    const strength = Math.sqrt(sumX*sumX + sumY*sumY) / currentDomains.length * 100;
    return strength;
  };

  const handleMagnetPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handleMagnetPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    
    let mx = (e.clientX - rect.left) * scaleX;
    let my = (e.clientY - rect.top) * scaleY;
    
    if (mx < 0) mx = 0; if (mx > 400) mx = 400;
    if (my < 0) my = 0; if (my > 400) my = 400;

    setMagnetPos({ x: mx, y: my });

    setDomains(prev => {
      let changed = false;
      const newDomains = prev.map(d => {
        const dx = d.x - mx;
        const dy = d.y - (my + 20); // N pole bottom
        const r2 = dx*dx + dy*dy;
        if (r2 < 3600) { // radius 60
          const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
          changed = true;
          return { ...d, angle: targetAngle };
        }
        return d;
      });
      return changed ? newDomains : prev;
    });
  };

  const handleMagnetPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
    setDomains(prevDomains => {
      const strength = calculateStrength(prevDomains);
      setLogs(prevLogs => [...prevLogs, { id: Date.now(), action: 'Stroked with Magnet', strength }]);
      return prevDomains;
    });
  };

  const hammerBar = () => {
    setDomains(prevDomains => {
      const newDomains = prevDomains.map(d => {
         if (barAlignment === 'EW') {
           return { ...d, angle: Math.random() * 360 };
         } else {
           // NS alignment: roughly align to 0 (rightwards)
           return { ...d, angle: (Math.random() * 60 - 30) };
         }
      });
      const strength = calculateStrength(newDomains);
      setLogs(prevLogs => [...prevLogs, { id: Date.now(), action: `Hammered (${barAlignment})`, strength }]);
      return newDomains;
    });
  };

  const checkAssessment = () => {
    const ans = assessmentAnswer.trim().toLowerCase();
    if (ans === 'left' || ans === 'l') {
      setAssessmentResult("Correct! The domains' North poles are repelled by the magnet's North pole, ending up pointing left. So the left end becomes North.");
    } else {
      setAssessmentResult("Incorrect. Observe the red arrows (North poles of domains) after stroking from left to right. Which direction do they point?");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab: Magnetic Induction" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        {/* Theory Column */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-800">
            <Info className="mr-2" /> Theory & Context
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              A piece of unmagnetized steel contains tiny <strong>magnetic domains</strong> (groups of atoms) that are randomly oriented. Because they point in all directions, their magnetic fields cancel out.
            </p>
            <p>We can induce magnetization by aligning these domains:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Stroking Method:</strong> Repeatedly dragging a permanent magnet over the steel in <em>one direction</em> forces the domains to align.
              </li>
              <li>
                <strong>Hammering:</strong> Striking the metal vibrates the domains, allowing them to align with an external magnetic field (like Earth's). If struck while facing East-West, the vibration can randomize the domains and destroy magnetization.
              </li>
            </ul>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-6">
              <h3 className="font-semibold text-indigo-800 mb-2">Instructions:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li><strong>Drag the magnet</strong> repeatedly over the steel bar from one end to the other to observe the domains aligning.</li>
                <li><strong>Change the bar's orientation</strong> and press <em>Hammer Bar</em> to see the effects of vibration on domain alignment.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Simulator Column */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-indigo-800 text-center">Interactive Simulator</h2>
          
          <div className="flex gap-4 mb-4 justify-center bg-slate-50 p-3 rounded-lg border border-slate-200">
             <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input type="radio" name="align" checked={barAlignment === 'EW'} onChange={() => setBarAlignment('EW')} className="w-4 h-4 text-indigo-600" />
                Bar Aligned East-West
             </label>
             <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input type="radio" name="align" checked={barAlignment === 'NS'} onChange={() => setBarAlignment('NS')} className="w-4 h-4 text-indigo-600" />
                Bar Aligned North-South
             </label>
          </div>

          <div className="flex-1 relative flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-300 shadow-inner">
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              className="w-full h-full"
            >
              {/* Steel Bar */}
              <rect x="110" y="170" width="190" height="60" fill="#cbd5e1" stroke="#94a3b8" rx="4" />
              <text x="205" y="160" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">STEEL BAR</text>
              
              {/* Domains */}
              {domains.map(d => (
                 <g key={d.id} transform={`translate(${d.x}, ${d.y}) rotate(${d.angle})`}>
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#333" strokeWidth="1.5" />
                    <polygon points="8,0 4,-4 4,4" fill="#ef4444" />
                 </g>
              ))}

              {/* Draggable Magnet */}
              <g 
                transform={`translate(${magnetPos.x}, ${magnetPos.y})`} 
                onPointerDown={handleMagnetPointerDown}
                onPointerMove={handleMagnetPointerMove}
                onPointerUp={handleMagnetPointerUp}
                onPointerCancel={handleMagnetPointerUp}
                style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                <rect x="-15" y="-40" width="30" height="40" fill="#3b82f6" /> {/* South */}
                <rect x="-15" y="0" width="30" height="40" fill="#ef4444" /> {/* North */}
                <text x="0" y="25" fill="white" fontWeight="bold" textAnchor="middle" fontSize="14" pointerEvents="none">N</text>
                <text x="0" y="-15" fill="white" fontWeight="bold" textAnchor="middle" fontSize="14" pointerEvents="none">S</text>
              </g>
            </svg>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={hammerBar}
              className="flex items-center px-5 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              Hammer Bar
            </button>
            <button
              onClick={() => {
                 setDomains(prev => prev.map(d => ({...d, angle: Math.random() * 360})));
                 setLogs([]);
              }}
              className="flex items-center px-5 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Steel
            </button>
          </div>
        </div>

        {/* Data & Analysis Column */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-indigo-800">Data Logging & Analysis</h2>
          
          <div className="flex-1 overflow-y-auto mb-6 border border-slate-200 rounded-lg max-h-64">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 border-b font-semibold text-slate-700">Action</th>
                  <th className="px-4 py-3 border-b font-semibold text-slate-700">Net Magnetization</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-slate-500 italic">
                      Interact with the simulator to record data.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 text-slate-600">{log.action}</td>
                      <td className="px-4 py-2 font-mono font-medium">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-slate-200 rounded-full mr-2 overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{width: `${log.strength}%`}}></div>
                          </div>
                          {log.strength.toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Assessment
            </h3>
            <p className="text-sm text-slate-700 mb-4 leading-relaxed">
              If you stroke the unmagnetized steel bar from Left to Right with the <strong>North</strong> pole of the magnet, which end of the bar becomes the North pole (Left or Right)?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={assessmentAnswer}
                onChange={(e) => setAssessmentAnswer(e.target.value)}
                placeholder="Type 'Left' or 'Right'"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={checkAssessment}
                className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Check
              </button>
            </div>
            {assessmentResult && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${assessmentResult.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {assessmentResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
