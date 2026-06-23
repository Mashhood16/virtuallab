import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Navigation } from 'lucide-react';

export default function LabM11Vectors({ onExit }: { onExit?: () => void }) {
  // Airplane Vector (Va)
  const [speedA, setSpeedA] = useState<number>(200);
  const [angleA, setAngleA] = useState<number>(90); // default East
  
  // Wind Vector (Vw)
  const [speedW, setSpeedW] = useState<number>(50);
  const [angleW, setAngleW] = useState<number>(0);  // default North

  const toRad = (deg: number) => deg * Math.PI / 180;
  
  // Convert to cartesian for plotting (Standard mathematical angles where 0 is East, 90 is North)
  // Math: x = speed * sin(bearing), y = speed * cos(bearing)
  const ax = speedA * Math.sin(toRad(angleA));
  const ay = speedA * Math.cos(toRad(angleA));
  
  const wx = speedW * Math.sin(toRad(angleW));
  const wy = speedW * Math.cos(toRad(angleW));

  // Resultant Vector
  const rx = ax + wx;
  const ry = ay + wy;
  const resSpeed = Math.sqrt(rx*rx + ry*ry);
  let resAngle = Math.atan2(rx, ry) * 180 / Math.PI;
  if (resAngle < 0) resAngle += 360;

  // Assessments
  const [ansSpeed, setAnsSpeed] = useState("");
  const [ansSpeedStatus, setAnsSpeedStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  const [ansDot, setAnsDot] = useState("");
  const [ansDotStatus, setAnsDotStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  const checkSpeed = () => {
    if (Math.abs(parseFloat(ansSpeed) - resSpeed) < 2) {
      setAnsSpeedStatus("correct");
    } else {
      setAnsSpeedStatus("incorrect");
    }
  };

  const checkDot = () => {
    // Dot product of Va and Vw
    const expectedDot = ax * wx + ay * wy;
    if (Math.abs(parseFloat(ansDot) - expectedDot) < 10) {
      setAnsDotStatus("correct");
    } else {
      setAnsDotStatus("incorrect");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-teal-600 text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="hover:bg-teal-700 p-2 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold">Vector Aviation & Operations</h1>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* LEFT: Theory */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-4 overflow-y-auto border-t-4 border-teal-500">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Navigation size={20} /> Vector Components</h2>
          <p className="text-gray-600 text-sm">
            In aviation, a plane's true velocity is the vector sum of its intended heading velocity (<b>Va</b>) and the wind velocity (<b>Vw</b>).
          </p>
          <p className="font-mono text-center text-sm text-teal-800 bg-teal-50 p-2 rounded">
            {"$$ \\vec{V}_r = \\vec{V}_a + \\vec{V}_w $$"}
          </p>

          <div className="mt-4 space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-1">Plane Velocity (Va)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed: {speedA} km/h</label>
              <input type="range" min="100" max="500" step="10" value={speedA} onChange={(e) => setSpeedA(parseFloat(e.target.value))} className="w-full accent-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading: {angleA}° (0=N, 90=E)</label>
              <input type="range" min="0" max="360" step="5" value={angleA} onChange={(e) => setAngleA(parseFloat(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <h3 className="font-bold text-gray-800 border-b pb-1 mt-6">Wind Velocity (Vw)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed: {speedW} km/h</label>
              <input type="range" min="0" max="150" step="5" value={speedW} onChange={(e) => setSpeedW(parseFloat(e.target.value))} className="w-full accent-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blowing Towards: {angleW}°</label>
              <input type="range" min="0" max="360" step="5" value={angleW} onChange={(e) => setAngleW(parseFloat(e.target.value))} className="w-full accent-gray-500" />
            </div>
          </div>
        </div>

        {/* MIDDLE: Simulator */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center border-t-4 border-cyan-500 relative overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 absolute top-4 left-6">Radar Display</h2>
          
          {/* Compass rose background */}
          <div className="absolute opacity-10 pointer-events-none" style={{width: 300, height: 300}}>
             <svg viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="1" />
               <line x1="50" y1="5" x2="50" y2="95" stroke="black" strokeWidth="0.5" />
               <line x1="5" y1="50" x2="95" y2="50" stroke="black" strokeWidth="0.5" />
               <text x="48" y="12" fontSize="5">N</text>
               <text x="88" y="52" fontSize="5">E</text>
               <text x="48" y="92" fontSize="5">S</text>
               <text x="8" y="52" fontSize="5">W</text>
             </svg>
          </div>

          <svg viewBox="-300 -300 600 600" className="w-full h-80 max-w-md mt-6">
            <defs>
              <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
              </marker>
              <marker id="arrowhead-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
              <marker id="arrowhead-teal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#0d9488" />
              </marker>
            </defs>

            {/* Plane Vector (Blue) */}
            <line x1="0" y1="0" x2={ax} y2={-ay} stroke="#2563eb" strokeWidth="4" markerEnd="url(#arrowhead-blue)" />
            
            {/* Wind Vector added to tip of Plane Vector (Gray) */}
            <line x1={ax} y1={-ay} x2={rx} y2={-ry} stroke="#6b7280" strokeWidth="4" markerEnd="url(#arrowhead-gray)" strokeDasharray="5,5" />
            
            {/* Origin Wind Vector (Gray) - just for visualization */}
            <line x1="0" y1="0" x2={wx} y2={-wy} stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead-gray)" opacity="0.3" />

            {/* Resultant Vector (Teal) */}
            <line x1="0" y1="0" x2={rx} y2={-ry} stroke="#0d9488" strokeWidth="5" markerEnd="url(#arrowhead-teal)" />
            
            <circle cx="0" cy="0" r="5" fill="#ef4444" />
          </svg>

          <div className="mt-6 flex flex-col items-center text-sm gap-2 w-full px-8">
            <div className="flex justify-between w-full">
              <span className="text-blue-600 font-bold">Plane: {speedA} km/h @ {angleA}°</span>
              <span className="text-gray-600 font-bold">Wind: {speedW} km/h @ {angleW}°</span>
            </div>
            <div className="bg-teal-50 w-full text-center p-2 rounded text-teal-800 font-bold border border-teal-200">
               Resultant: {resSpeed.toFixed(1)} km/h @ {resAngle.toFixed(1)}°
            </div>
          </div>
        </div>

        {/* RIGHT: Assessment */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-4 border-t-4 border-emerald-500">
          <h2 className="text-xl font-bold text-gray-800">Flight Analysis</h2>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-800 mb-2">1. Resultant Speed</p>
            <p className="text-xs text-gray-600 mb-3">
              Calculate the resultant speed {"$$ |\\vec{V}_r| $$"} using the law of cosines or components.
            </p>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                className="flex-1 p-2 border rounded text-sm" 
                placeholder="Speed (km/h)..."
                value={ansSpeed}
                onChange={(e) => { setAnsSpeed(e.target.value); setAnsSpeedStatus("idle"); }}
              />
              <button onClick={checkSpeed} className="bg-emerald-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-emerald-700">Check</button>
            </div>
            {ansSpeedStatus === "correct" && <p className="text-emerald-600 text-xs mt-2 flex items-center gap-1"><CheckCircle size={14} /> Spot on!</p>}
            {ansSpeedStatus === "incorrect" && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><XCircle size={14} /> Incorrect. Try components.</p>}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-800 mb-2">2. Dot Product (Work Analogy)</p>
            <p className="text-xs text-gray-600 mb-3">
              Calculate the dot product {"$$ \\vec{V}_a \\cdot \\vec{V}_w $$"}.
              <br/>
              (Formula: {"$$ x_a x_w + y_a y_w $$"} or {"$$ |V_a||V_w|\\cos(\\theta) $$"})
            </p>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                className="flex-1 p-2 border rounded text-sm" 
                placeholder="Dot product..."
                value={ansDot}
                onChange={(e) => { setAnsDot(e.target.value); setAnsDotStatus("idle"); }}
              />
              <button onClick={checkDot} className="bg-emerald-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-emerald-700">Check</button>
            </div>
            {ansDotStatus === "correct" && <p className="text-emerald-600 text-xs mt-2 flex items-center gap-1"><CheckCircle size={14} /> Correct calculation!</p>}
            {ansDotStatus === "incorrect" && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><XCircle size={14} /> Check your math.</p>}
          </div>

        </div>
      </main>
    </div>
  );
}
