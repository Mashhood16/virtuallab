import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Table as TableIcon, BookOpen, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabM9AlgebraicManipulation({ onExit }: LabProps) {
  const [mode, setMode] = useState<'poly' | 'optics'>('poly');

  // Poly State
  const [xVal, setXVal] = useState<number>(5);
  const [aVal, setAVal] = useState<number>(2);
  const [bVal, setBVal] = useState<number>(3);

  // Optics State
  const [uVal, setUVal] = useState<number>(20);
  const [vVal, setVVal] = useState<number>(30);

  // Logs
  const [logs, setLogs] = useState<any[]>([]);

  const handleRecord = () => {
    if (mode === 'poly') {
      const area = (xVal + aVal) * (xVal + bVal);
      setLogs([{ mode: 'poly', input: `x=${xVal}, a=${aVal}, b=${bVal}`, res: `Area = ${area}` }, ...logs]);
    } else {
      const focal = (uVal * vVal) / (uVal + vVal);
      setLogs([{ mode: 'optics', input: `u=${uVal}, v=${vVal}`, res: `f = ${focal.toFixed(2)}` }, ...logs]);
    }
  };

  // Assessment Poly
  const [qPolyA, setQPolyA] = useState<number>(2);
  const [qPolyB, setQPolyB] = useState<number>(3);
  const [ansPolyX, setAnsPolyX] = useState<string>('');
  const [ansPolyC, setAnsPolyC] = useState<string>('');
  const [statusPoly, setStatusPoly] = useState<boolean | null>(null);

  // Assessment Optics
  const [qOpticsU, setQOpticsU] = useState<number>(15);
  const [qOpticsV, setQOpticsV] = useState<number>(10);
  const [ansOpticsF, setAnsOpticsF] = useState<string>('');
  const [statusOptics, setStatusOptics] = useState<boolean | null>(null);

  useEffect(() => {
    setQPolyA(Math.floor(Math.random() * 5) + 1);
    setQPolyB(Math.floor(Math.random() * 5) + 1);
    setQOpticsU(Math.floor(Math.random() * 20) + 10);
    setQOpticsV(Math.floor(Math.random() * 20) + 10);
  }, []);

  const checkPoly = () => {
    const correctX = qPolyA + qPolyB;
    const correctC = qPolyA * qPolyB;
    if (parseInt(ansPolyX) === correctX && parseInt(ansPolyC) === correctC) {
      setStatusPoly(true);
    } else {
      setStatusPoly(false);
    }
  };

  const checkOptics = () => {
    const correctF = (qOpticsU * qOpticsV) / (qOpticsU + qOpticsV);
    if (Math.abs(parseFloat(ansOpticsF) - correctF) < 0.2) {
      setStatusOptics(true);
    } else {
      setStatusOptics(false);
    }
  };

  // Render variables for Optics SVG
  const f = (uVal * vVal) / (uVal + vVal);
  const imgY = 100 + 40 * (vVal / uVal);
  const imgX = 150 + vVal * 3;
  const objX = 150 - uVal * 3;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Virtual Lab: Algebraic Manipulation" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col border border-slate-200">
          <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
            <BookOpen className="mr-2" /> Theory & Context
          </h2>
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6 shrink-0">
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'poly' ? 'bg-slate-50 shadow text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setMode('poly')}
            >
              Polynomials
            </button>
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'optics' ? 'bg-slate-50 shadow text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setMode('optics')}
            >
              Optics & LCM
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 prose prose-sm text-slate-700">
            {mode === 'poly' ? (
              <>
                <h3 className="text-lg font-semibold text-slate-800">Area Model for Binomials</h3>
                <p>To multiply two binomials like <strong>(x + a)(x + b)</strong>, we can use an area model.</p>
                <p>Imagine a rectangle with width <code>(x + a)</code> and height <code>(x + b)</code>. The total area is the sum of four smaller rectangles:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>x × x = x²</strong></li>
                  <li><strong>a × x = ax</strong></li>
                  <li><strong>x × b = bx</strong></li>
                  <li><strong>a × b = ab</strong></li>
                </ul>
                <p>Adding them up gives the expanded quadratic expression: <code>x² + (a+b)x + ab</code>.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-800">Algebraic Fractions in Optics</h3>
                <p>The thin lens equation relates the object distance <code>u</code>, image distance <code>v</code>, and focal length <code>f</code>:</p>
                <div className="bg-slate-100 p-3 rounded text-center font-mono text-lg my-2 border border-slate-200">
                  1/f = 1/u + 1/v
                </div>
                <p>To find the focal length <code>f</code>, we find the Lowest Common Multiple (LCM) or simply a common denominator for the algebraic fraction:</p>
                <div className="bg-slate-100 p-3 rounded text-center font-mono my-2 border border-slate-200">
                  1/f = (v + u) / (uv)
                </div>
                <p>Taking the reciprocal gives: <code>f = uv / (u + v)</code>. This demonstrates how algebraic manipulation solves physical equations.</p>
              </>
            )}
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col border border-slate-200">
          <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
            <Activity className="mr-2" /> Interactive Simulator
          </h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex-1 flex flex-col mb-4 min-h-[300px]">
            {mode === 'poly' ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <svg width="250" height="250" viewBox="0 0 250 250" className="drop-shadow-md">
                  <rect x="10" y="10" width={xVal*10} height={xVal*10} fill="#3b82f6" opacity="0.8" stroke="#1e40af" strokeWidth="2" />
                  <text x={10 + xVal*5} y={10 + xVal*5} fill="white" textAnchor="middle" dominantBaseline="middle" className="font-bold">x²</text>
                  
                  <rect x={10 + xVal*10} y="10" width={aVal*20} height={xVal*10} fill="#10b981" opacity="0.8" stroke="#047857" strokeWidth="2" />
                  <text x={10 + xVal*10 + aVal*10} y={10 + xVal*5} fill="white" textAnchor="middle" dominantBaseline="middle" className="font-bold">{aVal}x</text>

                  <rect x="10" y={10 + xVal*10} width={xVal*10} height={bVal*20} fill="#f59e0b" opacity="0.8" stroke="#b45309" strokeWidth="2" />
                  <text x={10 + xVal*5} y={10 + xVal*10 + bVal*10} fill="white" textAnchor="middle" dominantBaseline="middle" className="font-bold">{bVal}x</text>

                  <rect x={10 + xVal*10} y={10 + xVal*10} width={aVal*20} height={bVal*20} fill="#ef4444" opacity="0.8" stroke="#b91c1c" strokeWidth="2" />
                  <text x={10 + xVal*10 + aVal*10} y={10 + xVal*10 + bVal*10} fill="white" textAnchor="middle" dominantBaseline="middle" className="font-bold">{aVal*bVal}</text>
                </svg>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <svg width="100%" height="200" viewBox="0 0 300 200" className="bg-blue-50/50 rounded-lg border border-blue-100">
                  <line x1="0" y1="100" x2="300" y2="100" stroke="#94a3b8" strokeDasharray="4" />
                  <ellipse cx="150" cy="100" rx="5" ry="50" fill="#38bdf8" opacity="0.5" stroke="#0284c7" />
                  
                  <circle cx={150 - f*3} cy="100" r="3" fill="#ef4444" />
                  <text x={150 - f*3 - 5} y="115" fontSize="10" fill="#ef4444">F</text>
                  <circle cx={150 + f*3} cy="100" r="3" fill="#ef4444" />
                  <text x={150 + f*3 - 5} y="115" fontSize="10" fill="#ef4444">F</text>

                  <line x1={objX} y1="100" x2={objX} y2="60" stroke="#16a34a" strokeWidth="3" />
                  <polygon points={`${objX-4},60 ${objX+4},60 ${objX},52`} fill="#16a34a" />
                  <text x={objX - 10} y="45" fontSize="10" fill="#16a34a">Obj</text>

                  <line x1={imgX} y1="100" x2={imgX} y2={imgY} stroke="#eab308" strokeWidth="3" />
                  <polygon points={`${imgX-4},${imgY} ${imgX+4},${imgY} ${imgX},${imgY+8}`} fill="#eab308" />
                  <text x={imgX - 10} y={imgY + 20} fontSize="10" fill="#eab308">Img</text>

                  <path d={`M ${objX} 60 L 150 60 L ${imgX} ${imgY}`} stroke="#ef4444" fill="none" strokeWidth="1.5" opacity="0.7" />
                  <path d={`M ${objX} 60 L 150 100 L ${imgX} ${imgY}`} stroke="#3b82f6" fill="none" strokeWidth="1.5" opacity="0.7" />
                </svg>
                <div className="absolute top-2 right-2 bg-slate-50/80 p-2 rounded shadow-sm text-xs font-mono border border-slate-200">
                  f = {f.toFixed(2)} cm
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {mode === 'poly' ? (
              <>
                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-medium text-slate-700">Base x:</label>
                  <input type="range" min="3" max="10" value={xVal} onChange={(e) => setXVal(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                  <span className="w-8 text-right font-mono">{xVal}</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-medium text-slate-700">Value a:</label>
                  <input type="range" min="1" max="5" value={aVal} onChange={(e) => setAVal(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                  <span className="w-8 text-right font-mono">{aVal}</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-medium text-slate-700">Value b:</label>
                  <input type="range" min="1" max="5" value={bVal} onChange={(e) => setBVal(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                  <span className="w-8 text-right font-mono">{bVal}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-slate-700">Obj dist (u):</label>
                  <input type="range" min="10" max="40" value={uVal} onChange={(e) => setUVal(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                  <span className="w-12 text-right font-mono">{uVal}</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-slate-700">Img dist (v):</label>
                  <input type="range" min="10" max="40" value={vVal} onChange={(e) => setVVal(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                  <span className="w-12 text-right font-mono">{vVal}</span>
                </div>
              </>
            )}
            <button 
              onClick={handleRecord}
              className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition active:scale-95"
            >
              Record Data
            </button>
          </div>
        </div>

        {/* Column 3: Analysis */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col border border-slate-200">
          <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
            <TableIcon className="mr-2" /> Analysis & Data
          </h2>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mb-6 h-48 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Inputs</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {logs.length === 0 ? (
                  <tr><td colSpan={3} className="py-4 text-center text-slate-400">No data recorded</td></tr>
                ) : (
                  logs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-100 transition">
                      <td className="py-2">{log.mode}</td>
                      <td className="py-2">{log.input}</td>
                      <td className="py-2 font-semibold text-indigo-600">{log.res}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex-1 border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-800 mb-3">Knowledge Check</h3>
            
            {mode === 'poly' ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-700">
                  Expand: <code className="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">(x + {qPolyA})(x + {qPolyB})</code>
                </p>
                <div className="flex items-center gap-2">
                  <span>x² + </span>
                  <input 
                    type="number" 
                    value={ansPolyX} 
                    onChange={(e) => setAnsPolyX(e.target.value)}
                    className="w-16 border border-slate-300 rounded p-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span>x + </span>
                  <input 
                    type="number" 
                    value={ansPolyC} 
                    onChange={(e) => setAnsPolyC(e.target.value)}
                    className="w-16 border border-slate-300 rounded p-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button onClick={checkPoly} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition active:scale-95">
                    Verify
                  </button>
                  {statusPoly === true && <CheckCircle2 className="text-emerald-500" />}
                  {statusPoly === false && <XCircle className="text-red-500" />}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-700">
                  Given u = {qOpticsU} cm, v = {qOpticsV} cm. <br/>
                  Find focal length f (2 decimal places).
                </p>
                <div className="flex items-center gap-2">
                  <span>f = </span>
                  <input 
                    type="number" 
                    value={ansOpticsF} 
                    onChange={(e) => setAnsOpticsF(e.target.value)}
                    className="w-24 border border-slate-300 rounded p-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0.00"
                  />
                  <span>cm</span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button onClick={checkOptics} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition active:scale-95">
                    Verify
                  </button>
                  {statusOptics === true && <CheckCircle2 className="text-emerald-500" />}
                  {statusOptics === false && <XCircle className="text-red-500" />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
