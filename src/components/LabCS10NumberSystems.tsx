import { useState, useEffect } from 'react';
import { BookOpen, Settings, Activity, Calculator, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabCS10NumberSystems({ onExit }: LabProps) {
  const [activeTab, setActiveTab] = useState<'convert' | 'arithmetic' | 'complements'>('convert');

  // Conversion State
  const [convInput, setConvInput] = useState<string>('10');
  const [convBaseIn, setConvBaseIn] = useState<number>(10);
  const [convBaseOut, setConvBaseOut] = useState<number>(2);
  const [convResult, setConvResult] = useState<string>('1010');

  // Arithmetic State
  const [arithA, setArithA] = useState<string>('1010');
  const [arithB, setArithB] = useState<string>('0101');
  const [arithOp, setArithOp] = useState<'+' | '-'>('+');
  const [arithResult, setArithResult] = useState<string>('1111');

  // Complements State
  const [compInput, setCompInput] = useState<string>('1010');
  const [comp1, setComp1] = useState<string>('0101');
  const [comp2, setComp2] = useState<string>('0110');

  // Assessment State
  const [questionVal, setQuestionVal] = useState<number>(45);
  const [questionBaseIn, setQuestionBaseIn] = useState<number>(10);
  const [questionBaseOut, setQuestionBaseOut] = useState<number>(2);
  const [answer, setAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const bases = [2, 8, 10, 16];
    const bIn = bases[Math.floor(Math.random() * bases.length)];
    let bOut = bases[Math.floor(Math.random() * bases.length)];
    while (bOut === bIn) {
      bOut = bases[Math.floor(Math.random() * bases.length)];
    }
    const val = Math.floor(Math.random() * 255) + 1;
    setQuestionVal(val);
    setQuestionBaseIn(bIn);
    setQuestionBaseOut(bOut);
    setAnswer('');
    setIsCorrect(null);
  };

  const handleConvert = () => {
    try {
      const parsed = parseInt(convInput, convBaseIn);
      if (isNaN(parsed)) {
        setConvResult('Invalid Input');
        return;
      }
      const res = parsed.toString(convBaseOut).toUpperCase();
      setConvResult(res);
      addLog(`Converted ${convInput} (Base ${convBaseIn}) to ${res} (Base ${convBaseOut})`);
    } catch (e) {
      setConvResult('Error');
    }
  };

  const handleArithmetic = () => {
    try {
      const a = parseInt(arithA, 2);
      const b = parseInt(arithB, 2);
      if (isNaN(a) || isNaN(b)) {
        setArithResult('Invalid Binary');
        return;
      }
      let res = 0;
      if (arithOp === '+') res = a + b;
      if (arithOp === '-') res = a - b;
      const binRes = res >= 0 ? res.toString(2) : '-' + Math.abs(res).toString(2);
      setArithResult(binRes);
      addLog(`Arithmetic: ${arithA} ${arithOp} ${arithB} = ${binRes}`);
    } catch (e) {
      setArithResult('Error');
    }
  };

  const handleComplements = () => {
    try {
      if (!/^[01]+$/.test(compInput)) {
        setComp1('Invalid Binary');
        setComp2('Invalid Binary');
        return;
      }
      let c1 = '';
      for (let i = 0; i < compInput.length; i++) {
        c1 += compInput[i] === '1' ? '0' : '1';
      }
      setComp1(c1);
      const valC1 = parseInt(c1, 2);
      const valC2 = valC1 + 1;
      let c2 = valC2.toString(2);
      if (c2.length < compInput.length) {
         c2 = c2.padStart(compInput.length, '0');
      } else if (c2.length > compInput.length) {
         c2 = c2.slice(c2.length - compInput.length);
      }
      setComp2(c2);
      addLog(`Complements for ${compInput}: 1s=${c1}, 2s=${c2}`);
    } catch (e) {
      setComp1('Error');
      setComp2('Error');
    }
  };

  const checkAnswer = () => {
    const correctVal = questionVal.toString(questionBaseOut).toUpperCase();
    if (answer.trim().toUpperCase() === correctVal) {
      setIsCorrect(true);
      addLog(`Assessment Passed: ${questionVal.toString(questionBaseIn).toUpperCase()} (Base ${questionBaseIn}) = ${correctVal} (Base ${questionBaseOut})`);
    } else {
      setIsCorrect(false);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Number Systems Virtual Lab" />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          {/* Column 1: Theory */}
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Theory & Concepts</h2>
            </div>
            
            <div className="prose prose-sm text-slate-600 space-y-4">
              <p>
                <strong>Number Systems</strong> are ways to represent quantities. The most common systems are:
              </p>
              <ul className="list-disc pl-5">
                <li><strong>Decimal (Base 10):</strong> Digits 0-9. Our daily system.</li>
                <li><strong>Binary (Base 2):</strong> Digits 0-1. Used in digital electronics.</li>
                <li><strong>Octal (Base 8):</strong> Digits 0-7.</li>
                <li><strong>Hexadecimal (Base 16):</strong> Digits 0-9, A-F. Used for memory addresses.</li>
              </ul>
              <p>
                <strong>Binary Arithmetic</strong> follows similar rules to decimal arithmetic, but you carry over at 2 instead of 10.
              </p>
              <p>
                <strong>1's Complement:</strong> Flip all bits (0 becomes 1, 1 becomes 0).<br/>
                <strong>2's Complement:</strong> Add 1 to the 1's complement. Used to represent negative numbers in computers.
              </p>
            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <Settings className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Interactive Tools</h2>
            </div>

            <div className="flex gap-2 mb-4 border-b pb-2">
              <button 
                onClick={() => setActiveTab('convert')}
                className={`px-3 py-1 rounded ${activeTab === 'convert' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Conversion
              </button>
              <button 
                onClick={() => setActiveTab('arithmetic')}
                className={`px-3 py-1 rounded ${activeTab === 'arithmetic' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Arithmetic
              </button>
              <button 
                onClick={() => setActiveTab('complements')}
                className={`px-3 py-1 rounded ${activeTab === 'complements' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Complements
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {activeTab === 'convert' && (
                <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Input Value</label>
                    <input type="text" value={convInput} onChange={e => setConvInput(e.target.value)} className="border rounded p-2 w-full" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">From Base</label>
                      <select value={convBaseIn} onChange={e => setConvBaseIn(Number(e.target.value))} className="border rounded p-2 w-full">
                        <option value={2}>Binary (2)</option>
                        <option value={8}>Octal (8)</option>
                        <option value={10}>Decimal (10)</option>
                        <option value={16}>Hex (16)</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">To Base</label>
                      <select value={convBaseOut} onChange={e => setConvBaseOut(Number(e.target.value))} className="border rounded p-2 w-full">
                        <option value={2}>Binary (2)</option>
                        <option value={8}>Octal (8)</option>
                        <option value={10}>Decimal (10)</option>
                        <option value={16}>Hex (16)</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleConvert} className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Convert</button>
                  <div className="mt-2 p-3 bg-slate-50 border rounded text-center">
                    <span className="text-sm text-slate-500">Result:</span>
                    <div className="text-2xl font-mono font-bold mt-1 text-slate-800">{convResult}</div>
                  </div>
                </div>
              )}

              {activeTab === 'arithmetic' && (
                <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Binary A</label>
                    <input type="text" value={arithA} onChange={e => setArithA(e.target.value.replace(/[^01]/g, ''))} className="border rounded p-2 w-full font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Operation</label>
                    <select value={arithOp} onChange={e => setArithOp(e.target.value as '+' | '-')} className="border rounded p-2 w-full">
                      <option value="+">Addition (+)</option>
                      <option value="-">Subtraction (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Binary B</label>
                    <input type="text" value={arithB} onChange={e => setArithB(e.target.value.replace(/[^01]/g, ''))} className="border rounded p-2 w-full font-mono" />
                  </div>
                  <button onClick={handleArithmetic} className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Calculate</button>
                  <div className="mt-2 p-3 bg-slate-50 border rounded text-center">
                    <span className="text-sm text-slate-500">Result:</span>
                    <div className="text-2xl font-mono font-bold mt-1 text-slate-800">{arithResult}</div>
                  </div>
                </div>
              )}

              {activeTab === 'complements' && (
                <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Input Binary</label>
                    <input type="text" value={compInput} onChange={e => setCompInput(e.target.value.replace(/[^01]/g, ''))} className="border rounded p-2 w-full font-mono" />
                  </div>
                  <button onClick={handleComplements} className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Calculate Complements</button>
                  <div className="mt-2 p-3 bg-slate-50 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500">1's Complement:</span>
                      <span className="text-lg font-mono font-bold text-slate-800">{comp1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">2's Complement:</span>
                      <span className="text-lg font-mono font-bold text-slate-800">{comp2}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Analysis/Assessment */}
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Activity className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Assessment & Logs</h2>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Practice Challenge
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Convert <strong className="font-mono text-base">{questionVal.toString(questionBaseIn).toUpperCase()}</strong> (Base {questionBaseIn}) to Base {questionBaseOut}.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                  placeholder="Your answer..."
                />
                <button
                  onClick={checkAnswer}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Check
                </button>
              </div>
              {isCorrect !== null && (
                <div className={`mt-3 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="font-medium">{isCorrect ? 'Correct! Well done.' : 'Incorrect, try again.'}</span>
                </div>
              )}
              {isCorrect && (
                <button onClick={generateQuestion} className="mt-3 text-sm text-blue-600 hover:underline">
                  New Question
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="font-medium text-slate-700 mb-2">Activity Log</h3>
              <div className="flex-1 bg-slate-50 border rounded p-3 overflow-y-auto text-sm font-mono text-slate-600">
                {logs.length === 0 && <span className="text-slate-400">No activity yet.</span>}
                {logs.map((log, i) => (
                  <div key={i} className="mb-1 border-b border-slate-100 pb-1">
                    <span className="text-slate-400 mr-2">[{i + 1}]</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
