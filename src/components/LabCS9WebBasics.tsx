import { useState, useEffect } from 'react';
import { Code, Layout, CheckCircle, RefreshCw } from 'lucide-react';

interface WebTask {
  id: number;
  desc: string;
  check: (h: string, c: string) => boolean;
}

const tasks: WebTask[] = [
  { id: 1, desc: 'Create an <h1> element with text "My Website"', check: (h) => /<h1[^>]*>\s*My Website\s*<\/h1>/i.test(h) },
  { id: 2, desc: 'Create a <p> tag with some text', check: (h) => /<p[^>]*>.*?[a-zA-Z]+.*?<\/p>/i.test(h) },
  { id: 3, desc: 'Make h1 text color red using CSS', check: (_, c) => /h1\s*\{[^}]*color\s*:\s*red\s*;?[^}]*\}/i.test(c) },
  { id: 4, desc: 'Create a <ul> list with at least two <li> elements', check: (h) => /<ul[^>]*>[\s\S]*?<li[^>]*>.*?<\/li>[\s\S]*?<li[^>]*>.*?<\/li>[\s\S]*?<\/ul>/i.test(h) },
];

export default function LabCS9WebBasics({ onExit }: { onExit?: () => void }) {
  const [htmlCode, setHtmlCode] = useState('<h1>Hello</h1>\n<p>Start typing here...</p>\n\n\n');
  const [cssCode, setCssCode] = useState('h1 {\n  color: black;\n}\n\n');
  const [srcDoc, setSrcDoc] = useState('');
  
  const [taskStatus, setTaskStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body style="font-family: sans-serif; padding: 1rem;">
          ${htmlCode}
        </body>
        </html>
      `);
    }, 500);
    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode]);

  const runValidations = () => {
    const status: Record<number, boolean> = {};
    tasks.forEach(t => {
      try {
        status[t.id] = t.check(htmlCode, cssCode);
      } catch (e) {
        status[t.id] = false;
      }
    });
    setTaskStatus(status);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-orange-600 text-white p-4 flex justify-between items-center shadow-md shrink-0">
        <div>
          <h1 className="text-xl font-bold">Web Basics Lab</h1>
          <p className="text-sm opacity-80">HTML & CSS Fundamentals</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={runValidations}
            className="px-4 py-2 bg-orange-700 hover:bg-orange-800 rounded-md font-semibold transition-colors flex items-center gap-2 shadow"
          >
            <CheckCircle className="w-4 h-4" /> Validate Tasks
          </button>
          {onExit && (
            <button onClick={onExit} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 rounded-md font-semibold transition-colors">
              Exit Lab
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Concepts & Tasks</h2>
          
          <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
            <p><strong>HTML</strong> (HyperText Markup Language) provides the structure of a webpage. Tags define elements like headings <code>&lt;h1&gt;</code>, paragraphs <code>&lt;p&gt;</code>, and lists <code>&lt;ul&gt;</code>.</p>
            <p><strong>CSS</strong> (Cascading Style Sheets) provides the visual styling. It uses selectors (like <code>h1</code>) and declarations (like <code>color: red;</code>).</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2 shadow-inner">
            <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
              <Layout className="w-5 h-5" /> Mission Objectives
            </h3>
            <ul className="space-y-3">
              {tasks.map(t => (
                <li key={t.id} className="flex gap-3 text-sm text-slate-700 items-start">
                  {taskStatus[t.id] ? (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                  )}
                  <span>{t.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-700 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2 shrink-0">
            <Code className="w-5 h-5 text-orange-400" /> Code Editor
          </h2>
          
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex justify-between items-end mb-1 shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">index.html</span>
            </div>
            <textarea
              className="w-full flex-1 bg-slate-800 text-orange-200 p-3 rounded-lg font-mono text-sm border border-slate-600 focus:outline-none focus:border-orange-500 resize-none shadow-inner"
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex justify-between items-end mb-1 shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">styles.css</span>
            </div>
            <textarea
              className="w-full flex-1 bg-slate-800 text-blue-300 p-3 rounded-lg font-mono text-sm border border-slate-600 focus:outline-none focus:border-blue-500 resize-none shadow-inner"
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-4 shrink-0">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-500" /> Live Browser Preview
            </h2>
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="flex-1 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-white shadow-inner relative">
            <iframe 
              srcDoc={srcDoc} 
              className="absolute inset-0 w-full h-full border-none bg-white"
              title="Live Preview"
              sandbox="allow-scripts"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
