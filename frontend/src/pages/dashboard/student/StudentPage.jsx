import { useEffect, useState } from 'react';
import { Award, BookOpen, Clock, ExternalLink, Heart, Printer, Settings } from 'lucide-react';
import { CourseCard } from '../../../components/common/CourseCard.jsx';
import { DashboardCard } from '../../../components/common/DashboardCard.jsx';
import { FormInput } from '../../../components/common/FormInput.jsx';
import { Toast } from '../../../components/common/Toast.jsx';
import { courses as mockCourses } from '../../../data/platformData.js';
import { useCourse } from '../../../context/CourseContext.jsx';
import { useAuth } from '../../../context/useAuth.js';
import { authApi, certificateApi, courseApi } from '../../../services/api.js';
import { Link } from 'react-router-dom';
import { StudyCalendar } from '../../../components/dashboard/StudyCalendar.jsx';

export function StudentPage({ title, view }) {
  const { user } = useAuth();
  const { myCourses, fetchMyCourses, unenrollFromCourse } = useCourse();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchMyCourses()
      .catch((apiError) => setError(apiError.message))
      .finally(() => setLoading(false));
  }, [fetchMyCourses]);

  const handleUnenroll = async (courseId) => {
    const confirmed = window.confirm('Are you sure you want to unenroll from this course? This will completely remove your access and progress records.');
    if (!confirmed) return;

    setLoading(true);
    try {
      await unenrollFromCourse(courseId);
    } catch (apiError) {
      setError(apiError.message || 'Failed to unenroll');
    } finally {
      setLoading(false);
    }
  };

  const displayedCourses = myCourses || [];

  return (
    <div>
      <PageHeader title={title} />
      {loading && <p className="mb-4 text-sm font-semibold text-gray-500">Processing courses data...</p>}
      {error && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">Notice: {error}</p>}
      
      {view === 'overview' && <Overview myCourses={displayedCourses} />}
      {view === 'courses' && <CourseGrid courses={displayedCourses} title="My Enrolled Courses" onUnenroll={handleUnenroll} />}
      {view === 'quiz-results' && <StudentQuizResults />}
      {view === 'wishlist' && <CourseGrid courses={mockCourses.slice(1, 3)} title="Wishlist" onUnenroll={() => {}} />}
      {view === 'certificates' && <Certificates />}
      {view === 'notifications' && <Notifications />}
      {view === 'profile' && <Profile initialUser={user} />}
    </div>
  );
}

function PageHeader({ title }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-gray-950">{title}</h1>
      <p className="mt-2 text-gray-600">Student workspace. You can still browse public courses normally using the top menu bar.</p>
    </div>
  );
}

