import { useState, useEffect, useRef, useCallback } from 'react';
import { Calculator, BookOpen, Orbit, CheckCircle2, XCircle, Play, Square, Scissors, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';

interface CircleProblem {
    radius: number;
    angle: number;
    correctArcLength: number;
    correctSectorArea: number;
}

export default function LabM10CircleApplications({ onExit }: { onExit: () => void }) {
    const [radius, setRadius] = useState<number>(10);
    const [angle, setAngle] = useState<number>(60);
    const [isWhirling, setIsWhirling] = useState<boolean>(false);
    
    // Animation state
    const [stonePos, setStonePos] = useState({ x: 200 + 10 * 10, y: 150 }); 
    const [broken, setBroken] = useState(false);
    const velocityRef = useRef({ vx: 0, vy: 0 });
    const posRef = useRef({ x: 0, y: 0 });
    const animRef = useRef<number>(0);
    const angleRef = useRef<number>(0);

    const scale = 10; // 1 unit = 10px

    const updateAnimation = useCallback(() => {
        if (!isWhirling) return;

        if (!broken) {
            angleRef.current = (angleRef.current + 0.05) % (2 * Math.PI);
            const cx = 200;
            const cy = 150;
            const rPx = radius * scale;
            const x = cx + rPx * Math.cos(angleRef.current);
            const y = cy - rPx * Math.sin(angleRef.current); // SVG Y is down
            setStonePos({ x, y });
            posRef.current = { x, y };
        } else {
            posRef.current.x += velocityRef.current.vx;
            posRef.current.y += velocityRef.current.vy;
            setStonePos({ ...posRef.current });
            
            if (posRef.current.x < -50 || posRef.current.x > 450 || posRef.current.y < -50 || posRef.current.y > 350) {
                setIsWhirling(false);
                setBroken(false);
                angleRef.current = 0;
                setStonePos({ x: 200 + radius * scale, y: 150 });
            }
        }
        animRef.current = requestAnimationFrame(updateAnimation);
    }, [isWhirling, broken, radius]);

    useEffect(() => {
        if (isWhirling) {
            animRef.current = requestAnimationFrame(updateAnimation);
        }
        return () => cancelAnimationFrame(animRef.current);
    }, [isWhirling, updateAnimation]);

    const breakString = () => {
        if (!isWhirling || broken) return;
        setBroken(true);
        const speed = radius * scale * 0.05;
        velocityRef.current = {
            vx: -Math.sin(angleRef.current) * speed,
            vy: -Math.cos(angleRef.current) * speed
        };
    };

    const toggleWhirling = () => {
        if (isWhirling) {
            setIsWhirling(false);
            setBroken(false);
            angleRef.current = 0;
            setStonePos({ x: 200 + radius * scale, y: 150 });
        } else {
            setIsWhirling(true);
            setBroken(false);
            angleRef.current = 0;
        }
    };

    // Assessment Logic
    const [problem, setProblem] = useState<CircleProblem | null>(null);
    const [userArcLength, setUserArcLength] = useState<string>('');
    const [userSectorArea, setUserSectorArea] = useState<string>('');
    const [feedback, setFeedback] = useState<string | null>(null);

    const generateProblem = useCallback(() => {
        const r = Math.floor(Math.random() * 15) + 5;
        const a = Math.floor(Math.random() * 18) * 10 + 30; // 30 to 210 degrees
        const arc = (a / 360) * 2 * Math.PI * r;
        const area = (a / 360) * Math.PI * Math.pow(r, 2);
        setProblem({ radius: r, angle: a, correctArcLength: Number(arc.toFixed(2)), correctSectorArea: Number(area.toFixed(2)) });
        setUserArcLength('');
        setUserSectorArea('');
        setFeedback(null);
    }, []);

    useEffect(() => {
        generateProblem();
    }, [generateProblem]);

    const checkAnswer = () => {
        if (!problem) return;
        const numArc = parseFloat(userArcLength);
        const numArea = parseFloat(userSectorArea);
        
        if (isNaN(numArc) || isNaN(numArea)) {
            setFeedback("Please enter valid numbers.");
            return;
        }

        const arcCorrect = Math.abs(numArc - problem.correctArcLength) <= 0.1;
        const areaCorrect = Math.abs(numArea - problem.correctSectorArea) <= 0.5;

        if (arcCorrect && areaCorrect) {
            setFeedback("Correct! Great job calculating arc length and sector area.");
        } else if (!arcCorrect && areaCorrect) {
            setFeedback("Arc length is incorrect. Hint: Arc Length = (θ/360) * 2πr");
        } else if (arcCorrect && !areaCorrect) {
            setFeedback("Sector area is incorrect. Hint: Area = (θ/360) * πr²");
        } else {
            setFeedback(`Incorrect. Arc length is θ/360 * 2πr. Area is θ/360 * πr². Use π ≈ 3.14159.`);
        }
    };

    // Calculate arc path for visualizer (static when not whirling)
    const endX = 200 + radius * scale * Math.cos((angle * Math.PI) / 180);
    const endY = 150 - radius * scale * Math.sin((angle * Math.PI) / 180);
    const largeArcFlag = angle > 180 ? 1 : 0;
    // Fix arc radius parsing in SVG
    const svgArcPath = `M ${200 + radius * scale} 150 A ${radius * scale} ${radius * scale} 0 ${largeArcFlag} 0 ${endX} ${endY}`;

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            {/* Header */}
            <LabHeader onExit={onExit} title="Circle Applications" />

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
                {/* Column 1: Theory */}
                <div className="bg-slate-50 rounded-xl shadow-lg p-6 flex flex-col overflow-y-auto border-t-4 border-purple-500">
                    <div className="flex items-center mb-4 text-purple-800 shrink-0">
                        <BookOpen className="mr-2" size={24} />
                        <h2 className="text-xl font-semibold">Theory & Context</h2>
                    </div>
                    <div className="prose prose-purple flex-1 text-slate-700">
                        <p>
                            Circles appear everywhere in nature and engineering: from the orbit of a GPS satellite to the arch of a bridge and a stone whirling on a string.
                        </p>
                        <h3 className="text-lg font-bold mt-4 text-slate-800">Arc Length</h3>
                        <p>
                            The <strong>arc length</strong> is the distance along the curved edge of the circle. It is a fraction of the circle's total circumference (2πr).
                        </p>
                        <div className="bg-slate-100 p-3 rounded-lg text-center font-mono my-2 border border-slate-200">
                            Arc Length (s) = (θ / 360°) × 2πr
                        </div>
                        <h3 className="text-lg font-bold mt-4 text-slate-800">Sector Area</h3>
                        <p>
                            A sector is a "slice of pie" of the circle. Its area is a fraction of the total area (πr²).
                        </p>
                        <div className="bg-slate-100 p-3 rounded-lg text-center font-mono my-2 border border-slate-200">
                            Sector Area (A) = (θ / 360°) × πr²
                        </div>
                        <h3 className="text-lg font-bold mt-4 text-slate-800">Tangents</h3>
                        <p>
                            A <strong>tangent</strong> is a line that touches the circle at exactly one point. It is always <strong>perpendicular (90°)</strong> to the radius at that point. If a whirling string breaks, the object flies off in a straight line along the tangent.
                        </p>
                    </div>
                </div>

                {/* Column 2: Simulator */}
                <div className="bg-slate-50 rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-fuchsia-500">
                    <div className="flex items-center mb-4 text-fuchsia-800 shrink-0">
                        <Orbit className="mr-2" size={24} />
                        <h2 className="text-xl font-semibold">Interactive Visualizer</h2>
                    </div>
                    
                    <div className="flex-1 relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex flex-col min-h-[300px]">
                        <div className="flex-1 relative w-full h-full">
                            <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0">
                                {/* Grid lines */}
                                <g stroke="#334155" strokeWidth="1" strokeDasharray="4 4">
                                    <line x1="200" y1="0" x2="200" y2="300" />
                                    <line x1="0" y1="150" x2="400" y2="150" />
                                </g>

                                {/* Full Circle Outline (Faint) */}
                                <circle cx="200" cy="150" r={radius * scale} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="5 5" />
                                
                                {!isWhirling && (
                                    <>
                                        {/* Sector Fill */}
                                        <path d={`M 200 150 L ${200 + radius * scale} 150 A ${radius * scale} ${radius * scale} 0 ${largeArcFlag} 0 ${endX} ${endY} Z`} fill="rgba(217, 70, 239, 0.2)" />
                                        
                                        {/* Arc Highlight */}
                                        <path d={svgArcPath} fill="none" stroke="#d946ef" strokeWidth="4" />
                                        
                                        {/* Radius lines */}
                                        <line x1="200" y1="150" x2={200 + radius * scale} y2="150" stroke="#a855f7" strokeWidth="2" />
                                        <line x1="200" y1="150" x2={endX} y2={endY} stroke="#a855f7" strokeWidth="2" />

                                        {/* Tangent line at endpoint */}
                                        {angle > 0 && angle < 360 && (
                                            <line 
                                                x1={endX - 50 * Math.sin((angle * Math.PI) / 180)} 
                                                y1={endY - 50 * Math.cos((angle * Math.PI) / 180)} 
                                                x2={endX + 50 * Math.sin((angle * Math.PI) / 180)} 
                                                y2={endY + 50 * Math.cos((angle * Math.PI) / 180)} 
                                                stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 4"
                                            />
                                        )}
                                        
                                        {/* Labels */}
                                        <text x="210" y="140" fill="#a855f7" fontSize="12" fontWeight="bold">r = {radius}m</text>
                                        <text x={200 + 15 * Math.cos((angle/2 * Math.PI) / 180)} y={150 - 15 * Math.sin((angle/2 * Math.PI) / 180)} fill="#d946ef" fontSize="12" fontWeight="bold">{angle}°</text>
                                    </>
                                )}

                                {/* Center Point */}
                                <circle cx="200" cy="150" r="4" fill="#f8fafc" />

                                {/* Whirling String */}
                                {isWhirling && !broken && (
                                    <line x1="200" y1="150" x2={stonePos.x} y2={stonePos.y} stroke="#a855f7" strokeWidth="2" />
                                )}

                                {/* Stone/Object */}
                                <circle cx={stonePos.x} cy={stonePos.y} r="6" fill="#22d3ee" className={isWhirling ? "shadow-cyan" : ""} />
                                {isWhirling && broken && (
                                    <line 
                                        x1={stonePos.x} 
                                        y1={stonePos.y} 
                                        x2={stonePos.x - velocityRef.current.vx * 10} 
                                        y2={stonePos.y - velocityRef.current.vy * 10} 
                                        stroke="#22d3ee" strokeWidth="2" strokeDasharray="2 2"
                                    />
                                )}
                            </svg>
                        </div>

                        <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-4 shrink-0 shadow-inner">
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1 text-slate-300">
                                    <span>Radius (m)</span>
                                    <span className="text-purple-400">{radius} m</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="15"
                                    value={radius}
                                    onChange={(e) => { setRadius(Number(e.target.value)); if (!isWhirling) setStonePos({ x: 200 + Number(e.target.value) * scale, y: 150 }); }}
                                    className="w-full accent-purple-500"
                                    disabled={isWhirling}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1 text-slate-300">
                                    <span>Sector Angle (°)</span>
                                    <span className="text-fuchsia-400">{angle}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="350"
                                    value={angle}
                                    onChange={(e) => setAngle(Number(e.target.value))}
                                    className="w-full accent-fuchsia-500"
                                    disabled={isWhirling}
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={toggleWhirling}
                                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded flex items-center justify-center space-x-2 transition-colors"
                                >
                                    {isWhirling ? <><Square size={16}/><span>Stop</span></> : <><Play size={16}/><span>Whirl</span></>}
                                </button>
                                <button
                                    onClick={breakString}
                                    disabled={!isWhirling || broken}
                                    className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:text-slate-400 text-white font-bold rounded flex items-center justify-center space-x-2 transition-colors"
                                >
                                    <Scissors size={16}/><span>Break String</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Assessment */}
                <div className="bg-slate-50 rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-rose-500">
                    <div className="flex items-center mb-4 text-rose-800 shrink-0">
                        <Calculator className="mr-2" size={24} />
                        <h2 className="text-xl font-semibold">Math Assessment</h2>
                    </div>
                    
                    {problem && (
                        <div className="flex-1 flex flex-col space-y-4">
                            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                                <p className="text-slate-800 mb-2 leading-relaxed">
                                    An engineer is designing a circular track with a radius of <strong>{problem.radius} meters</strong>. 
                                    They need to pave a section (sector) of the track spanning an angle of <strong>{problem.angle}°</strong>.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">1. What is the Arc Length (m)?</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={userArcLength}
                                    onChange={(e) => setUserArcLength(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-rose-500 outline-none transition-shadow font-mono"
                                    placeholder="e.g. 15.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">2. What is the Sector Area (m²)?</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={userSectorArea}
                                    onChange={(e) => setUserSectorArea(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-rose-500 outline-none transition-shadow font-mono"
                                    placeholder="e.g. 120.5"
                                />
                                <p className="text-xs text-slate-500 mt-1">(Round both answers to 2 decimal places)</p>
                            </div>

                            <button
                                onClick={checkAnswer}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors shadow-sm mt-2"
                            >
                                Check Answers
                            </button>

                            {feedback && (
                                <div className={`p-4 rounded-lg flex items-start space-x-3 shadow-inner ${feedback.includes('Correct!') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                                    {feedback.includes('Correct!') ? <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
                                    <p className="flex-1 font-medium text-sm">{feedback}</p>
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
