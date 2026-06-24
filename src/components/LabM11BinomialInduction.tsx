import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Triangle, AlignCenterVertical, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM11BinomialInduction({ onExit }: { onExit?: () => void }) {
    const [mode, setMode] = useState<'induction' | 'pascal'>('induction');

    // --- Induction State ---
    const NUM_DOMINOES = 15;
    const [dominoesState, setDominoesState] = useState<boolean[]>(new Array(NUM_DOMINOES).fill(false)); // true = fallen
    const [missingDomino, setMissingDomino] = useState<number | null>(null);
    const [isFalling, setIsFalling] = useState(false);
    const fallIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // --- Pascal State ---
    const [pascalRows, setPascalRows] = useState(7); // up to 10
    const [selectedCell, setSelectedCell] = useState<{n: number, k: number} | null>(null);

    // --- Assessment ---
    const [q1Ans, setQ1Ans] = useState('');
    const [q2Ans, setQ2Ans] = useState('');
    const [feedback, setFeedback] = useState<{q1?: boolean, q2?: boolean}>({});

    const resetDominoes = () => {
        if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
        setDominoesState(new Array(NUM_DOMINOES).fill(false));
        setIsFalling(false);
    };

    const startFall = () => {
        if (isFalling) return;
        setIsFalling(true);
        let currentIndex = 0;
        
        fallIntervalRef.current = setInterval(() => {
            setDominoesState(prev => {
                const newState = [...prev];
                // Check if current is missing
                if (currentIndex === missingDomino) {
                    if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
                    setIsFalling(false);
                    return prev;
                }
                
                newState[currentIndex] = true;
                currentIndex++;
                
                if (currentIndex >= NUM_DOMINOES) {
                    if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
                    setIsFalling(false);
                }
                return newState;
            });
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
        };
    }, []);

    const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
    const nCr = (n: number, r: number): number => factorial(n) / (factorial(r) * factorial(n - r));

    const generatePascalTriangle = (rows: number) => {
        const triangle: number[][] = [];
        for (let n = 0; n < rows; n++) {
            const row: number[] = [];
            for (let k = 0; k <= n; k++) {
                row.push(nCr(n, k));
            }
            triangle.push(row);
        }
        return triangle;
    };

    const checkAnswers = () => {
        const f = { ...feedback };
        if (mode === 'induction') {
            // Base step, Inductive step
            f.q1 = q1Ans.trim().toLowerCase().includes('base');
            f.q2 = q2Ans.trim().toLowerCase().includes('k+1') || q2Ans.trim().toLowerCase().includes('k + 1');
        } else {
            // Binomial expansion of (a+b)^4, coefficient of a^2b^2 is 4C2 = 6
            f.q1 = q1Ans.trim() === '6';
            // 7C3 = 35
            f.q2 = q2Ans.trim() === '35';
        }
        setFeedback(f);
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            {/* Header */}
            <LabHeader onExit={onExit} title="Grade 11: Induction & Binomial Theorem" />

            <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
                {/* Left Column: Theory */}
                <div className="p-6 bg-slate-50 border-r border-slate-200 overflow-y-auto flex flex-col gap-6">
                    {mode === 'induction' ? (
                        <>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Mathematical Induction</h2>
                                <p className="text-slate-600 mb-4">A method of mathematical proof typically used to establish that a given statement is true for all natural numbers.</p>
                                
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-4">
                                    <h3 className="font-semibold text-amber-900 mb-2">The Domino Effect</h3>
                                    <ol className="list-decimal list-inside text-sm text-amber-800 space-y-2">
                                        <li><strong>Base Case:</strong> Prove the first domino falls (Prove true for $n=1$).</li>
                                        <li><strong>Inductive Hypothesis:</strong> Assume some domino $k$ falls.</li>
                                        <li><strong>Inductive Step:</strong> Show that if domino $k$ falls, it knocks over domino $k+1$.</li>
                                    </ol>
                                </div>
                                <p className="text-sm text-slate-600">If both conditions are met, the entire infinite line of dominoes will fall. If there is a gap (missing domino), the chain stops!</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Pascal's Triangle & Binomial Theorem</h2>
                                <p className="text-slate-600 mb-4">Pascal's Triangle gives the coefficients for binomial expansions, represented by combinations {"$\\binom{n}{k}$"}.</p>
                                
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 mb-4">
                                    <h3 className="font-semibold text-indigo-900 mb-2">Binomial Theorem</h3>
                                    <p className="text-sm text-indigo-800 font-mono mb-2">
                                        {"$$ (x + y)^n = \\sum \\binom{n}{k} x^{n-k} y^k $$"}
                                    </p>
                                    <p className="text-xs text-indigo-700">Where $nCk$ (or {"$\\binom{n}{k}$"}) is the number in the $n$-th row and $k$-th column of Pascal's triangle.</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h3 className="font-semibold text-slate-800 mb-2">Formula for nCr</h3>
                                    <p className="text-sm font-mono text-slate-700">
                                        {"$$ nCr = \\frac{n!}{r! (n-r)!} $$"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Middle Column: Interactive Simulator */}
                <div className="bg-slate-100 relative flex flex-col p-6 overflow-y-auto items-center justify-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 absolute top-6">Interactive Visualizer</h2>
                    
                    {mode === 'induction' && (
                        <div className="w-full flex flex-col items-center gap-12 mt-10">
                            {/* Domino Track */}
                            <div className="w-full max-w-2xl bg-slate-300 h-4 rounded-full relative flex items-end justify-between px-4 pb-4">
                                {dominoesState.map((isFallen, idx) => (
                                    <div key={idx} className="relative w-8 flex justify-center">
                                        {idx !== missingDomino && (
                                            <div className={`w-3 h-16 rounded-sm bg-indigo-600 border border-indigo-800 shadow-md transform origin-bottom transition-transform duration-150 ease-in ${isFallen ? 'rotate-[65deg] translate-x-3' : 'rotate-0'}`}>
                                                <div className="w-full h-1/2 border-b border-indigo-400 opacity-50"></div>
                                                <div className="absolute -top-6 w-full text-center text-xs font-bold text-slate-500">{idx+1}</div>
                                            </div>
                                        )}
                                        {idx === missingDomino && (
                                            <div className="w-full absolute -top-6 text-center text-xs font-bold text-red-500">GAP</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-md flex flex-col gap-4">
                                <p className="text-sm font-semibold text-slate-700">Experiment Controls</p>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-slate-600">Remove a domino (create a gap):</label>
                                    <select 
                                        className="border border-slate-300 rounded p-1"
                                        value={missingDomino === null ? 'none' : missingDomino}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setMissingDomino(val === 'none' ? null : parseInt(val));
                                            resetDominoes();
                                        }}
                                        disabled={isFalling}
                                    >
                                        <option value="none">None (Perfect Induction)</option>
                                        <option value="4">Domino 5</option>
                                        <option value="9">Domino 10</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <button onClick={startFall} disabled={isFalling || dominoesState[0]} className="flex-1 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                        <Play size={18} /> Push First Domino
                                    </button>
                                    <button onClick={resetDominoes} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        <RotateCcw size={18} /> Reset
                                    </button>
                                </div>
                                <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800 border border-indigo-100 mt-2">
                                    {missingDomino === null ? 
                                        "If P(1) is true and P(k) -> P(k+1) is true for all k, all dominoes fall." : 
                                        `Gap at domino ${missingDomino + 1}. The inductive step P(k) -> P(k+1) fails at k=${missingDomino}!`}
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'pascal' && (
                        <div className="w-full flex flex-col items-center gap-6 mt-10">
                            <div className="flex flex-col items-center gap-1">
                                {generatePascalTriangle(pascalRows).map((row, n) => (
                                    <div key={n} className="flex gap-1">
                                        {row.map((val, k) => (
                                            <button 
                                                key={k}
                                                onClick={() => setSelectedCell({n, k})}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all shadow-sm border
                                                    ${selectedCell?.n === n && selectedCell?.k === k ? 'bg-amber-500 text-white border-amber-600 scale-110 z-10' : 'bg-slate-50 text-indigo-900 border-slate-200 hover:bg-indigo-50'}`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className="w-full max-w-md bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 mt-4 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-700">Number of Rows:</label>
                                    <input type="range" min="3" max="10" value={pascalRows} onChange={e => {setPascalRows(parseInt(e.target.value)); setSelectedCell(null);}} className="w-1/2" />
                                    <span className="text-sm font-mono bg-slate-100 px-2 rounded">{pascalRows}</span>
                                </div>

                                {selectedCell && (
                                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex flex-col items-center">
                                        <div className="text-indigo-900 font-semibold mb-2">Selected Coefficient</div>
                                        <div className="flex items-center gap-4 text-xl font-mono text-indigo-800">
                                            <div className="flex flex-col items-center justify-center">
                                                <span>{selectedCell.n}</span>
                                                <span className="border-t-2 border-indigo-800 w-6"></span>
                                                <span>{selectedCell.k}</span>
                                            </div>
                                            <span>=</span>
                                            <span className="font-bold text-2xl">{nCr(selectedCell.n, selectedCell.k)}</span>
                                        </div>
                                        <div className="text-xs text-indigo-600 mt-3 text-center">
                                            Row {selectedCell.n}, Item {selectedCell.k} (0-indexed)<br/>
                                            Appears in expansion of {"$$ (x+y)^{" + selectedCell.n + "} $$"} as coefficient of {"$$ x^{" + (selectedCell.n - selectedCell.k) + "}y^{" + selectedCell.k + "} $$"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Assessment */}
                <div className="p-6 bg-slate-50 border-l border-slate-200 overflow-y-auto">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                         Let's Solve
                    </h2>

                    <div className="space-y-6">
                        {mode === 'induction' && (
                            <>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <p className="text-sm text-slate-700 mb-4 font-medium">Q1. What is the name of the first step in Mathematical Induction, where you prove the statement holds for n=1?</p>
                                    <div className="flex items-center gap-3">
                                        <input type="text" value={q1Ans} onChange={e => setQ1Ans(e.target.value)} placeholder="e.g. Base step" className="flex-1 border border-slate-300 rounded-lg p-2 text-sm" />
                                        {feedback.q1 === true && <CheckCircle2 className="text-green-500" size={24} />}
                                        {feedback.q1 === false && <XCircle className="text-red-500" size={24} />}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <p className="text-sm text-slate-700 mb-4 font-medium">Q2. In the Inductive Step, you assume the statement is true for n = k. What do you then need to prove it is true for?</p>
                                    <div className="flex items-center gap-3">
                                        <input type="text" value={q2Ans} onChange={e => setQ2Ans(e.target.value)} placeholder="e.g. k+1" className="flex-1 border border-slate-300 rounded-lg p-2 text-sm" />
                                        {feedback.q2 === true && <CheckCircle2 className="text-green-500" size={24} />}
                                        {feedback.q2 === false && <XCircle className="text-red-500" size={24} />}
                                    </div>
                                </div>
                            </>
                        )}

                        {mode === 'pascal' && (
                            <>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <p className="text-sm text-slate-700 mb-4 font-medium">Q1. What is the coefficient of $x^2y^2$ in the expansion of $(x+y)^4$?</p>
                                    <div className="flex items-center gap-3">
                                        <input type="text" value={q1Ans} onChange={e => setQ1Ans(e.target.value)} placeholder="Enter number" className="flex-1 border border-slate-300 rounded-lg p-2 text-sm" />
                                        {feedback.q1 === true && <CheckCircle2 className="text-green-500" size={24} />}
                                        {feedback.q1 === false && <XCircle className="text-red-500" size={24} />}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Hint: Look at Row 4 of Pascal's Triangle.</p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <p className="text-sm text-slate-700 mb-4 font-medium">Q2. Compute the value of $\binom{7}{3}$ (7 choose 3).</p>
                                    <div className="flex items-center gap-3">
                                        <input type="text" value={q2Ans} onChange={e => setQ2Ans(e.target.value)} placeholder="Enter number" className="flex-1 border border-slate-300 rounded-lg p-2 text-sm" />
                                        {feedback.q2 === true && <CheckCircle2 className="text-green-500" size={24} />}
                                        {feedback.q2 === false && <XCircle className="text-red-500" size={24} />}
                                    </div>
                                </div>
                            </>
                        )}

                        <button onClick={checkAnswers} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md mt-4">
                            Check Answers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
