import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/common/Button.jsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer.jsx';
import { courses } from '../../../data/platformData.js';

export function LearningPage() {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === courseId) || courses[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-950">{course.title}</h1>
        <p className="mt-2 text-gray-600">Learning page with video, notes, progress, and lesson navigation.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <VideoPlayer />
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-black text-gray-950">Notes Section</h2>
            <textarea className="mt-4 min-h-36 w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Write lesson notes..." />
            <div className="mt-4 flex justify-between">
              <Button variant="secondary"><ArrowLeft size={18} /> Previous Lesson</Button>
              <Button>Next Lesson <ArrowRight size={18} /></Button>
            </div>
          </div>
        </div>
        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-black text-gray-950">Lesson Sidebar</h2>
          <div className="mt-4 grid gap-2">
            {course.lessons.map((lesson, index) => (
              <button key={lesson} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${index === 0 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                {index + 1}. {lesson}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm font-semibold text-gray-600"><span>Progress Tracking</span><span>68%</span></div>
            <div className="mt-2 h-2 rounded-full bg-gray-100"><div className="h-full w-[68%] rounded-full bg-blue-600" /></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
