import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PlayCircle, Star, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '../../../components/common/Button.jsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer.jsx';
import { courseApi } from '../../../services/api.js';
import courseService from '../../../services/courseService.js';

export function LearningPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rating and review state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [ratingError, setRatingError] = useState('');

  const fetchDetails = () => {
    courseApi.details(courseId)
      .then((data) => {
        setCourse(data.course);
        if (data.course.lessons && data.course.lessons.length > 0 && !activeLesson) {
          setActiveLesson(data.course.lessons[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetails();
  }, [courseId]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setSubmittingRating(true);
    setRatingSuccess('');
    setRatingError('');

    try {
      const realCourseId = course._id || courseId;
      await courseService.addReview(realCourseId, { rating, comment });
      setRatingSuccess('Thank you! Your rating and feedback for this course and teacher have been submitted successfully.');
      setComment('');
      fetchDetails();
    } catch (err) {
      setRatingError(err.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-bold text-gray-500">Loading course material...</div>;
  }

  if (!course) {
    return <div className="py-20 text-center font-bold text-red-500">Course not found</div>;
  }

  const activeIndex = course.lessons?.findIndex(l => l._id === activeLesson?._id) ?? 0;
  const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor;

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
    <div className="pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-950">{course.title}</h1>
        <p className="mt-2 text-gray-600 font-medium">Instructor: <span className="font-bold text-gray-900">{instructorName || 'SkillShare Educator'}</span></p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <VideoPlayer src={activeLesson?.videoUrl} />
          
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-950 text-xl">{activeLesson?.title || 'No Lesson Selected'}</h2>
            </div>
            
            <h3 className="font-bold text-gray-800">Lesson Notes</h3>
            <textarea className="mt-3 min-h-28 w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Write lesson notes..." />
            
            <div className="mt-4 flex justify-between">
              <Button variant="secondary" onClick={handlePrev} disabled={activeIndex === 0}>
                <ArrowLeft size={18} /> Previous Lesson
              </Button>
              <Button onClick={handleNext} disabled={activeIndex === (course.lessons?.length || 0) - 1}>
                Next Lesson <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          {/* Rate Course & Teacher Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-950 flex items-center gap-2 mb-2">
              <Star size={20} className="fill-amber-500 text-amber-500" /> Rate Course &amp; Teacher
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Share your feedback for <span className="font-bold text-gray-900">{instructorName || 'this instructor'}</span> and help fellow students!
            </p>

            {ratingSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-700 border border-green-200">
                <CheckCircle size={18} /> {ratingSuccess}
              </div>
            )}

            {ratingError && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-200">
                {ratingError}
              </div>
            )}

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Select Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={`${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-500 text-amber-500 scale-110'
                            : 'text-gray-300'
                        } transition duration-150`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-bold text-amber-600">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Write Review / Feedback</label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked about the instructor's teaching style, explanations, and course content..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingRating}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
              >
                {submittingRating ? 'Submitting Review...' : 'Submit Rating & Review'}
              </button>
            </form>
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
