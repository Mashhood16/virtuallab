import { useState, useEffect } from 'react';
import { Database, Calculator, Box, Hexagon, Target } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC11MolecularBonding({ onExit }: { onExit?: () => void }) {
  const [centralAtom, setCentralAtom] = useState('C');
  const [peripheralCount, setPeripheralCount] = useState(4);
  const [lonePairs, setLonePairs] = useState(0);

  const getShape = () => {
    const stericNum = peripheralCount + lonePairs;
    if (stericNum === 2) return 'Linear';
    if (stericNum === 3 && lonePairs === 0) return 'Trigonal Planar';
    if (stericNum === 3 && lonePairs === 1) return 'Bent';
    if (stericNum === 4 && lonePairs === 0) return 'Tetrahedral';
    if (stericNum === 4 && lonePairs === 1) return 'Trigonal Pyramidal';
    if (stericNum === 4 && lonePairs === 2) return 'Bent';
    return 'Complex/Unknown';
  };

  const [logs, setLogs] = useState<{molecule: string, shape: string}[]>([]);
  const logData = () => {
    setLogs([...logs, { molecule: `${centralAtom}X${peripheralCount}E${lonePairs}`, shape: getShape() }]);
  };

  // Assessment
  const molecules = [
    { name: 'CH4', shape: 'Tetrahedral' },
    { name: 'NH3', shape: 'Trigonal Pyramidal' },
    { name: 'H2O', shape: 'Bent' },
    { name: 'CO2', shape: 'Linear' },
    { name: 'BF3', shape: 'Trigonal Planar' }
  ];
  const [targetMolecule, setTargetMolecule] = useState<{name: string, shape: string} | null>(null);
  const [answerShape, setAnswerShape] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const rand = molecules[Math.floor(Math.random() * molecules.length)];
    setTargetMolecule(rand);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAnswer = () => {
    if (targetMolecule && answerShape.toLowerCase() === targetMolecule.shape.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="VSEPR Theory & Molecular Bonding" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        
        {/* Column 1: Theory */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Box className="w-5 h-5 text-fuchsia-500" />
              VSEPR Theory Setup
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Valence Shell Electron Pair Repulsion (VSEPR) theory assumes that electron pairs in the valence shell of a central atom will adopt an arrangement that minimizes repulsions between these pairs.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              By controlling the number of bonding pairs (peripheral atoms) and non-bonding pairs (lone pairs), you can predict the 3D molecular geometry.
            </p>
          </div>

          <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-4">Molecular Builder</h3>
            
            <label className="block text-sm font-medium text-slate-700 mb-1">Central Atom Symbol</label>
            <input 
              type="text" maxLength={2} 
              value={centralAtom} onChange={(e) => setCentralAtom(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg uppercase"
            />

            <label className="block text-sm font-medium text-slate-700 mb-1">Peripheral Atoms: {peripheralCount}</label>
            <input 
              type="range" min="1" max="6" step="1" 
              value={peripheralCount} onChange={(e) => setPeripheralCount(parseInt(e.target.value))}
              className="w-full mb-4 accent-fuchsia-600"
            />

            <label className="block text-sm font-medium text-slate-700 mb-1">Lone Pairs: {lonePairs}</label>
            <input 
              type="range" min="0" max="3" step="1" 
              value={lonePairs} onChange={(e) => setLonePairs(parseInt(e.target.value))}
              className="w-full mb-6 accent-fuchsia-600"
            />

            <div className="text-center p-3 bg-fuchsia-100 rounded-lg">
              <span className="text-sm text-fuchsia-800 font-semibold">Predicted Geometry:</span>
              <div className="text-lg font-bold text-fuchsia-900">{getShape()}</div>
            </div>
          </div>
        </div>

        {/* Column 2: 3D Visualizer Simulator */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-slate-800 w-full mb-4">3D Molecular Projection</h2>
          
          <svg viewBox="0 0 400 400" className="w-full h-80 bg-slate-900 rounded-lg shadow-inner">
            <circle cx="200" cy="200" r="30" fill="#f43f5e" />
            <text x="200" y="205" className="text-sm fill-white font-bold" textAnchor="middle">{centralAtom || '?'}</text>

            {Array.from({ length: peripheralCount }).map((_, i) => {
              const angle = (i * (360 / peripheralCount)) * (Math.PI / 180);
              const radius = 100;
              const cx = 200 + radius * Math.cos(angle);
              const cy = 200 + radius * Math.sin(angle);
              return (
                <g key={`p-${i}`} className="transition-all duration-500">
                  <line x1="200" y1="200" x2={cx} y2={cy} stroke="#cbd5e1" strokeWidth="4" />
                  <circle cx={cx} cy={cy} r="20" fill="#3b82f6" />
                  <text x={cx} y={cy+5} className="text-xs fill-white font-bold" textAnchor="middle">X</text>
                </g>
              );
            })}
            
            {Array.from({ length: lonePairs }).map((_, i) => {
              const totalPositions = peripheralCount + lonePairs;
              const positionIndex = peripheralCount + i;
              const angle = (positionIndex * (360 / Math.max(1, totalPositions))) * (Math.PI / 180);
              const radius = 80;
              const cx = 200 + radius * Math.cos(angle);
              const cy = 200 + radius * Math.sin(angle);
              return (
                <g key={`lp-${i}`} className="transition-all duration-500 animate-pulse">
                  <path d={`M 200 200 Q ${cx} ${cy-30} ${cx} ${cy} Q ${cx} ${cy+30} 200 200`} fill="#fde047" opacity="0.4" />
                  <circle cx={cx} cy={cy} r="6" fill="#fbbf24" />
                  <circle cx={cx + (cx > 200 ? 12 : -12)} cy={cy} r="6" fill="#fbbf24" />
                </g>
              );
            })}
          </svg>

          <button onClick={logData} className="mt-6 px-4 py-2 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <Database className="w-4 h-4" /> Save Molecular Profile
          </button>
        </div>

        {/* Column 3: Analysis */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Molecule Library
            </h2>
            <div className="overflow-y-auto max-h-48 border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Configuration</th>
                    <th className="px-3 py-2">Geometry</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={2} className="px-3 py-4 text-center text-slate-500 italic">No molecules saved.</td></tr>
                  ) : (
                    logs.map((l, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-3 py-2 font-mono">{l.molecule}</td>
                        <td className="px-3 py-2">{l.shape}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-rose-500" />
              Geometry Assessment
            </h2>
            {targetMolecule && (
              <p className="text-sm text-slate-600 mb-4">
                What is the VSEPR geometry of <strong>{targetMolecule.name}</strong>? 
                Use the builder to figure out its lone pairs and peripheral atoms.
              </p>
            )}
            <div className="flex gap-2">
              <select 
                value={answerShape} onChange={(e) => setAnswerShape(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
              >
                <option value="">Select Shape...</option>
                <option value="Linear">Linear</option>
                <option value="Bent">Bent</option>
                <option value="Trigonal Planar">Trigonal Planar</option>
                <option value="Trigonal Pyramidal">Trigonal Pyramidal</option>
                <option value="Tetrahedral">Tetrahedral</option>
              </select>
              <button onClick={checkAnswer} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                <Target className="w-4 h-4" /> Verify
              </button>
            </div>
            {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">Correct geometry identified!</p>}
            {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">Incorrect. Re-evaluate the electron pairs.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
