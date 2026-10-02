import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PlayCircle, Star, CheckCircle, MessageSquare, FileText } from 'lucide-react';
import { Button } from '../../../components/common/Button.jsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer.jsx';
import { courseApi, enrollmentApi } from '../../../services/api.js';
import courseService from '../../../services/courseService.js';

function QuizView({ quiz, courseId, onQuizComplete }) {
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');
  const submittedRef = useRef(false);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(clock);
  }, []);

  const isNotOpen = quiz.startsAt && now < new Date(quiz.startsAt).getTime();
  const isClosed = quiz.endsAt && now > new Date(quiz.endsAt).getTime();

  const submitAttempt = useCallback(async () => {
    if (!attempt || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setError('');
    try {
      const answerList = attempt.questions.map((_, index) => answers[index] ?? null);
      const attemptResult = await courseApi.submitQuizAttempt(courseId, quiz._id, attempt.attemptId, answerList);
      setResult(attemptResult);
      onQuizComplete?.();
    } catch (apiError) {
      submittedRef.current = false;
      setError(apiError.message || 'Unable to submit this attempt.');
    } finally {
      setSubmitting(false);
    }
  }, [answers, attempt, courseId, onQuizComplete, quiz._id]);

  useEffect(() => {
    if (!attempt?.deadlineAt || result) return undefined;
    const timer = window.setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.ceil((new Date(attempt.deadlineAt).getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [attempt, result]);

  useEffect(() => {
    if (remainingSeconds === 0 && !result) submitAttempt();
  }, [remainingSeconds, result, submitAttempt]);

  const startAttempt = async () => {
    setError('');
    setSubmitting(true);
    try {
      const started = await courseApi.startQuizAttempt(courseId, quiz._id);
      if (!Array.isArray(started?.questions) || started.questions.some((question) => !Array.isArray(question.options))) {
        throw new Error('The quiz could not be loaded. Refresh the page and try again.');
      }
      submittedRef.current = false;
      setAnswers({});
      setResult(null);
      setAttempt(started);
      setRemainingSeconds(started.deadlineAt
        ? Math.max(0, Math.ceil((new Date(started.deadlineAt).getTime() - Date.now()) / 1000))
        : null);
    } catch (apiError) {
      setError(apiError.message || 'Unable to start this quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.questions) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-black text-gray-950 mb-4">{quiz.title} · Attempt {result.attemptNumber}</h2>
        <div className={`mb-6 rounded-xl border p-4 text-lg font-black ${result.passed ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
          {result.passed ? 'Passed' : 'Not passed'} · {result.score} / {result.totalMarks} marks · {result.percentage}% (pass mark {result.passMark}%)
        </div>
        <div className="space-y-6">
          {result.questions.map((question, index) => (
            <div key={question._id || index} className={`p-5 rounded-xl border ${question.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
              <p className="font-bold text-gray-900 mb-3">{index + 1}. {question.questionText} ({question.marks} marks)</p>
              <p className="text-sm font-semibold">Your answer: {question.selectedAnswerIndex === null ? 'No answer' : question.options[question.selectedAnswerIndex]}</p>
              <p className="mt-1 text-sm font-bold text-green-700">Correct answer: {question.options[question.correctAnswerIndex]}</p>
            </div>
          ))}
        </div>
        {result.status === 'timed-out' && <p className="mt-5 text-sm font-semibold text-amber-800">This attempt was submitted after its time limit.</p>}
      </div>
    );
  }

  if (!attempt) {
    const totalMarks = quiz.questions.reduce((sum, question) => sum + Number(question.marks || 1), 0);
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-gray-950">{quiz.title}</h2>
        <p className="mt-3 text-sm text-gray-600">{quiz.questions.length} questions · {totalMarks} marks · Pass mark {quiz.passMark ?? 50}%</p>
        <p className="mt-1 text-sm text-gray-600">Time limit: {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} minutes` : 'None'} · Attempts: {quiz.attemptLimit || 'Unlimited'}</p>
        {quiz.startsAt && <p className="mt-1 text-sm text-gray-600">Opens {new Date(quiz.startsAt).toLocaleString()}</p>}
        {quiz.endsAt && <p className="mt-1 text-sm text-gray-600">Closes {new Date(quiz.endsAt).toLocaleString()}</p>}
        {isNotOpen && <p className="mt-3 text-sm font-semibold text-amber-700">This quiz has not opened yet.</p>}
        {isClosed && <p className="mt-3 text-sm font-semibold text-red-700">This quiz submission window has ended.</p>}
        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <Button className="mt-5" onClick={startAttempt} disabled={submitting || isNotOpen || isClosed}>
          {submitting ? 'Starting...' : 'Start Quiz'}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-950">{quiz.title}</h2>
          <p className="mt-1 text-sm text-gray-600">Attempt {attempt.attemptNumber}</p>
        </div>
        {remainingSeconds !== null && <p aria-live="polite" className={`font-mono text-lg font-black ${remainingSeconds < 60 ? 'text-red-700' : 'text-gray-800'}`}>
          {Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:{(remainingSeconds % 60).toString().padStart(2, '0')}
        </p>}
      </div>
      {error && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      <form onSubmit={(event) => { event.preventDefault(); submitAttempt(); }} className="space-y-6">
        {attempt.questions.map((question, questionIndex) => (
          <fieldset key={question._id || questionIndex} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <legend className="px-1 font-bold text-gray-900">{questionIndex + 1}. {question.questionText} <span className="text-xs font-semibold text-gray-500">({question.marks} marks)</span></legend>
            <div className="mt-3 space-y-2">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-teal-700">
                  <input type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))} disabled={submitting || remainingSeconds === 0} className="h-4 w-4 text-teal-700" />
                  <span className="font-semibold text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </Button>
      </form>
    </div>
  );
}

export function LearningPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeItem, setActiveItem] = useState(null); // { type: 'lesson' | 'quiz', data: any }
  const [enrollment, setEnrollment] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [ratingError, setRatingError] = useState('');

  const fetchDetails = () => {
    courseApi.details(courseId)
      .then(async (data) => {
        setCourse(data.course);
        if (!activeItem) {
          if (data.course.lessons?.length > 0) {
            setActiveItem({ type: 'lesson', data: data.course.lessons[0] });
          } else if (data.course.quizzes?.length > 0) {
            setActiveItem({ type: 'quiz', data: data.course.quizzes[0] });
          }
        }
        try {
          const enrollData = await enrollmentApi.checkStatus(courseId);
          setEnrollment(enrollData.data || enrollData);
        } catch (e) { console.error('Not enrolled or error fetching enrollment', e); }
        try {
          setQuizAttempts(await courseApi.studentQuizAttempts());
        } catch (e) { console.error('Unable to load quiz attempts', e); }
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

  const allItems = [
    ...(course.lessons || []).map(l => ({ type: 'lesson', data: l })),
    ...(course.quizzes || []).map(q => ({ type: 'quiz', data: q }))
  ];

  const activeIndex = allItems.findIndex(i => i.data._id === activeItem?.data?._id) ?? 0;
  const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor;

  const handleNext = () => {
    if (activeItem?.type === 'lesson') {
      handleMarkComplete(activeItem.data._id);
    }
    if (activeIndex < allItems.length - 1) {
      setActiveItem(allItems[activeIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveItem(allItems[activeIndex - 1]);
    }
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      await enrollmentApi.markLessonComplete(courseId, lessonId);
      fetchDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const completedQuizIds = new Set([
    ...(enrollment?.quizResults || []).map((result) => String(result.quizId)),
    ...quizAttempts
      .filter((attempt) => String(attempt.course?._id || attempt.course) === String(course._id))
      .map((attempt) => String(attempt.quizId))
  ]);
  const completedQuizzesCount = completedQuizIds.size;
  const completedLessonsCount = enrollment?.completedLessons?.length || 0;
  const totalItems = allItems.length;
  let progressPercent = 0;
  if (totalItems > 0) {
    let completedItemsCount = completedLessonsCount + completedQuizzesCount;
    progressPercent = Math.round(Math.min((completedItemsCount / totalItems) * 100, 100));
  }

  return (
    <div className="pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-950">{course.title}</h1>
        <p className="mt-2 text-gray-600 font-medium">Instructor: <span className="font-bold text-gray-900">{instructorName || 'SkillShare Educator'}</span></p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {activeItem?.type === 'lesson' ? (
            <>
              <VideoPlayer 
                src={activeItem.data.videoUrl} 
                onEnded={() => handleMarkComplete(activeItem.data._id)}
              />
              
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-black text-gray-950 text-xl">{activeItem.data.title || 'No Lesson Selected'}</h2>
                </div>
                
                <h3 className="font-bold text-gray-800">Lesson Notes</h3>
                <textarea className="mt-3 min-h-28 w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Write lesson notes..." />
                
                <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
                  <Button variant="secondary" onClick={handlePrev} disabled={activeIndex === 0}>
                    <ArrowLeft size={18} /> Previous
                  </Button>
                  
                  {enrollment?.completedLessons?.includes(activeItem.data._id) ? (
                     <div className="flex items-center gap-2 font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                       <CheckCircle size={18} /> Completed
                     </div>
                  ) : (
                     <Button onClick={() => handleMarkComplete(activeItem.data._id)}>
                       Mark as Complete
                     </Button>
                  )}

                  <Button onClick={handleNext} disabled={activeIndex === allItems.length - 1}>
                    Next <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : activeItem?.type === 'quiz' ? (
            <QuizView quiz={activeItem.data} courseId={course._id} onQuizComplete={fetchDetails} />
          ) : (
            <div className="p-10 text-center bg-gray-50 rounded-2xl border font-bold text-gray-500">No content selected</div>
          )}

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
          <h2 className="font-black text-gray-950 mb-4">Course Contents</h2>
          
          <div className="grid gap-2">
            {allItems.length > 0 ? (
              allItems.map((item, index) => {
                const isQuiz = item.type === 'quiz';
                const isActive = activeItem?.data?._id === item.data._id;
                let isCompleted = false;
                if (isQuiz) {
                  isCompleted = completedQuizIds.has(String(item.data._id));
                } else {
                  isCompleted = enrollment?.completedLessons?.includes(item.data._id);
                }
                
                return (
                  <button 
                    key={item.data._id || index} 
                    onClick={() => setActiveItem(item)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isActive 
                        ? 'border-blue-600 bg-blue-50 text-blue-800' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 rounded-full p-1 ${
                      isActive ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isQuiz ? <FileText size={14} /> : <PlayCircle size={14} />}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold block">{index + 1}. {item.data.title}</span>
                      <span className="text-xs font-semibold opacity-70">{isQuiz ? 'Quiz' : item.data.duration || 'Video'}</span>
                    </div>
                    {isCompleted && (
                      <CheckCircle size={14} className="text-green-600 mt-1" />
                    )}
                  </button>
                )
              })
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center border rounded-xl bg-gray-50 border-gray-200">No content available yet.</p>
            )}
          </div>
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Progress Tracking</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div 
                className="h-full rounded-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
