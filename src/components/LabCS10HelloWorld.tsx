import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, Code, Activity, RefreshCw, CheckCircle2, XCircle, Terminal } from 'lucide-react';

interface LabProps {
  onExit?: () => void;
}

export default function LabCS10HelloWorld({ onExit }: LabProps) {
  const [htmlCode, setHtmlCode] = useState<string>('<div id="box" class="box">\n  Hello World!\n</div>\n<button onclick="changeText()">Click Me</button>');
  const [cssCode, setCssCode] = useState<string>('.box {\n  padding: 20px;\n  background: #e2e8f0;\n  border-radius: 8px;\n  text-align: center;\n  margin-bottom: 10px;\n  font-family: sans-serif;\n  font-weight: bold;\n}');
  const [jsCode, setJsCode] = useState<string>('function changeText() {\n  document.getElementById("box").innerHTML = "Welcome to Grade 10 CS!";\n  document.getElementById("box").style.background = "#86efac";\n}');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const questions = [
    {
      q: "What HTML tag is used to create a clickable button?",
      a: "button"
    },
    {
      q: "Which JS method finds an element by its ID?",
      a: "getElementById"
    },
    {
      q: "In CSS, which property changes the background color?",
      a: "background"
    }
  ];

  const updatePreview = () => {
    if (!iframeRef.current) return;
    const document = iframeRef.current.contentDocument;
    if (document) {
      document.open();
      document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>
              ${jsCode}
            </script>
          </body>
        </html>
      `);
      document.close();
      addLog('Preview refreshed.');
    }
  };

  useEffect(() => {
    // Small delay to allow iframe to mount
    const timer = setTimeout(() => {
      updatePreview();
    }, 100);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    updatePreview();
  };

  const checkAnswer = () => {
    const correct = questions[questionIndex].a.toLowerCase();
    if (answer.trim().toLowerCase() === correct) {
      setIsCorrect(true);
      addLog(`Assessment Q${questionIndex + 1} passed.`);
    } else {
      setIsCorrect(false);
    }
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setAnswer('');
      setIsCorrect(null);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-800">Hello World! Virtual Web Dev</h1>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          {/* Column 1: Theory */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Web Basics Theory</h2>
            </div>
            
            <div className="prose prose-sm text-slate-600 space-y-4">
              <p>
                A web page is typically built using three core languages:
              </p>
              <ul className="list-disc pl-5">
                <li><strong>HTML (HyperText Markup Language):</strong> Provides the structure of the webpage. You use tags like <code>&lt;div&gt;</code> and <code>&lt;button&gt;</code> to define elements.</li>
                <li><strong>CSS (Cascading Style Sheets):</strong> Defines the visual appearance. You can change colors, sizes, and layouts.</li>
                <li><strong>JavaScript (JS):</strong> Adds interactivity and logic. It can modify HTML and CSS on the fly when events (like a button click) occur.</li>
              </ul>
              <p>
                In this lab, you have a small code editor. Try changing the <strong>HTML</strong> text, the <strong>CSS</strong> colors, or the <strong>JS</strong> function to see how it affects the preview!
              </p>
            </div>
          </div>

          {/* Column 2: Simulation/Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Code className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Code Editor & Preview</h2>
              </div>
              <button onClick={handleRefresh} className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100 transition">
                <RefreshCw className="w-4 h-4" /> Run Code
              </button>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {/* Editors */}
              <div className="flex flex-col gap-2 h-1/2">
                <div className="flex-1 flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">HTML</label>
                  <textarea 
                    value={htmlCode} 
                    onChange={e => setHtmlCode(e.target.value)} 
                    className="flex-1 w-full p-2 border rounded font-mono text-xs bg-slate-50 resize-none outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="flex gap-2 flex-1">
                  <div className="flex-1 flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 mb-1">CSS</label>
                    <textarea 
                      value={cssCode} 
                      onChange={e => setCssCode(e.target.value)} 
                      className="flex-1 w-full p-2 border rounded font-mono text-xs bg-slate-50 resize-none outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 mb-1">JavaScript</label>
                    <textarea 
                      value={jsCode} 
                      onChange={e => setJsCode(e.target.value)} 
                      className="flex-1 w-full p-2 border rounded font-mono text-xs bg-slate-50 resize-none outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="flex-1 flex flex-col border rounded overflow-hidden relative">
                <div className="bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 border-b flex justify-between">
                  <span>Live Preview</span>
                </div>
                <iframe 
                  ref={iframeRef} 
                  title="preview" 
                  className="w-full flex-1 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>

          {/* Column 3: Analysis/Assessment */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 text-purple-600">
              <Activity className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Assessment & Logs</h2>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
              <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Knowledge Check ({questionIndex + 1}/{questions.length})
              </h3>
              <p className="text-sm text-slate-700 mb-3">
                {questions[questionIndex].q}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="border rounded px-3 py-2 flex-1 outline-none focus:border-purple-400"
                  placeholder="Your answer..."
                />
                <button
                  onClick={checkAnswer}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Check
                </button>
              </div>
              {isCorrect !== null && (
                <div className={`mt-3 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="font-medium text-sm">{isCorrect ? 'Correct!' : 'Incorrect, try again.'}</span>
                </div>
              )}
              {isCorrect && questionIndex < questions.length - 1 && (
                <button onClick={nextQuestion} className="mt-3 text-sm text-purple-600 hover:underline">
                  Next Question &rarr;
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="font-medium text-slate-700 mb-2">Editor Logs</h3>
              <div className="flex-1 bg-slate-50 border rounded p-3 overflow-y-auto text-sm font-mono text-slate-600">
                {logs.length === 0 && <span className="text-slate-400">No events logged.</span>}
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
