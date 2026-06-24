import { useState, useEffect } from 'react';
import { BookOpen, Layout, Activity, CheckCircle2, XCircle, Code2, Play } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabCS10HTMLCSS({ onExit }: LabProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'table' | 'animation'>('form');

  // Form Builder State
  const [formFields, setFormFields] = useState<string[]>([]);
  
  // Table Builder State
  const [tableRows, setTableRows] = useState<number>(2);
  const [tableCols, setTableCols] = useState<number>(3);

  // Animation State
  const [animDuration, setAnimDuration] = useState<number>(1);
  const [hoverColor, setHoverColor] = useState<string>('#3b82f6');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Assessment State
  const [questionVal, setQuestionVal] = useState<{q: string, a: string}>({q: '', a: ''});
  const [answer, setAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    generateQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const generateQuestion = () => {
    if (activeTab === 'form') {
      setQuestionVal({ q: "Which HTML tag creates a dropdown list in a form?", a: "select" });
    } else if (activeTab === 'table') {
      setQuestionVal({ q: "Which HTML tag is used for a table row?", a: "tr" });
    } else {
      setQuestionVal({ q: "What CSS property specifies how long an animation should take?", a: "transition" }); // simplified or transition-duration
    }
    setAnswer('');
    setIsCorrect(null);
  };

  const addField = (type: string) => {
    setFormFields(prev => [...prev, type]);
    addLog(`Added form field: ${type}`);
  };

  const clearForm = () => {
    setFormFields([]);
    addLog(`Cleared form`);
  };

  const checkAnswer = () => {
    if (answer.trim().toLowerCase().includes(questionVal.a.toLowerCase())) {
      setIsCorrect(true);
      addLog(`Assessment Passed for ${activeTab}`);
    } else {
      setIsCorrect(false);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const renderFormElement = (type: string, index: number) => {
    switch (type) {
      case 'text': return <input key={index} type="text" placeholder="Text Input" className="border p-2 rounded w-full" disabled />;
      case 'email': return <input key={index} type="email" placeholder="Email Input" className="border p-2 rounded w-full" disabled />;
      case 'date': return <input key={index} type="date" className="border p-2 rounded w-full" disabled />;
      case 'select': return (
        <select key={index} className="border p-2 rounded w-full" disabled>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      );
      case 'submit': return <button key={index} className="bg-blue-600 text-white p-2 rounded w-full font-bold">Submit</button>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Advanced HTML & CSS Web Builder" />

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          {/* Column 1: Theory */}
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-pink-600">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Theory: Forms, Tables & CSS</h2>
            </div>
            
            <div className="prose prose-sm text-slate-600 space-y-4">
              <h3 className="text-slate-800 font-semibold">HTML Forms</h3>
              <p>Forms are used to collect user input. Elements include <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, and <code>&lt;button&gt;</code>.</p>
              
              <h3 className="text-slate-800 font-semibold mt-4">HTML Tables</h3>
              <p>Tables organize data into rows and columns. Key tags:</p>
              <ul className="list-disc pl-5">
                <li><code>&lt;table&gt;</code>: Defines the table</li>
                <li><code>&lt;tr&gt;</code>: Table row</li>
                <li><code>&lt;th&gt;</code>: Table header cell</li>
                <li><code>&lt;td&gt;</code>: Table data cell</li>
              </ul>

              <h3 className="text-slate-800 font-semibold mt-4">CSS Transitions</h3>
              <p>Transitions provide a way to control animation speed when changing CSS properties. Instead of property changes taking effect immediately, you can cause the changes in a property to take place over a period of time.</p>
            </div>
          </div>

          {/* Column 2: Simulation/Builder */}
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <Layout className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Interactive Builder</h2>
            </div>

            <div className="flex gap-2 mb-4 border-b pb-2">
              <button 
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 rounded ${activeTab === 'form' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Travel Form
              </button>
              <button 
                onClick={() => setActiveTab('table')}
                className={`px-3 py-1 rounded ${activeTab === 'table' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Timetable
              </button>
              <button 
                onClick={() => setActiveTab('animation')}
                className={`px-3 py-1 rounded ${activeTab === 'animation' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                CSS Animation
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
              {activeTab === 'form' && (
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-100 p-3 rounded-lg text-sm flex gap-2 flex-wrap">
                    <button onClick={() => addField('text')} className="bg-slate-50 border px-2 py-1 rounded text-xs hover:bg-slate-50">+ Text Input</button>
                    <button onClick={() => addField('email')} className="bg-slate-50 border px-2 py-1 rounded text-xs hover:bg-slate-50">+ Email</button>
                    <button onClick={() => addField('date')} className="bg-slate-50 border px-2 py-1 rounded text-xs hover:bg-slate-50">+ Date</button>
                    <button onClick={() => addField('select')} className="bg-slate-50 border px-2 py-1 rounded text-xs hover:bg-slate-50">+ Select</button>
                    <button onClick={() => addField('submit')} className="bg-blue-100 border-blue-300 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200">+ Submit Button</button>
                    <button onClick={clearForm} className="bg-red-100 text-red-800 border-red-300 px-2 py-1 rounded text-xs hover:bg-red-200">Clear</button>
                  </div>
                  <div className="flex-1 border-2 border-dashed border-slate-300 rounded p-4 bg-slate-50 min-h-[200px] flex flex-col gap-3">
                    {formFields.length === 0 && <span className="text-slate-400 text-center mt-10">Add fields to build your form</span>}
                    {formFields.map((field, i) => renderFormElement(field, i))}
                  </div>
                </div>
              )}

              {activeTab === 'table' && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 bg-slate-100 p-3 rounded-lg">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-slate-600 block mb-1">Rows</label>
                      <input type="range" min="1" max="6" value={tableRows} onChange={e => { setTableRows(Number(e.target.value)); addLog(`Changed table rows to ${e.target.value}`); }} className="w-full" />
                      <div className="text-center text-xs">{tableRows}</div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-slate-600 block mb-1">Cols</label>
                      <input type="range" min="1" max="5" value={tableCols} onChange={e => { setTableCols(Number(e.target.value)); addLog(`Changed table cols to ${e.target.value}`); }} className="w-full" />
                      <div className="text-center text-xs">{tableCols}</div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto border rounded p-2 bg-slate-50">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {Array.from({length: tableCols}).map((_, i) => (
                            <th key={i} className="border border-slate-300 bg-slate-200 p-2 text-sm">Header {i+1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({length: tableRows}).map((_, r) => (
                          <tr key={r}>
                            {Array.from({length: tableCols}).map((_, c) => (
                              <td key={c} className="border border-slate-200 p-2 text-sm text-center">Cell {r+1},{c+1}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'animation' && (
                <div className="flex flex-col gap-4 h-full">
                  <div className="bg-slate-100 p-3 rounded-lg grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Duration ({animDuration}s)</label>
                      <input type="range" min="0.1" max="3" step="0.1" value={animDuration} onChange={e => { setAnimDuration(Number(e.target.value)); addLog(`Changed anim duration to ${e.target.value}s`); }} className="w-full" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Hover Color</label>
                      <input type="color" value={hoverColor} onChange={e => { setHoverColor(e.target.value); addLog(`Changed hover color to ${e.target.value}`); }} className="w-full h-8 cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="flex-1 border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50 p-8">
                    <div 
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="w-40 h-40 flex items-center justify-center text-white font-bold text-xl rounded-xl shadow-lg cursor-pointer"
                      style={{
                        backgroundColor: isHovered ? hoverColor : '#1e293b',
                        transition: `background-color ${animDuration}s ease-in-out, transform ${animDuration}s ease-in-out`,
                        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
                      }}
                    >
                      Hover Me!
                    </div>
                  </div>
                  <div className="bg-slate-800 text-green-400 p-3 rounded font-mono text-xs">
                    <code>
                      .box {'{'}<br/>
                      &nbsp;&nbsp;transition: all {animDuration}s ease-in-out;<br/>
                      &nbsp;&nbsp;background-color: #1e293b;<br/>
                      {'}'}<br/>
                      .box:hover {'{'}<br/>
                      &nbsp;&nbsp;background-color: {hoverColor};<br/>
                      &nbsp;&nbsp;transform: scale(1.1) rotate(5deg);<br/>
                      {'}'}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Analysis/Assessment */}
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <Activity className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Assessment & Logs</h2>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6">
              <h3 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Knowledge Check
              </h3>
              <p className="text-sm text-slate-700 mb-3">
                {questionVal.q}
              </p>
              <div className="flex gap-2 flex-col">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="border rounded px-3 py-2 flex-1 outline-none focus:border-emerald-400 text-sm"
                  placeholder="Type your answer..."
                />
                <button
                  onClick={checkAnswer}
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Verify
                </button>
              </div>
              {isCorrect !== null && (
                <div className={`mt-3 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="font-medium text-sm">{isCorrect ? 'Correct! Good job.' : 'Incorrect, try again.'}</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="font-medium text-slate-700 mb-2">Activity Tracker</h3>
              <div className="flex-1 bg-slate-50 border rounded p-3 overflow-y-auto text-sm font-mono text-slate-600">
                {logs.length === 0 && <span className="text-slate-400">No actions recorded.</span>}
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
