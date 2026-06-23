import { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, XCircle, Code, BookOpen, ListChecks } from 'lucide-react';

interface LabCS9JavaScriptProps {
  onExit?: () => void;
}

export default function LabCS9JavaScript({ onExit }: LabCS9JavaScriptProps) {
  const [code, setCode] = useState(`// Write your logic here
// The variable 'score' is provided.
// You must return a grade as a string ('A+', 'A', 'B', 'C', 'F').

if (score >= 90) {
  return 'A+';
} else if (score >= 80) {
  return 'A';
} else {
  return 'F';
}
`);

  const [testResults, setTestResults] = useState<{score: number, expected: string, actual: string, passed: boolean}[]>([]);
  const [isPassed, setIsPassed] = useState(false);

  // Randomize test cases on load
  const [testCases] = useState(() => [
    { score: Math.floor(Math.random() * 5) + 95, expected: 'A+' }, // 95-99
    { score: Math.floor(Math.random() * 10) + 80, expected: 'A' }, // 80-89
    { score: Math.floor(Math.random() * 10) + 70, expected: 'B' }, // 70-79
    { score: Math.floor(Math.random() * 10) + 60, expected: 'C' }, // 60-69
    { score: Math.floor(Math.random() * 60), expected: 'F' },      // 0-59
  ]);

  const runCode = () => {
    try {
      // eslint-disable-next-line no-new-func
      const userFunc = new Function('score', code);
      const results = testCases.map(tc => {
        try {
          const actual = String(userFunc(tc.score));
          return {
            score: tc.score,
            expected: tc.expected,
            actual,
            passed: actual === tc.expected
          };
        } catch (err: any) {
           return {
            score: tc.score,
            expected: tc.expected,
            actual: 'Error: ' + err.message,
            passed: false
          };
        }
      });
      setTestResults(results);
      if (results.every(r => r.passed)) {
        setIsPassed(true);
      } else {
        setIsPassed(false);
      }
    } catch (err: any) {
      alert("Syntax Error in your code: " + err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
      <div className="flex items-center justify-between bg-indigo-600 text-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 hover:bg-indigo-700 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold">JavaScript Logic Sandbox</h1>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Theory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
            <BookOpen size={24} /> Theory & Context
          </h2>
          <div className="prose prose-slate flex-1 overflow-y-auto">
            <p>
              In JavaScript, <code>if/else</code> statements allow you to execute different blocks of code based on conditions.
            </p>
            <h3 className="font-semibold text-lg mt-4 mb-2">Grading System</h3>
            <p>Your task is to write logic to determine a student's grade based on their <code>score</code>.</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li><code>score &gt;= 90</code> : <b>A+</b></li>
              <li><code>score &gt;= 80</code> and <code>&lt; 90</code> : <b>A</b></li>
              <li><code>score &gt;= 70</code> and <code>&lt; 80</code> : <b>B</b></li>
              <li><code>score &gt;= 60</code> and <code>&lt; 70</code> : <b>C</b></li>
              <li><code>score &lt; 60</code> : <b>F</b></li>
            </ul>
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 mb-4 whitespace-pre-wrap">
              {`if (score >= 90) {\n  return 'A+';\n} else if (score >= 80) {\n  return 'A';\n}`}
            </div>
            <p className="text-sm text-slate-600">
              Ensure you handle all possible conditions. The automated test suite will run your logic against random scores to verify correctness.
            </p>
          </div>
        </div>

        {/* Middle Column: Interactive Sandbox */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col text-slate-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
            <Code size={24} /> Code Editor
          </h2>
          <div className="flex-1 flex flex-col gap-2">
            <div className="font-mono text-sm text-slate-400">
              function getGrade(score) {'{'}
            </div>
            <textarea
              className="flex-1 w-full bg-slate-800 text-green-400 p-4 font-mono text-sm rounded border border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
            <div className="font-mono text-sm text-slate-400">
              {'}'}
            </div>
          </div>
          <button
            onClick={runCode}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Play size={20} /> Run Tests
          </button>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
            <ListChecks size={24} /> Automated Test Suite
          </h2>
          <div className="flex-1 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <ListChecks size={48} className="opacity-50" />
                <p>Run your code to see test results</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} flex flex-col gap-1`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Test {idx + 1}: Score = {result.score}</span>
                      {result.passed ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <XCircle size={20} className="text-red-600" />
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      Expected: <span className="font-mono bg-white px-1 border rounded">{result.expected}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Actual: <span className="font-mono bg-white px-1 border rounded text-red-600">{result.actual}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {testResults.length > 0 && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${isPassed ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
              {isPassed ? 'All Tests Passed! Excellent Work!' : 'Some tests failed. Check your logic and try again.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
