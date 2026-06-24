import { useState, useMemo } from 'react';
import { Plus, Trash2, PieChart, LayoutList, CheckCircle2, BarChart3, Edit3 } from 'lucide-react';
import LabHeader from './LabHeader';

interface Question {
  id: string;
  type: 'text' | 'choice';
  text: string;
}

export default function LabCS11Research({ onExit }: { onExit?: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', type: 'choice', text: 'How often do you use e-health apps?' }
  ]);
  const [view, setView] = useState<'form' | 'dashboard'>('form');
  
  const [q1, setQ1] = useState('');
  const [validationResult, setValidationResult] = useState<{message: string, pass: boolean} | null>(null);

  const addQuestion = (type: 'text' | 'choice') => {
    setQuestions([...questions, { id: Math.random().toString(), type, text: type === 'choice' ? 'New Multiple Choice Question' : 'New Text Question' }]);
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const mockData = useMemo(() => {
    return [
      { label: 'Daily', value: 45 },
      { label: 'Weekly', value: 30 },
      { label: 'Rarely', value: 15 },
      { label: 'Never', value: 10 }
    ];
  }, []);

  const validateAssessment = () => {
    if (questions.length < 3) {
      setValidationResult({ message: 'Your form needs at least 3 questions.', pass: false });
      return;
    }
    const hasChoice = questions.some(q => q.type === 'choice');
    const hasText = questions.some(q => q.type === 'text');
    if (!hasChoice || !hasText) {
      setValidationResult({ message: 'Include both Text and Choice questions.', pass: false });
      return;
    }
    if (!q1.toLowerCase().includes('leading') && !q1.toLowerCase().includes('bias')) {
      setValidationResult({ message: 'Consider how question phrasing affects respondents (e.g., bias, leading).', pass: false });
      return;
    }
    setValidationResult({ message: 'Great job! You designed a balanced survey and understand potential biases.', pass: true });
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab: Research & Data Visualization" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. UI & Survey Design</h2>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            In software engineering, understanding user needs through rigorous research is crucial. A survey is a primary tool for quantitative and qualitative data collection.
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
            <h3 className="font-semibold text-indigo-800 mb-2">Key Principles:</h3>
            <ul className="list-disc list-inside text-sm text-indigo-900 space-y-1">
              <li><strong>Avoid Bias:</strong> Do not ask leading questions.</li>
              <li><strong>Mix Types:</strong> Use closed (multiple choice) for quantitative data and open (text) for qualitative contexts.</li>
              <li><strong>Visual Hierarchy:</strong> Present data using appropriate charts to highlight actionable insights.</li>
            </ul>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            Switch to the <strong>Dashboard Builder</strong> to see how raw data from your survey is converted into an interactive infographic to present to stakeholders.
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">2. Research Workspace</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setView('form')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'form' ? 'bg-slate-50 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutList size={16} className="mr-2" /> Form Builder
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-slate-50 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <PieChart size={16} className="mr-2" /> Dashboard
              </button>
            </div>
          </div>

          {view === 'form' ? (
            <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2">
              {questions.map((q, index) => (
                <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question {index + 1} ({q.type})</span>
                    <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-md px-3 py-2">
                    <Edit3 size={16} className="text-slate-400 mr-2" />
                    <input 
                      type="text" 
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, e.target.value)}
                      className="flex-1 outline-none text-sm text-slate-800"
                      placeholder="Type your question here..."
                    />
                  </div>
                  {q.type === 'choice' && (
                    <div className="mt-3 pl-8 space-y-2">
                      <div className="flex items-center text-sm text-slate-500"><div className="w-4 h-4 rounded-full border border-slate-400 mr-2"></div> Option 1</div>
                      <div className="flex items-center text-sm text-slate-500"><div className="w-4 h-4 rounded-full border border-slate-400 mr-2"></div> Option 2</div>
                    </div>
                  )}
                  {q.type === 'text' && (
                    <div className="mt-3 pl-8">
                      <div className="border-b border-slate-300 w-full h-8"></div>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex space-x-3 pt-4">
                <button onClick={() => addQuestion('choice')} className="flex-1 bg-indigo-50 text-indigo-600 border border-indigo-200 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <Plus size={16} className="mr-1" /> Add Choice
                </button>
                <button onClick={() => addQuestion('text')} className="flex-1 bg-slate-50 text-slate-600 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <Plus size={16} className="mr-1" /> Add Text
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-slate-200 p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold text-slate-800 w-full text-left mb-6 flex items-center">
                <BarChart3 className="mr-2 text-indigo-500" /> Responses: Question 1
              </h3>
              
              <div className="w-full h-64 flex items-end justify-around space-x-2 pb-8 border-b-2 border-slate-300 relative">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 -ml-4 py-8">
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                
                {mockData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="w-full relative flex justify-center items-end h-full">
                      <div 
                        className="w-16 bg-indigo-500 rounded-t-md transition-all duration-1000 ease-out group-hover:bg-indigo-400"
                        style={{ height: `${(data.value / 50) * 100}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.value}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 mt-2 truncate w-full text-center">{data.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm text-slate-500 italic text-center">
                This infographic auto-generates based on aggregate user responses to provide a quick summary for product managers.
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">3. Analysis & Logic</h2>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Task 1: Form Structure</label>
              <p className="text-xs text-slate-500 mb-2">Construct a survey containing at least 3 questions, mixing both "Choice" and "Text" types.</p>
              <div className="flex items-center text-sm">
                {questions.length >= 3 && questions.some(q=>q.type === 'choice') && questions.some(q=>q.type === 'text') ? (
                   <span className="text-green-600 flex items-center font-medium"><CheckCircle2 size={16} className="mr-1" /> Structure complete</span>
                ) : (
                   <span className="text-amber-500 flex items-center font-medium"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Pending requirements...</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Task 2: Qualitative Analysis</label>
              <p className="text-xs text-slate-500 mb-2">What is a critical risk when writing survey questions that might skew your data unreliably?</p>
              <textarea 
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                placeholder="E.g., Leading questions can introduce..."
              />
            </div>
            
            <button 
              onClick={validateAssessment}
              className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors shadow-sm"
            >
              Verify Implementation
            </button>

            {validationResult && (
              <div className={`p-4 rounded-lg border text-sm ${validationResult.pass ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="flex items-start">
                  <span className="mt-0.5 mr-2">{validationResult.pass ? '✅' : '❌'}</span>
                  <span>{validationResult.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