function Overview({ myCourses }) {
  const averageProgress = myCourses.length 
    ? Math.round(myCourses.reduce((sum, item) => sum + (item.progress || 0), 0) / myCourses.length) 
    : 0;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard icon={BookOpen} label="Enrolled Courses" value={myCourses.length} />
        <DashboardCard icon={Clock} label="Average Progress" value={`${averageProgress}%`} />
        <DashboardCard icon={Award} label="Certificates Earned" value={myCourses.filter(c => c.progress === 100).length} />
        <DashboardCard icon={Heart} label="Courses Completed" value={myCourses.filter(c => c.progress === 100).length} />
      </div>
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-gray-950">Continue Learning</h2>
        {myCourses.length > 0 ? (
          <div className="mt-4">
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${myCourses[0].progress || 0}%` }} 
              />
            </div>
            <p className="mt-3 text-sm text-gray-600 flex justify-between items-center">
              <span>Currently studying: <strong>{myCourses[0].title}</strong> ({myCourses[0].progress || 0}% complete)</span>
              <Link to={`/dashboard/student/learning/${myCourses[0]._id || myCourses[0].id}`} className="text-blue-600 font-bold hover:underline">
                Resume Course &rarr;
              </Link>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">You are not actively enrolled in any courses yet. Browse our catalog to begin learning!</p>
        )}
      </div>
      <div className="mt-6">
        <StudyCalendar myCourses={myCourses} />
      </div>
    </>
  );
}

function CourseGrid({ courses, title, onUnenroll }) {
  return (
    <div>
      <h2 className="mb-5 text-xl font-black text-gray-950">{title}</h2>
      {courses.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const courseId = course._id || course.id;
            const progress = course.progress || 0;
            const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor;
            const image = course.thumbnail || course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80';
            
            return (
              <article key={courseId} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between min-h-[360px]">
                <div>
                  <img src={image} alt={course.title} className="h-40 w-full object-cover" />
                  <div className="p-5">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{course.category}</span>
                    <h3 className="mt-3 text-lg font-black text-gray-950 line-clamp-1">{course.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">By {instructorName || 'SkillShare Instructor'}</p>
                    
                    <div className="mt-5">
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                        <span>Course Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <Link 
                    to={`/dashboard/student/learning/${courseId}`} 
                    className="inline-flex justify-center items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 text-center"
                  >
                    Continue
                  </Link>
                  <button 
                    onClick={() => onUnenroll(courseId)} 
                    className="inline-flex justify-center items-center rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Unenroll
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">
          No courses found. Explore our public catalog to enroll in courses!
        </div>
      )}
    </div>
  );
}

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    certificateApi.mine()
      .then(setCertificates)
      .catch((apiError) => setError(apiError.message || 'Unable to load certificates.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm font-semibold text-gray-500">Loading certificates...</p>;
  if (error) return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>;
  if (!certificates.length) return <p className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">Complete every lesson and quiz in a course to earn a certificate.</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {certificates.map((certificate) => (
        <article key={certificate.certificateId} className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-4">
            <Award aria-hidden="true" className="mt-1 shrink-0 text-teal-700" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black text-gray-950">{certificate.courseName}</h2>
              <p className="mt-1 text-sm text-gray-600">Awarded to {certificate.studentName}</p>
              <p className="text-sm text-gray-600">Instructor: {certificate.instructorName}</p>
              <p className="mt-3 text-xs text-gray-500">Completed {new Date(certificate.completionDate).toLocaleDateString()}</p>
              <p className="mt-1 break-all font-mono text-xs text-gray-500">ID: {certificate.certificateId}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/certificate/${certificate.certificateId}`} className="inline-flex items-center gap-2 rounded-md bg-teal-800 px-3 py-2 text-sm font-bold text-white hover:bg-teal-900">
                  <ExternalLink size={16} /> View Certificate
                </Link>
                <Link to={`/certificate/${certificate.certificateId}?print=1`} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50">
                  <Printer size={16} /> Print / Save PDF
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function StudentQuizResults() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAttemptId, setExpandedAttemptId] = useState(null);

  useEffect(() => {
    courseApi.studentQuizAttempts()
      .then(setAttempts)
      .catch((apiError) => setError(apiError.message || 'Unable to load quiz results.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm font-semibold text-gray-500">Loading quiz results...</p>;
  if (error) return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>;
  if (!attempts.length) return <p className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">Your submitted quiz attempts and results will appear here.</p>;

  return (
    <div className="max-w-4xl space-y-4">
      {attempts.map((attempt) => {
        const expanded = expandedAttemptId === attempt._id;
        return (
          <article key={attempt._id} className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-gray-950">{attempt.quizTitle}</h2>
                <p className="mt-1 text-sm text-gray-600">{attempt.course?.title || 'Course'} · Attempt {attempt.attemptNumber}</p>
                <p className="mt-1 text-xs text-gray-500">Submitted {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'Not submitted'}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-950">{attempt.score} / {attempt.totalMarks} · {attempt.percentage}%</p>
                <p className={`text-sm font-bold ${attempt.passed ? 'text-emerald-700' : 'text-amber-800'}`}>{attempt.passed ? 'Passed' : 'Not passed'} · pass mark {attempt.passMark}%</p>
              </div>
            </div>
            <button type="button" onClick={() => setExpandedAttemptId(expanded ? null : attempt._id)} className="mt-4 text-sm font-bold text-teal-800 hover:underline">
              {expanded ? 'Hide answers' : 'Review answers'}
            </button>
            {expanded && (
              <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                {attempt.questions.map((question, index) => (
                  <div key={question._id || question.questionId || index} className="rounded-md bg-gray-50 p-4">
                    <p className="font-bold text-gray-900">{index + 1}. {question.questionText} ({question.marks} marks)</p>
                    <p className="mt-2 text-sm text-gray-700">Your answer: {question.selectedAnswerIndex === null ? 'No answer' : question.options[question.selectedAnswerIndex]}</p>
                    <p className="text-sm font-semibold text-emerald-800">Correct answer: {question.options[question.correctAnswerIndex]}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Notifications() {
  return <div className="grid gap-3">{['New lesson added', 'Certificate generated', 'Instructor replied to your review'].map((item) => <Toast key={item} message={item} />)}</div>;
}

function Profile({ initialUser }) {
  const { updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadRes = await authApi.uploadImage(file);
      const imageUrl = `http://localhost:5000${uploadRes.data || uploadRes}`; 
      const updatedUser = await authApi.updateProfile({ profileImage: imageUrl });
      updateUser(updatedUser.data || updatedUser);
      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="grid max-w-2xl gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <Settings className="text-blue-600" />
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={initialUser?.profileImage || 'https://via.placeholder.com/150'} 
          alt="Profile" 
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Update Profile Picture</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
      <FormInput label="Full Name" name="name" value={initialUser?.name || ''} placeholder="Demo User" readOnly />
      <FormInput label="Email" name="email" value={initialUser?.email || ''} placeholder="demo@skillshare.test" readOnly />
      <p className="text-xs text-gray-400 mt-2">Profile modifications are restricted under test mode.</p>
    </form>
  );
}
