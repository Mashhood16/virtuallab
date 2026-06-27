import { useParams, Link } from 'react-router-dom';
import { formatSubject } from '../data/labModules';

export default function Breadcrumbs() {
  const { classId, subjectId } = useParams();

  return (
    <div className="inline-flex items-center gap-2 text-sm mb-6 bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm">
      <Link to="/" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">Home</Link>
      {classId && (
        <>
          <span className="text-slate-300">/</span>
          <Link to={`/class/${classId}`} className={`transition-colors font-semibold ${!subjectId ? 'text-slate-800 dark:text-slate-200 cursor-default pointer-events-none' : 'text-indigo-600 hover:text-indigo-700'}`}>Class {classId}</Link>
        </>
      )}
      {subjectId && (
        <>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{formatSubject(subjectId)}</span>
        </>
      )}
    </div>
  );
}
