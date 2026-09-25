import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '../../../components/common/Button.jsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer.jsx';
import { courseApi } from '../../../services/api.js';

export function LearningPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.details(courseId)
      .then((data) => {
        setCourse(data.course);
        if (data.course.lessons && data.course.lessons.length > 0) {
          setActiveLesson(data.course.lessons[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return <div className="py-20 text-center font-bold text-gray-500">Loading course material...</div>;
  }

  if (!course) {
    return <div className="py-20 text-center font-bold text-red-500">Course not found</div>;
  }

  const activeIndex = course.lessons?.findIndex(l => l._id === activeLesson?._id) ?? 0;

  const handleNext = () => {
    if (activeIndex < (course.lessons?.length || 0) - 1) {
      setActiveLesson(course.lessons[activeIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveLesson(course.lessons[activeIndex - 1]);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-950">{course.title}</h1>
        <p className="mt-2 text-gray-600">Learning page with video, notes, progress, and lesson navigation.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <VideoPlayer src={activeLesson?.videoUrl} />
          
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-950 text-xl">{activeLesson?.title || 'No Lesson Selected'}</h2>
            </div>
            
            <h2 className="font-bold text-gray-800">Notes Section</h2>
            <textarea className="mt-4 min-h-36 w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Write lesson notes..." />
            
            <div className="mt-4 flex justify-between">
              <Button variant="secondary" onClick={handlePrev} disabled={activeIndex === 0}>
                <ArrowLeft size={18} /> Previous Lesson
              </Button>
              <Button onClick={handleNext} disabled={activeIndex === (course.lessons?.length || 0) - 1}>
                Next Lesson <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-fit">
          <h2 className="font-black text-gray-950 mb-4">Lesson Contents</h2>
          
          <div className="grid gap-2">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, index) => (
                <button 
                  key={lesson._id || index} 
                  onClick={() => setActiveLesson(lesson)}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                    activeLesson?._id === lesson._id 
                      ? 'border-blue-600 bg-blue-50 text-blue-800' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 rounded-full p-1 ${
                    activeLesson?._id === lesson._id ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <PlayCircle size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">{index + 1}. {lesson.title}</span>
                    <span className="text-xs font-semibold opacity-70">{lesson.duration}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center border rounded-xl bg-gray-50 border-gray-200">No lessons available yet.</p>
            )}
          </div>
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Progress Tracking</span>
              <span>{course.lessons?.length > 0 ? Math.round(((activeIndex + 1) / course.lessons.length) * 100) : 0}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div 
                className="h-full rounded-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${course.lessons?.length > 0 ? ((activeIndex + 1) / course.lessons.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
