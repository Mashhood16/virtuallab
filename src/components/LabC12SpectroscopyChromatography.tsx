import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Layers, Activity, CheckCircle, Play, RefreshCw, Microscope } from 'lucide-react';

export default function LabC12SpectroscopyChromatography({ onExit }: { onExit?: () => void }) {
    const [sample, setSample] = useState<'Ethanol' | 'Acetone'>('Ethanol');
    const [tab, setTab] = useState<'IR' | 'NMR' | 'MS' | 'TLC'>('IR');
    
    // TLC State
    const [solventPolarity, setSolventPolarity] = useState<number>(50);
    const [tlcRunTime, setTlcRunTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isRunning) {
            timer = setInterval(() => {
                setTlcRunTime(prev => {
                    if (prev >= 100) {
                        setIsRunning(false);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const runTLC = () => {
        setTlcRunTime(0);
        setIsRunning(true);
    };

    const resetTLC = () => {
        setTlcRunTime(0);
        setIsRunning(false);
    };

    const rfEthanol = Math.min(0.95, solventPolarity / 120);
    const rfAcetone = Math.min(0.95, solventPolarity / 70);

    const yEthanol = 180 - (160 * rfEthanol * (tlcRunTime / 100));
    const yAcetone = 180 - (160 * rfAcetone * (tlcRunTime / 100));

    // Spectra paths and data
    const ethanolIR = "M 0 10 L 40 10 Q 70 120 90 10 L 105 10 L 110 90 L 115 10 L 285 10 L 295 60 L 305 10 L 350 10";
    const acetoneIR = "M 0 10 L 105 10 L 110 90 L 115 10 L 220 10 L 228 140 L 235 10 L 350 10";

    const nmrPeaks = {
        Ethanol: [
            { x: (10-3.6)*35, h: 40, label: 'Quartet (2H)', ppm: '3.6' },
            { x: (10-2.6)*35, h: 20, label: 'Singlet (1H)', ppm: '2.6' },
            { x: (10-1.2)*35, h: 60, label: 'Triplet (3H)', ppm: '1.2' }
        ],
        Acetone: [
            { x: (10-2.1)*35, h: 100, label: 'Singlet (6H)', ppm: '2.1' }
        ]
    };

    const msPeaks = {
        Ethanol: [
            { mz: 15, h: 20 }, { mz: 31, h: 100 }, { mz: 45, h: 40 }, { mz: 46, h: 30 }
        ],
        Acetone: [
            { mz: 15, h: 30 }, { mz: 43, h: 100 }, { mz: 58, h: 50 }
        ]
    };

    // Assessment
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [score, setScore] = useState<number | null>(null);

    const checkAnswers = () => {
        let s = 0;
        if (q1.trim().toLowerCase() === 'ethanol') s++;
        if (q2.trim() === '43') s++;
        setScore(s);
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Analytical Chemistry: Spectrometry & Chromatography</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Microscope size={20} className="text-yellow-400" />
                    <span className="font-medium text-slate-300">Grade 12 Chemistry</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
                {/* Theory */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 overflow-y-auto">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen size={20} className="text-yellow-600" />
                        Analytical Theory
                    </h2>
                    
                    <div className="prose prose-sm text-slate-600">
                        <h3 className="text-md font-semibold text-slate-700">IR Spectroscopy</h3>
                        <p>Identifies functional groups. O-H bonds show a broad peak ~3300 cm⁻¹. C=O bonds show a sharp, strong peak ~1715 cm⁻¹. C-H bonds show sharp peaks ~2900 cm⁻¹.</p>

                        <h3 className="text-md font-semibold text-slate-700 mt-2">1H NMR</h3>
                        <p>Identifies hydrogen environments. Splitting (n+1 rule) indicates neighboring protons. Chemical shift (ppm) indicates shielding (e.g., closer to O is more deshielded/higher ppm).</p>

                        <h3 className="text-md font-semibold text-slate-700 mt-2">Mass Spectrometry (MS)</h3>
                        <p>Determines molecular weight (M+ peak) and structure via fragmentation. The base peak (tallest) represents the most stable fragment ion.</p>

                        <h3 className="text-md font-semibold text-slate-700 mt-2">Thin Layer Chromatography (TLC)</h3>
                        <p>Separates compounds by polarity. A polar stationary phase (silica) holds back polar compounds. Using a more polar solvent increases the Rf (Retention factor) of all compounds.</p>
                    </div>
                </div>

                {/* Simulation */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={20} className="text-indigo-600" />
                            Instrument Panel
                        </h2>
                        <select 
                            value={sample} 
                            onChange={(e) => {setSample(e.target.value as any); resetTLC();}}
                            className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm rounded p-1 font-medium"
                        >
                            <option value="Ethanol">Sample A (Unknown)</option>
                            <option value="Acetone">Sample B (Unknown)</option>
                        </select>
                    </div>

                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                        {['IR', 'NMR', 'MS', 'TLC'].map(t => (
                            <button 
                                key={t}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === t ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setTab(t as any)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 relative min-h-[250px] flex items-center justify-center">
                        {tab === 'IR' && (
                            <svg viewBox="0 0 350 150" className="w-full h-full">
                                <line x1="0" y1="10" x2="350" y2="10" stroke="#cbd5e1" strokeDasharray="2" />
                                <text x="5" y="140" fontSize="10" fill="#94a3b8">4000 cm⁻¹</text>
                                <text x="310" y="140" fontSize="10" fill="#94a3b8">500 cm⁻¹</text>
                                <path d={sample === 'Ethanol' ? ethanolIR : acetoneIR} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        )}
                        {tab === 'NMR' && (
                            <svg viewBox="0 0 350 150" className="w-full h-full">
                                <line x1="0" y1="130" x2="350" y2="130" stroke="#94a3b8" strokeWidth="2" />
                                <text x="5" y="145" fontSize="10" fill="#94a3b8">10 ppm</text>
                                <text x="330" y="145" fontSize="10" fill="#94a3b8">0 ppm</text>
                                {nmrPeaks[sample].map((peak, i) => (
                                    <g key={i}>
                                        <line x1={peak.x} y1={130} x2={peak.x} y2={130 - peak.h} stroke="#0ea5e9" strokeWidth="2" />
                                        <text x={peak.x} y={130 - peak.h - 5} fontSize="9" textAnchor="middle" fill="#0284c7">{peak.label}</text>
                                        <text x={peak.x} y={145} fontSize="8" textAnchor="middle" fill="#64748b">{peak.ppm}</text>
                                    </g>
                                ))}
                            </svg>
                        )}
                        {tab === 'MS' && (
                            <svg viewBox="0 0 350 150" className="w-full h-full">
                                <line x1="0" y1="130" x2="350" y2="130" stroke="#94a3b8" strokeWidth="2" />
                                <text x="170" y="145" fontSize="10" fill="#94a3b8">m/z</text>
                                {msPeaks[sample].map((peak, i) => (
                                    <g key={i}>
                                        <line x1={peak.mz * 3.5} y1={130} x2={peak.mz * 3.5} y2={130 - peak.h} stroke="#ef4444" strokeWidth="3" />
                                        <text x={peak.mz * 3.5} y={130 - peak.h - 5} fontSize="9" textAnchor="middle" fill="#b91c1c">{peak.mz}</text>
                                    </g>
                                ))}
                            </svg>
                        )}
                        {tab === 'TLC' && (
                            <div className="w-full h-full flex items-center justify-around">
                                <div className="flex flex-col items-center gap-2 w-1/2">
                                    <label className="text-xs font-semibold text-slate-600">Solvent Polarity</label>
                                    <input 
                                        type="range" min="0" max="100" 
                                        value={solventPolarity} 
                                        onChange={(e) => {setSolventPolarity(Number(e.target.value)); resetTLC();}}
                                        disabled={isRunning}
                                        className="w-full accent-indigo-500"
                                    />
                                    <div className="flex gap-2 w-full mt-2">
                                        <button onClick={runTLC} disabled={isRunning} className="flex-1 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 disabled:opacity-50"><Play size={14} className="inline"/> Run</button>
                                        <button onClick={resetTLC} className="px-2 py-1 bg-slate-300 rounded text-xs hover:bg-slate-400"><RefreshCw size={14}/></button>
                                    </div>
                                </div>

                                <div className="w-32 h-48 bg-white border-2 border-slate-300 rounded shadow-inner relative flex justify-around items-end pb-5">
                                    {/* Solvent Front */}
                                    <div className="absolute w-full border-t-2 border-indigo-200" style={{bottom: `${20 + 160*(tlcRunTime/100)}px`}}></div>
                                    <div className="absolute bottom-5 w-full border-t border-slate-300 border-dashed"></div>
                                    
                                    {/* Spots */}
                                    {sample === 'Ethanol' ? (
                                        <div className="w-3 h-3 rounded-full bg-blue-500 opacity-80 absolute" style={{left: '40%', bottom: `${yEthanol}px`}}></div>
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80 absolute" style={{left: '40%', bottom: `${yAcetone}px`}}></div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Assessment */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Layers size={20} className="text-emerald-600" />
                        Structure Elucidation
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                1. Based on the IR broad peak at 3300 cm⁻¹ and the MS base peak at m/z=31, identify Sample A. (Ethanol or Acetone?)
                            </label>
                            <input 
                                type="text" 
                                value={q1} 
                                onChange={(e) => setQ1(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter compound name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                2. For Sample B, the 1H NMR shows a single peak (singlet). What is the m/z value of the base peak in its Mass Spectrum?
                            </label>
                            <input 
                                type="number" 
                                value={q2} 
                                onChange={(e) => setQ2(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter m/z value"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button 
                            onClick={checkAnswers}
                            className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} /> Verify Results
                        </button>

                        {score !== null && (
                            <div className={`mt-4 p-3 rounded-md text-center font-bold ${score === 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                Score: {score} / 2 {score === 2 ? '🎉 Excellent!' : '❌ Review data and retry.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
