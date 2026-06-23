import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calculator, BookOpen, Ruler, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface TrigProblem {
    distance: number;
    angle: number;
    eyeHeight: number;
    correctHeight: number;
}

export default function LabM10TrigApplications({ onExit }: { onExit: () => void }) {
    const [distance, setDistance] = useState<number>(50); // meters
    const [angle, setAngle] = useState<number>(45); // degrees
    const eyeHeight = 1.6; // meters

    const [problem, setProblem] = useState<TrigProblem | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [feedback, setFeedback] = useState<string | null>(null);

    const generateProblem = useCallback(() => {
        const d = Math.floor(Math.random() * 100) + 20;
        const a = Math.floor(Math.random() * 60) + 10;
        const h = eyeHeight + d * Math.tan((a * Math.PI) / 180);
        setProblem({ distance: d, angle: a, eyeHeight, correctHeight: Number(h.toFixed(1)) });
        setUserAnswer('');
        setFeedback(null);
    }, []);

    useEffect(() => {
        generateProblem();
    }, [generateProblem]);

    const checkAnswer = () => {
        if (!problem) return;
        const numAnswer = parseFloat(userAnswer);
        if (isNaN(numAnswer)) {
            setFeedback("Please enter a valid number.");
            return;
        }
        if (Math.abs(numAnswer - problem.correctHeight) <= 0.5) {
            setFeedback("Correct! Excellent work using trigonometry.");
        } else {
            setFeedback(`Incorrect. Try again. (Hint: use tan(${problem.angle}°) * ${problem.distance} + ${problem.eyeHeight})`);
        }
    };

    const calculatedHeight = eyeHeight + distance * Math.tan((angle * Math.PI) / 180);

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            {/* Header */}
            <div className="bg-indigo-800 text-white p-4 flex items-center shadow-md shrink-0">
                <button onClick={onExit} className="mr-4 hover:bg-indigo-700 p-2 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Trigonometry Applications</h1>
                    <p className="text-sm text-indigo-200">Measuring Inaccessible Heights (e.g. Skyscrapers)</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
                {/* Column 1: Theory */}
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col overflow-y-auto border-t-4 border-indigo-500">
                    <div className="flex items-center mb-4 text-indigo-800 shrink-0">
                        <BookOpen className="mr-2" size={24} />
                        <h2 className="text-xl font-semibold">Theory & Context</h2>
                    </div>
                    <div className="prose prose-indigo flex-1 text-slate-700">
                        <p>
                            Trigonometry allows us to calculate distances and heights that are difficult or impossible to measure directly, such as the height of the <strong>Burj Khalifa</strong> or an aviation sightline.
                        </p>
                        <h3 className="text-lg font-bold mt-4 text-slate-800">Angle of Elevation</h3>
                        <p>
                            The angle of elevation is the angle formed by the line of sight looking upward and the horizontal line. It is measured using an instrument called a <strong>Theodolite</strong> or a Clinometer.
                        </p>
                        <h3 className="text-lg font-bold mt-4 text-slate-800">Using Tangent (SOH CAH TOA)</h3>
                        <p>
                            For a right-angled triangle, the tangent function relates the opposite side (height) to the adjacent side (distance):
                        </p>
                        <div className="bg-slate-100 p-3 rounded-lg text-center font-mono my-2 border border-slate-200">
                            tan(θ) = Opposite / Adjacent
                        </div>
                        <p>
                            To find the total height of a building, we must also add the height of the observer's eye level from the ground:
                        </p>
                        <div className="bg-indigo-50 p-3 rounded-lg font-mono text-sm text-indigo-900 border border-indigo-200">
                            Height = (Distance × tan(θ)) + Observer Height
                        </div>
                    </div>
                </div>

                {/* Column 2: Simulator */}
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-sky-500">
                    <div className="flex items-center mb-4 text-sky-800 shrink-0">
                        <Ruler className="mr-2" size={24} />
                        <h2 className="text-xl font-semibold">Interactive Visualizer</h2>
                    </div>
                    
                    <div className="flex-1 relative bg-sky-50 rounded-lg overflow-hidden border border-slate-200 flex flex-col min-h-[300px]">
                        <div className="flex-1 relative w-full h-full">
                            <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0">
                                {/* Sky & Ground */}
                                <rect x="0" y="0" width="400" height="250" fill="#e0f2fe" />
                                <rect x="0" y="250" width="400" height="50" fill="#84cc16" />
                                
                                {/* Building */}
                                <rect x="300" y={250 - Math.min(220, calculatedHeight * 2)} width="60" height={Math.min(220, calculatedHeight * 2)} fill="#94a3b8" stroke="#475569" strokeWidth="2" />
                                <rect x="310" y={250 - Math.min(220, calculatedHeight * 2) + 10} width="15" height="15" fill="#fef08a" />
                                <rect x="335" y={250 - Math.min(220, calculatedHeight * 2) + 10} width="15" height="15" fill="#fef08a" />
                                
                                {/* Observer */}
                                <circle cx={300 - distance * 2} cy={250 - eyeHeight * 2} r="4" fill="#3b82f6" />
                                <line x1={300 - distance * 2} y1="250" x2={300 - distance * 2} y2={250 - eyeHeight * 2} stroke="#1e40af" strokeWidth="3" />
                                
                                {/* Horizontal Line */}
                                <line x1={300 - distance * 2} y1={250 - eyeHeight * 2} x2="300" y2={250 - eyeHeight * 2} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth="2" />
                                
                                {/* Line of Sight */}
                                <line x1={300 - distance * 2} y1={250 - eyeHeight * 2} x2="300" y2={250 - Math.min(220, calculatedHeight * 2)} stroke="#ef4444" strokeWidth="2" />
                                
                                {/* Angle Arc */}
                                <path 
                                    d={`M ${300 - distance * 2 + 40} ${250 - eyeHeight * 2} A 40 40 0 0 0 ${300 - distance * 2 + 40 * Math.cos((angle * Math.PI) / 180)} ${250 - eyeHeight * 2 - 40 * Math.sin((angle * Math.PI) / 180)}`} 
                                    fill="none" 
                                    stroke="#ef4444" 
                                    strokeWidth="2" 
                                />
                                <text x={300 - distance * 2 + 45} y={250 - eyeHeight * 2 - 10} fill="#dc2626" fontSize="14" fontWeight="bold">{angle}°</text>

                                {/* Distance Label */}
                                <text x={300 - distance} y="265" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="bold">d = {distance} m</text>
                            </svg>
                        </div>

                        <div className="p-4 bg-white border-t border-slate-200 space-y-4 shrink-0 shadow-inner">
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1 text-slate-700">
                                    <span>Distance to Base (m)</span>
                                    <span className="text-sky-600">{distance} m</span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="120"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full accent-sky-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1 text-slate-700">
                                    <span>Angle of Elevation (°)</span>
                                    <span className="text-red-600">{angle}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="80"
                                    value={angle}
                                    onChange={(e) => setAngle(Number(e.target.value))}
                                    className="w-full accent-red-500"
                                />
                            </div>
                            <div className="text-center text-sm font-bold text-slate-800 bg-slate-100 py-2 rounded">
                                Simulated Height: {calculatedHeight.toFixed(1)} m
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Assessment */}
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-emerald-500">
                    <div className="flex items-center mb-4 text-emerald-800 shrink-0">
                        <Calculator className="mr-2" size={24} />
                        <h2 className="text-xl font-semibold">Math Assessment</h2>
                    </div>
                    
                    {problem && (
                        <div className="flex-1 flex flex-col space-y-5">
                            <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200">
                                <p className="text-slate-800 mb-3 leading-relaxed">
                                    You are surveying a skyscraper to verify its height. You stand exactly <strong>{problem.distance} meters</strong> away from its base. 
                                    Looking up with your theodolite, you measure an angle of elevation of <strong>{problem.angle}°</strong> to the very top.
                                </p>
                                <p className="text-slate-800 font-semibold">
                                    If your instrument is situated at eye level, which is {problem.eyeHeight} m above the ground, what is the total height of the building?
                                </p>
                                <p className="text-xs text-slate-500 mt-2 font-mono">(Round your answer to 1 decimal place)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Calculated Height (m):</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow text-lg font-mono"
                                    placeholder="e.g. 150.5"
                                />
                            </div>

                            <button
                                onClick={checkAnswer}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                            >
                                Check Answer
                            </button>

                            {feedback && (
                                <div className={`p-4 rounded-lg flex items-start space-x-3 shadow-inner ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                                    {feedback.includes('Correct') ? <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
                                    <p className="flex-1 font-medium">{feedback}</p>
                                </div>
                            )}

                            <div className="mt-auto pt-4">
                                <button
                                    onClick={generateProblem}
                                    className="w-full py-3 flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-300"
                                >
                                    <RotateCcw size={20} />
                                    <span>Generate New Problem</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
