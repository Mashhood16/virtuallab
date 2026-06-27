import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
  onExit?: () => void;
}

type Region = 'unassigned' | 'math' | 'science' | 'both' | 'neither';

interface Student {
  id: string;
  name: string;
  likesMath: boolean;
  likesScience: boolean;
  region: Region;
}

const initialStudents: Student[] = [
  { id: '1', name: 'Alice', likesMath: true, likesScience: false, region: 'unassigned' },
  { id: '2', name: 'Bob', likesMath: false, likesScience: true, region: 'unassigned' },
  { id: '3', name: 'Charlie', likesMath: true, likesScience: true, region: 'unassigned' },
  { id: '4', name: 'Diana', likesMath: false, likesScience: false, region: 'unassigned' },
  { id: '5', name: 'Eve', likesMath: true, likesScience: false, region: 'unassigned' },
  { id: '6', name: 'Frank', likesMath: false, likesScience: true, region: 'unassigned' },
];

export default function LabM9SetsRelations({ onExit }: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('studentId', id);
  };

  const handleDrop = (e: React.DragEvent, region: Region) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('studentId');
    setStudents(prev => prev.map(s => s.id === id ? { ...s, region } : s));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Assessment
  const [nA, setNA] = useState(0);
  const [nB, setNB] = useState(0);
  const [nIntersect, setNIntersect] = useState(0);
  const [qAns, setQAns] = useState("");
  const [qStatus, setQStatus] = useState<null | boolean>(null);
  const [qExpected, setQExpected] = useState(0);

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 10;
    const b = Math.floor(Math.random() * 10) + 10;
    const inter = Math.floor(Math.random() * 5) + 2;
    setNA(a);
    setNB(b);
    setNIntersect(inter);
    setQExpected(a + b - inter);
  }, []);

  const checkAnswer = () => setQStatus(Number(qAns) === qExpected);

  const getCorrectRegion = (s: Student) => {
    if (s.likesMath && s.likesScience) return 'both';
    if (s.likesMath) return 'math';
    if (s.likesScience) return 'science';
    return 'neither';
  };

  const isAllCorrect = students.every(s => s.region === getCorrectRegion(s)) && students.every(s => s.region !== 'unassigned');

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none text-slate-800 dark:text-slate-100">
        <LabHeader onExit={onExit} title="Grade 9 Math: Sets & Venn Diagrams" />
      

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Theory Column */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200 dark:border-slate-700 dark:border-slate-500">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2">Theory: Overlapping Sets</h2>
          
          <div className="prose prose-slate">
            <h3 className="text-lg font-semibold text-purple-700">What is a Set?</h3>
            <p className="text-slate-600 dark:text-slate-300">
              A set is a collection of distinct objects. In a Venn Diagram, sets are represented by overlapping circles.
            </p>
            
            <h3 className="text-lg font-semibold text-purple-700 mt-4">Key Operations</h3>
            <ul className="text-slate-600 dark:text-slate-300 list-disc pl-5">
              <li><strong>Intersection (A ∩ B):</strong> Elements that belong to BOTH sets. The overlapping middle section.</li>
              <li><strong>Union (A ∪ B):</strong> Elements that belong to set A, set B, or both.</li>
              <li><strong>Complement (A'):</strong> Elements outside of set A.</li>
            </ul>

            <h3 className="text-lg font-semibold text-purple-700 mt-4">The Union Formula</h3>
            <p className="text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm text-center">
              n(A ∪ B) = n(A) + n(B) - n(A ∩ B)
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
              We subtract the intersection once because it was counted twice (once in A and once in B).
            </p>
          </div>
        </div>

        {/* Interactive Simulator */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-slate-700 dark:border-slate-500">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2 flex items-center gap-2">
            <Users className="text-purple-600" /> Survey Categorizer
          </h2>
          
          {/* Unassigned Area */}
          <div className="min-h-[80px] bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Drag Students to Categorize</div>
            <div className="flex flex-wrap gap-2">
              {students.filter(s => s.region === 'unassigned').map(s => (
                <div
                  key={s.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, s.id)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 shadow-sm rounded-md cursor-grab active:cursor-grabbing text-sm font-medium hover:bg-slate-50 dark:bg-slate-900 transition-colors"
                >
                  {s.name} ({s.likesMath ? 'M' : ''}{s.likesMath && s.likesScience ? ', ' : ''}{s.likesScience ? 'S' : ''}{!s.likesMath && !s.likesScience ? 'None' : ''})
                </div>
              ))}
              {students.filter(s => s.region === 'unassigned').length === 0 && (
                <span className="text-slate-400 italic text-sm py-1">All students categorized!</span>
              )}
            </div>
          </div>

          {/* Venn Diagram Area */}
          <div className="relative w-full h-80 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center overflow-hidden">
            
            {/* Left Circle - Math */}
            <div 
              className="absolute w-56 h-56 rounded-full border-4 border-blue-400 bg-blue-100/40 flex flex-col items-start justify-center p-6 -translate-x-16 transition-colors hover:bg-blue-200/50"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'math')}
            >
              <span className="text-sm font-bold text-blue-800 absolute top-6 left-6">Math Only</span>
              <div className="flex flex-col gap-1 w-full mt-4 items-start">
                {students.filter(s => s.region === 'math').map(s => (
                  <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-slate-900/90 border border-blue-300 px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
                ))}
              </div>
            </div>

            {/* Right Circle - Science */}
            <div 
              className="absolute w-56 h-56 rounded-full border-4 border-green-400 bg-green-100/40 flex flex-col items-end justify-center p-6 translate-x-16 transition-colors hover:bg-green-200/50"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'science')}
            >
              <span className="text-sm font-bold text-green-800 absolute top-6 right-6">Science Only</span>
              <div className="flex flex-col gap-1 w-full mt-4 items-end">
                {students.filter(s => s.region === 'science').map(s => (
                  <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-slate-900/90 border border-green-300 px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
                ))}
              </div>
            </div>

            {/* Intersection - Both */}
            <div 
              className="absolute w-24 h-48 flex flex-col items-center justify-center z-10 rounded-3xl transition-colors hover:bg-purple-200/40"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'both')}
            >
              <span className="text-sm font-bold text-purple-900 absolute top-2">Both</span>
              <div className="flex flex-col gap-1 w-full mt-6 items-center">
                {students.filter(s => s.region === 'both').map(s => (
                  <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-slate-900/90 border border-purple-300 px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
                ))}
              </div>
            </div>

            {/* Neither Container */}
            <div 
              className="absolute bottom-3 right-3 w-32 h-32 border-2 border-dashed border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-800/80 flex flex-col items-center p-3 rounded-lg transition-colors hover:bg-slate-200 dark:bg-slate-800"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'neither')}
            >
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Neither</span>
              <div className="flex flex-wrap justify-center gap-1 overflow-y-auto">
                {students.filter(s => s.region === 'neither').map(s => (
                  <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Data & Assessment */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-slate-700 dark:border-slate-500">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2">Analysis & Assessment</h2>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 border rounded-lg p-4 flex flex-col justify-center items-center text-center">
            {isAllCorrect ? (
              <div className="text-green-600 flex flex-col items-center gap-2">
                <CheckCircle size={48} />
                <h3 className="font-bold text-lg">Diagram Complete!</h3>
                <p className="text-sm">You have correctly categorized all students.</p>
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400">
                Categorize all students correctly to complete the diagram.
              </div>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-bold text-purple-800 mb-2">Word Problem</h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
              In a class survey, n(Math) = {nA} and n(Science) = {nB}. 
              If n(Math ∩ Science) = {nIntersect}, how many students like <b>at least one</b> of the subjects (n(Math ∪ Science))?
            </p>
            <div className="flex gap-2">
              <input 
                type="number" value={qAns} onChange={(e) => setQAns(e.target.value)}
                className="flex-1 border rounded px-2 py-1 outline-none focus:border-purple-400"
                placeholder="Total union..."
              />
              <button onClick={checkAnswer} className="px-3 bg-purple-600 text-white rounded font-bold hover:bg-purple-700">Check</button>
            </div>
            {qStatus !== null && (
              <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${qStatus ? 'text-green-600' : 'text-red-500'}`}>
                {qStatus ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {qStatus ? 'Correct! n(A∪B) = n(A) + n(B) - n(A∩B)' : 'Incorrect. Use the Union formula!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
