import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Activity, Play, CheckCircle, RefreshCw, Dna } from 'lucide-react';

export default function LabC12Biochemistry({ onExit }: { onExit?: () => void }) {
    const [activeTab, setActiveTab] = useState<'kinetics' | 'electrophoresis'>('kinetics');

    // Kinetics state
    const [substrate, setSubstrate] = useState<number>(50);
    const [inhibitor, setInhibitor] = useState<number>(0);
    const [inhType, setInhType] = useState<'None'|'Competitive'|'Non-competitive'>('None');

    const vmax = 100;
    const km = 20;
    const ki = 10;

    let appKm = km;
    let appVmax = vmax;
    if (inhType === 'Competitive') appKm = km * (1 + inhibitor / ki);
    if (inhType === 'Non-competitive') appVmax = vmax / (1 + inhibitor / ki);
    
    const currentV = (appVmax * substrate) / (appKm + substrate);

    const points = [];
    for(let s = 0; s <= 100; s += 2) {
        const v = (appVmax * s) / (appKm + s);
        points.push(`${s * 3},${200 - v * 2}`);
    }
    const pathD = `M ${points.join(' L ')}`;

    // Electrophoresis state
    const [pH, setPH] = useState<number>(7);
    const [runTime, setRunTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isRunning) {
            timer = setInterval(() => {
                setRunTime(prev => {
                    if (prev >= 100) {
                        setIsRunning(false);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 50);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const posA = 150 + (pH - 3.0) * runTime * 0.5;
    const posB = 150 + (pH - 6.0) * runTime * 0.5;
    const posC = 150 + (pH - 9.7) * runTime * 0.5;

    // Assessment
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [score, setScore] = useState<number | null>(null);

    const checkAnswers = () => {
        let s = 0;
        if (q1.trim() === '40') s++;
        if (q2.trim() === '6' || q2.trim() === '6.0') s++;
        setScore(s);
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Biochemistry: Kinetics & Electrophoresis</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Dna size={20} className="text-pink-400" />
                    <span className="font-medium text-slate-300">Grade 12 Biology/Chem</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
                {/* Theory */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 overflow-y-auto">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen size={20} className="text-pink-600" />
                        Biochemical Concepts
                    </h2>
                    
                    <div className="prose prose-sm text-slate-600">
                        <h3 className="text-md font-semibold text-slate-700">Enzyme Inhibition</h3>
                        <p>
                            <strong>Competitive inhibitors</strong> bind to the enzyme's active site, competing with the substrate. This increases the apparent Michaelis constant (Km) but Vmax remains unchanged because high substrate concentrations can outcompete the inhibitor.
                        </p>
                        <p>
                            <strong>Non-competitive inhibitors</strong> bind to an allosteric site, altering the enzyme's structure. This decreases Vmax because functional enzymes are removed from the pool, but Km remains unchanged as the active site's affinity isn't affected.
                        </p>

                        <h3 className="text-md font-semibold text-slate-700 mt-4">Gel Electrophoresis</h3>
                        <p>
                            Amino acids possess an isoelectric point (pI) where they carry no net electrical charge. In a buffer solution, if pH &lt; pI, the amino acid is protonated (positive) and migrates to the cathode (-). If pH &gt; pI, it is deprotonated (negative) and migrates to the anode (+). At pH = pI, it remains stationary.
                        </p>
                    </div>
                </div>

                {/* Simulation */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                        <button 
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'kinetics' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('kinetics')}
                        >
                            Enzyme Kinetics
                        </button>
                        <button 
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'electrophoresis' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('electrophoresis')}
                        >
                            Electrophoresis
                        </button>
                    </div>

                    {activeTab === 'kinetics' ? (
                        <div className="flex flex-col gap-4 flex-1">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 relative h-48">
                                <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
                                    {/* Axes */}
                                    <line x1="0" y1="200" x2="300" y2="200" stroke="#94a3b8" strokeWidth="2" />
                                    <line x1="0" y1="0" x2="0" y2="200" stroke="#94a3b8" strokeWidth="2" />
                                    <text x="140" y="215" fontSize="10" fill="#64748b">[Substrate]</text>
                                    <text x="-120" y="-10" fontSize="10" fill="#64748b" transform="rotate(-90)">Velocity (V)</text>
                                    
                                    {/* Vmax line */}
                                    <line x1="0" y1={200 - appVmax*2} x2="300" y2={200 - appVmax*2} stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" />
                                    <text x="305" y={200 - appVmax*2 + 4} fontSize="10" fill="#94a3b8">Vmax</text>

                                    {/* Curve */}
                                    <path d={pathD} fill="none" stroke="#ec4899" strokeWidth="3" />
                                    
                                    {/* Current Point */}
                                    <circle cx={substrate * 3} cy={200 - currentV * 2} r="5" fill="#1e293b" />
                                </svg>
                                <div className="absolute top-2 left-10 text-xs font-mono bg-white px-2 py-1 border rounded shadow-sm">
                                    V = {currentV.toFixed(1)} µM/s
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 flex justify-between">
                                        <span>[Substrate]</span> <span>{substrate} mM</span>
                                    </label>
                                    <input type="range" min="0" max="100" value={substrate} onChange={e => setSubstrate(Number(e.target.value))} className="w-full accent-pink-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 flex justify-between">
                                        <span>[Inhibitor]</span> <span>{inhibitor} mM</span>
                                    </label>
                                    <input type="range" min="0" max="50" value={inhibitor} onChange={e => setInhibitor(Number(e.target.value))} className="w-full accent-slate-500" />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {['None', 'Competitive', 'Non-competitive'].map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setInhType(t as any)}
                                            className={`px-2 py-1 text-xs rounded border ${inhType === t ? 'bg-pink-100 border-pink-400 text-pink-800' : 'bg-white border-slate-300 text-slate-600'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 flex-1">
                            <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 relative h-48 flex items-center justify-center">
                                <div className="absolute top-2 left-4 font-bold text-red-500">Anode (+)</div>
                                <div className="absolute top-2 right-4 font-bold text-blue-500">Cathode (-)</div>
                                
                                <svg viewBox="0 0 300 100" className="w-full h-full bg-slate-200 rounded drop-shadow-inner">
                                    <line x1="150" y1="0" x2="150" y2="100" stroke="#cbd5e1" strokeDasharray="4" />
                                    
                                    {/* AA A */}
                                    <rect x={posA - 4} y="15" width="8" height="20" fill="#3b82f6" rx="2" />
                                    <text x={posA} y="45" fontSize="10" textAnchor="middle" fill="#1e3a8a">pI=3</text>

                                    {/* AA B */}
                                    <rect x={posB - 4} y="50" width="8" height="20" fill="#10b981" rx="2" />
                                    <text x={posB} y="80" fontSize="10" textAnchor="middle" fill="#064e3b">pI=6</text>

                                    {/* AA C */}
                                    <rect x={posC - 4} y="85" width="8" height="10" fill="#f59e0b" rx="2" />
                                    <text x={posC} y="98" fontSize="10" textAnchor="middle" fill="#78350f">pI=9.7</text>
                                </svg>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 flex justify-between">
                                        <span>Buffer pH</span> <span>{pH.toFixed(1)}</span>
                                    </label>
                                    <input type="range" min="1" max="14" step="0.5" value={pH} onChange={e => {setPH(Number(e.target.value)); setRunTime(0);}} className="w-full accent-blue-500" disabled={isRunning} />
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsRunning(true)}
                                        disabled={isRunning || runTime >= 100}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded font-medium flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <Play size={16} /> Run Gel
                                    </button>
                                    <button 
                                        onClick={() => {setIsRunning(false); setRunTime(0);}}
                                        className="py-2 px-4 bg-slate-300 text-slate-700 rounded font-medium hover:bg-slate-400"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Assessment */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" />
                        Computational Analysis
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                1. Given Km = 20 mM and Ki = 10 mM. What is the apparent Km when [Inhibitor] = 10 mM for a competitive inhibitor?
                            </label>
                            <input 
                                type="number" 
                                value={q1} 
                                onChange={(e) => setQ1(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter value in mM"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                2. At what exact pH will Amino Acid B (pI = 6.0) not migrate in the electric field?
                            </label>
                            <input 
                                type="number" 
                                value={q2} 
                                onChange={(e) => setQ2(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter pH"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button 
                            onClick={checkAnswers}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} /> Verify Results
                        </button>

                        {score !== null && (
                            <div className={`mt-4 p-3 rounded-md text-center font-bold ${score === 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                Score: {score} / 2 {score === 2 ? '🎉 Excellent!' : '❌ Review theory and retry.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
