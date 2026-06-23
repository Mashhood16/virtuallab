import { useState, useEffect } from 'react';
import { ArrowLeft, Beaker, BookOpen, CheckCircle, Thermometer, FlaskConical, RefreshCw, Layers } from 'lucide-react';

export default function LabC12OrganicSynthesis({ onExit }: { onExit?: () => void }) {
    const [flaskContents, setFlaskContents] = useState<string[]>([]);
    const [temperature, setTemperature] = useState<number>(20);
    const [isDecomposed, setIsDecomposed] = useState<boolean>(false);
    const [flaskColor, setFlaskColor] = useState<string>('#e2e8f0');
    const [reactionStatus, setReactionStatus] = useState<string>('Empty Flask');

    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [score, setScore] = useState<number | null>(null);

    const reagents = ['Aniline', 'NaNO2 + HCl', '2-Naphthol', 'Phthalic Anhydride', 'L-Glutamine', 'Chiral Catalyst'];

    const addReagent = (r: string) => {
        if (!flaskContents.includes(r)) {
            setFlaskContents([...flaskContents, r]);
        }
    };

    const resetFlask = () => {
        setFlaskContents([]);
        setTemperature(20);
        setIsDecomposed(false);
    };

    useEffect(() => {
        let newColor = '#e2e8f0';
        let newStatus = 'Mixed Reagents';

        if (flaskContents.length === 0) {
            newColor = '#f8fafc';
            newStatus = 'Empty Flask';
        } else if (flaskContents.includes('Aniline') && flaskContents.includes('NaNO2 + HCl')) {
            if (temperature > 10 || isDecomposed) {
                if (!isDecomposed) setIsDecomposed(true);
                newColor = '#78350f'; // brown
                newStatus = 'Diazonium Salt Decomposed (Phenol + N2 gas)';
            } else {
                if (flaskContents.includes('2-Naphthol')) {
                    newColor = '#ea580c'; // bright orange
                    newStatus = 'Azo Dye (Orange II) Formed!';
                } else {
                    newColor = '#fef08a'; // pale yellow
                    newStatus = 'Diazonium Salt Formed (Stable < 10°C)';
                }
            }
        } else if (flaskContents.includes('Phthalic Anhydride') && flaskContents.includes('L-Glutamine')) {
            if (temperature >= 80) {
                if (flaskContents.includes('Chiral Catalyst')) {
                    newColor = '#86efac';
                    newStatus = 'Asymmetric Synthesis: (S)-Thalidomide (95% ee)';
                } else {
                    newColor = '#cbd5e1';
                    newStatus = 'Racemic Thalidomide Formed (50% R, 50% S)';
                }
            } else {
                newColor = '#ffffff';
                newStatus = 'Temperature too low for condensation';
            }
        } else {
            newColor = '#bae6fd';
        }
        
        setFlaskColor(newColor);
        setReactionStatus(newStatus);
    }, [flaskContents, temperature, isDecomposed]);

    const checkAnswers = () => {
        let s = 0;
        if (q1.trim() === '5' || q1.trim() === '0' || q1.trim() === '10') s++; 
        if (q2.trim() === '80') s++;
        setScore(s);
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Organic Synthesis & Asymmetric Catalysis</h1>
                </div>
                <div className="flex items-center gap-2">
                    <FlaskConical size={20} className="text-blue-400" />
                    <span className="font-medium text-slate-300">Grade 12 Chemistry</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
                {/* Theory Column */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" />
                        Reaction Theory
                    </h2>
                    
                    <div className="prose prose-sm text-slate-600">
                        <h3 className="text-md font-semibold text-slate-700">Azo Dye Synthesis</h3>
                        <p>
                            Azo dyes are manufactured via a two-step process: <strong>Diazotization</strong> and <strong>Coupling</strong>. 
                            First, a primary aromatic amine (e.g., Aniline) is reacted with nitrous acid (NaNO2 + HCl) at cold temperatures (0-5°C) to form a diazonium salt. 
                            If the temperature exceeds 10°C, the unstable diazonium salt decomposes into a phenol, releasing nitrogen gas.
                            Coupling with a phenol like 2-Naphthol then yields the brightly colored Azo Dye.
                        </p>

                        <h3 className="text-md font-semibold text-slate-700 mt-4">Asymmetric Synthesis (Thalidomide)</h3>
                        <p>
                            Thalidomide possesses a chiral center, existing as (R) and (S) enantiomers. Historically, it was administered as a racemic mixture, leading to tragic teratogenic effects caused by the (S)-isomer, while the (R)-isomer was therapeutic. 
                            Modern asymmetric synthesis employs chiral catalysts to direct the formation of a single desired enantiomer, achieving a high <strong>enantiomeric excess (ee)</strong>.
                        </p>
                    </div>
                </div>

                {/* Simulation Column */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Beaker size={20} className="text-purple-600" />
                        Synthesis Workspace
                    </h2>

                    <div className="flex-1 bg-slate-100 rounded-lg p-4 flex flex-col items-center justify-center relative border border-slate-300">
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-md text-sm font-mono shadow-sm border border-slate-200">
                            Temp: {temperature}°C
                        </div>
                        
                        <svg viewBox="0 0 100 120" className="w-48 h-48 drop-shadow-md">
                            {/* Flask Background */}
                            <path d="M 40 10 L 60 10 L 60 40 L 85 90 L 85 110 L 15 110 L 15 90 L 40 40 Z" fill="rgba(255,255,255,0.8)" stroke="#cbd5e1" strokeWidth="2" />
                            {/* Liquid */}
                            {flaskContents.length > 0 && (
                                <path d="M 33 55 L 67 55 L 83 108 L 17 108 Z" fill={flaskColor} className="transition-colors duration-500" />
                            )}
                            {/* Bubbles if decomposed */}
                            {isDecomposed && (
                                <>
                                    <circle cx="45" cy="80" r="2" fill="#ffffff" opacity="0.8" />
                                    <circle cx="55" cy="95" r="3" fill="#ffffff" opacity="0.8" />
                                    <circle cx="35" cy="100" r="1.5" fill="#ffffff" opacity="0.8" />
                                    <circle cx="60" cy="70" r="2.5" fill="#ffffff" opacity="0.8" />
                                </>
                            )}
                            {/* Flask outline over liquid */}
                            <path d="M 40 10 L 60 10 L 60 40 L 85 90 L 85 110 L 15 110 L 15 90 L 40 40 Z" fill="none" stroke="#64748b" strokeWidth="2" />
                            {/* Rim */}
                            <ellipse cx="50" cy="10" rx="10" ry="2" fill="none" stroke="#64748b" strokeWidth="2" />
                        </svg>

                        <div className="mt-4 text-center font-semibold text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm w-full max-w-xs truncate">
                            {reactionStatus}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Thermometer size={18} className="text-red-500" />
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={temperature} 
                                onChange={(e) => setTemperature(Number(e.target.value))}
                                className="flex-1 accent-red-500"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {reagents.map(r => (
                                <button 
                                    key={r}
                                    onClick={() => addReagent(r)}
                                    disabled={flaskContents.includes(r)}
                                    className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    + {r}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={resetFlask}
                            className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                        >
                            <RefreshCw size={16} /> Wash Flask
                        </button>
                    </div>
                </div>

                {/* Assessment Column */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Layers size={20} className="text-emerald-600" />
                        Data Analysis
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                1. What is the maximum safe temperature (°C) to maintain the diazonium intermediate before it decomposes?
                            </label>
                            <input 
                                type="number" 
                                value={q1} 
                                onChange={(e) => setQ1(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                placeholder="Enter value in °C"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                2. In an asymmetric synthesis, you obtain a mixture of 90% (S)-Thalidomide and 10% (R)-Thalidomide. Calculate the Enantiomeric Excess (% ee).
                            </label>
                            <div className="text-xs text-slate-500 mb-1">Hint: %ee = |%R - %S|</div>
                            <input 
                                type="number" 
                                value={q2} 
                                onChange={(e) => setQ2(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                placeholder="Enter % ee"
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
                                Score: {score} / 2 {score === 2 ? '🎉 Excellent!' : '❌ Review theory and retry.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
