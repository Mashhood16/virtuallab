import { useState, useRef } from 'react';
import { Info, Plus, Minus, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9Springs({ onExit }: { onExit?: () => void }) {
    const [numSprings, setNumSprings] = useState<number>(1);
    const [mass, setMass] = useState<number>(100);
    const [noise] = useState([Math.random()*0.04-0.02, Math.random()*0.04-0.02, Math.random()*0.04-0.02]);
    const svgRef = useRef<SVGSVGElement>(null);
    const [rulerY, setRulerY] = useState<number>(120);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [inputSprings, setInputSprings] = useState('');
    const [inputMass, setInputMass] = useState('');
    const [inputTopReading, setInputTopReading] = useState('');
    const [inputTotalExt, setInputTotalExt] = useState('');
    const [logs, setLogs] = useState<{ springs: number, mass: number, topReading: number, totalExt: number }[]>([]);

    const [userForce, setUserForce] = useState('');
    const [userK, setUserK] = useState('');
    const [assessmentResult1, setAssessmentResult1] = useState<'none' | 'correct' | 'incorrect'>('none');
    const [assessmentResult2, setAssessmentResult2] = useState<'none' | 'correct' | 'incorrect'>('none');

    // k = 100 N/m. 1 cm = 10 px. Stretch in px:
    const stretch = (mass / 1000) * 9.8 * 10;

    const handlePointerDown = () => setIsDragging(true);
    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging && svgRef.current) {
            const pt = svgRef.current.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
            setRulerY(Math.max(20, Math.min(480, svgP.y)));
        }
    };
    const handlePointerUp = () => setIsDragging(false);

    const handleAddLog = () => {
        if (inputSprings && inputMass && inputTopReading && inputTotalExt) {
            setLogs([...logs, {
                springs: parseInt(inputSprings),
                mass: parseFloat(inputMass),
                topReading: parseFloat(inputTopReading),
                totalExt: parseFloat(inputTotalExt)
            }]);
            setInputSprings('');
            setInputMass('');
            setInputTopReading('');
            setInputTotalExt('');
        }
    };

    const checkAnswers = () => {
        const f = parseFloat(userForce);
        const k = parseFloat(userK);
        setAssessmentResult1(Math.abs(f - 1.96) < 0.1 ? 'correct' : 'incorrect');
        setAssessmentResult2(Math.abs(k - 50) < 1 ? 'correct' : 'incorrect');
    };

    const renderBalances = () => {
        const balances = [];
        let currentY = 20;
        for (let i = 0; i < numSprings; i++) {
            balances.push(
                <g key={`bal-${i}`} transform={`translate(200, ${currentY})`}>
                    {/* Top Hook */}
                    <path d="M 0 0 L 0 10" stroke="#475569" strokeWidth="2" />
                    {/* Main Body */}
                    <rect x="-15" y="10" width="30" height="60" fill="#f8fafc" stroke="#64748b" strokeWidth="2" rx="4" />
                    {/* Scale markings */}
                    <line x1="-15" y1="20" x2="-10" y2="20" stroke="#94a3b8" />
                    <line x1="-15" y1="30" x2="-5" y2="30" stroke="#94a3b8" />
                    <line x1="-15" y1="40" x2="-10" y2="40" stroke="#94a3b8" />
                    <line x1="-15" y1="50" x2="-5" y2="50" stroke="#94a3b8" />
                    <line x1="-15" y1="60" x2="-10" y2="60" stroke="#94a3b8" />
                    {/* Reading */}
                    <text x="0" y="45" fontSize="10" textAnchor="middle" fill="#0f172a" fontWeight="bold">
                        {((mass / 1000 * 9.8) * (1 + noise[i])).toFixed(1)} N
                    </text>
                    {/* Inner Pull-out slider */}
                    <rect x="-5" y="70" width="10" height={20 + stretch} fill="#cbd5e1" stroke="#64748b" />
                    {/* Bottom hook */}
                    <path d={`M 0 ${90 + stretch} L 0 ${100 + stretch}`} stroke="#475569" strokeWidth="2" />
                </g>
            );
            currentY += 100 + stretch;
        }

        // Mass block
        balances.push(
            <g key="mass" transform={`translate(200, ${currentY})`}>
                <path d="M 0 0 C 10 10, -10 10, 0 20" stroke="#475569" strokeWidth="2" fill="none" />
                <rect x="-25" y="20" width="50" height="40" fill="#ef4444" rx="4" />
                <text x="0" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{mass}g</text>
            </g>
        );

        return balances;
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <div className="bg-slate-50 shadow-sm px-6 py-4 flex items-center justify-between border-b border-slate-200">
                <LabHeader onExit={onExit} title="Springs in Series Lab" subtitle="Observe forces and extensions when springs are connected sequentially." />
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-0">
                {/* Column 1: Setup */}
                <div className="bg-slate-50 rounded-xl shadow-sm p-5 overflow-y-auto border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-semibold text-slate-800">1. Setup & Theory</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                        When ideal (massless) spring balances are connected <strong>in series</strong>, the tension is the same throughout the chain. Thus, every spring reads the same force.
                        <br/><br/>
                        However, the total extension of the system is the <strong>sum</strong> of the extensions of each individual spring.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Number of Springs: {numSprings}</label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setNumSprings(Math.max(1, numSprings - 1))}
                                    className="p-2 bg-slate-100 rounded hover:bg-slate-200"
                                ><Minus className="w-4 h-4" /></button>
                                <button 
                                    onClick={() => setNumSprings(Math.min(3, numSprings + 1))}
                                    className="p-2 bg-slate-100 rounded hover:bg-slate-200"
                                ><Plus className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hanging Mass: {mass} g</label>
                            <input
                                type="range"
                                min="100" max="500" step="100"
                                value={mass}
                                onChange={(e) => setMass(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Column 2: Simulation */}
                <div className="bg-slate-50 rounded-xl shadow-sm p-5 overflow-y-auto border border-slate-200 flex flex-col items-center">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 w-full">2. Interactive Simulation</h2>
                    <svg 
                        ref={svgRef} 
                        viewBox="0 0 400 500" 
                        className="w-full max-w-sm h-auto bg-[#f8fafc] rounded border border-slate-200"
                        onPointerMove={handlePointerMove} 
                        onPointerUp={handlePointerUp} 
                        onPointerLeave={handlePointerUp}
                    >
                        {/* Top Support */}
                        <line x1="100" y1="20" x2="300" y2="20" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                        <rect x="170" y="0" width="60" height="20" fill="#94a3b8" />

                        {/* Ruler Base */}
                        <line x1="120" y1="20" x2="120" y2="480" stroke="#94a3b8" strokeWidth="2" />
                        {[0, 10, 20, 30, 40].map(cm => (
                            <g key={cm} transform={`translate(120, ${20 + cm * 10})`}>
                                <line x1="0" y1="0" x2="-10" y2="0" stroke="#94a3b8" strokeWidth="2" />
                                <text x="-15" y="4" fontSize="10" fill="#64748b" textAnchor="end">{cm} cm</text>
                            </g>
                        ))}

                        {/* Balances & Mass */}
                        {renderBalances()}

                        {/* Draggable Measuring Marker */}
                        <g transform={`translate(120, ${rulerY})`} onPointerDown={handlePointerDown} className="cursor-ns-resize">
                            <line x1="0" y1="0" x2="100" y2="0" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                            <polygon points="0,-6 0,6 10,0" fill="#ef4444" />
                            <rect x="-65" y="-12" width="50" height="24" fill="white" stroke="#ef4444" rx="4" />
                            <text x="-40" y="4" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ef4444">
                                {((rulerY - 20) / 10).toFixed(1)}
                            </text>
                        </g>
                    </svg>
                </div>

                {/* Column 3: Analysis */}
                <div className="bg-slate-50 rounded-xl shadow-sm p-5 overflow-y-auto border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">3. Data Logging & Assessment</h2>
                    
                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <input type="number" placeholder="Springs" value={inputSprings} onChange={(e) => setInputSprings(e.target.value)} className="p-2 border rounded text-sm"/>
                            <input type="number" placeholder="Mass (g)" value={inputMass} onChange={(e) => setInputMass(e.target.value)} className="p-2 border rounded text-sm"/>
                            <input type="number" placeholder="Top Reading (N)" value={inputTopReading} onChange={(e) => setInputTopReading(e.target.value)} className="p-2 border rounded text-sm"/>
                            <input type="number" placeholder="Total Ext (cm)" value={inputTotalExt} onChange={(e) => setInputTotalExt(e.target.value)} className="p-2 border rounded text-sm"/>
                        </div>
                        <button onClick={handleAddLog} className="w-full bg-emerald-600 text-white px-3 py-2 rounded text-sm hover:bg-emerald-700 mb-3">Record Trial</button>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-700">
                                    <tr>
                                        <th className="p-2 border">Springs</th>
                                        <th className="p-2 border">Mass(g)</th>
                                        <th className="p-2 border">Top(N)</th>
                                        <th className="p-2 border">Ext(cm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-slate-500">No data recorded.</td></tr>
                                    ) : (
                                        logs.map((log, i) => (
                                            <tr key={i}>
                                                <td className="p-2 border">{log.springs}</td>
                                                <td className="p-2 border">{log.mass}</td>
                                                <td className="p-2 border">{log.topReading}</td>
                                                <td className="p-2 border">{log.totalExt}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mt-auto">
                        <h3 className="font-semibold text-amber-900 mb-2">Knowledge Check</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm text-amber-800 mb-1">1. If 4 identical ideal springs hold a 200g mass, what does the top spring read (in N)?</label>
                            <input type="number" value={userForce} onChange={(e) => setUserForce(e.target.value)} className="w-full p-2 border rounded-md" />
                            {assessmentResult1 === 'correct' && <span className="text-emerald-600 text-xs flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1"/> Correct</span>}
                            {assessmentResult1 === 'incorrect' && <span className="text-red-600 text-xs flex items-center mt-1"><XCircle className="w-3 h-3 mr-1"/> Incorrect</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-amber-800 mb-1">2. What is the equivalent spring constant (N/m) of 2 springs in series if a single spring has k=100 N/m?</label>
                            <input type="number" value={userK} onChange={(e) => setUserK(e.target.value)} className="w-full p-2 border rounded-md" />
                            {assessmentResult2 === 'correct' && <span className="text-emerald-600 text-xs flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1"/> Correct</span>}
                            {assessmentResult2 === 'incorrect' && <span className="text-red-600 text-xs flex items-center mt-1"><XCircle className="w-3 h-3 mr-1"/> Incorrect</span>}
                        </div>

                        <button onClick={checkAnswers} className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">
                            Submit Answers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
