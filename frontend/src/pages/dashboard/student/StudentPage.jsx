import { useEffect, useState } from 'react';
import { Award, BookOpen, Clock, Heart, Settings } from 'lucide-react';
import { CourseCard } from '../../../components/common/CourseCard.jsx';
import { DashboardCard } from '../../../components/common/DashboardCard.jsx';
import { FormInput } from '../../../components/common/FormInput.jsx';
import { Toast } from '../../../components/common/Toast.jsx';
import { courses as mockCourses } from '../../../data/platformData.js';
import { courseApi } from '../../../services/api.js';

export function StudentPage({ title, view }) {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    courseApi.myCourses()
      .then((data) => setMyCourses(data))
      .catch((apiError) => setError(apiError.message))
      .finally(() => setLoading(false));
  }, []);

  const displayedCourses = myCourses.length ? myCourses : [];

  return (
    <div>
      <PageHeader title={title} />
      {loading && <p className="mb-4 text-sm font-semibold text-gray-500">Loading enrolled courses...</p>}
      {error && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">Could not load enrolled courses: {error}</p>}
      {view === 'overview' && <Overview myCourses={displayedCourses} />}
      {view === 'courses' && <CourseGrid courses={displayedCourses} title="My Courses" />}
      {view === 'wishlist' && <CourseGrid courses={mockCourses.slice(1, 3)} title="Wishlist" />}
      {view === 'certificates' && <Certificates />}
      {view === 'notifications' && <Notifications />}
      {view === 'profile' && <Profile />}
    </div>
  );
}

function PageHeader({ title }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-gray-950">{title}</h1>
      <p className="mt-2 text-gray-600">Student dashboard workspace. Public browsing remains available from the main navbar.</p>
    </div>
  );
}

function Overview({ myCourses }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard icon={BookOpen} label="My Courses" value={myCourses.length} />
        <DashboardCard icon={Clock} label="Hours Learned" value="46" />
        <DashboardCard icon={Award} label="Certificates" value="3" />
        <DashboardCard icon={Heart} label="Wishlist" value="12" />
      </div>
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-gray-950">Continue Learning</h2>
        <div className="mt-4 h-3 rounded-full bg-gray-100"><div className="h-full w-[68%] rounded-full bg-blue-600" /></div>
        <p className="mt-3 text-sm text-gray-600">{myCourses[0]?.title || 'Enroll in a course to begin learning.'}</p>
      </div>
    </>
  );
}

function CourseGrid({ courses, title }) {
  return (
    <div>
      <h2 className="mb-5 text-xl font-black text-gray-950">{title}</h2>
      {courses.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => <CourseCard key={course._id || course.id} course={course} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">
          No enrolled courses yet. Visit Explore Courses to purchase a course.
        </div>
      )}
    </div>
  );
}

function Certificates() {
  return <div className="grid gap-4 md:grid-cols-3">{['Design Basics', 'MERN Starter', 'Marketing Systems'].map((item) => <div key={item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><Award className="text-blue-600" /><h3 className="mt-4 font-black">{item}</h3><p className="mt-2 text-sm text-gray-600">Certificate ready to download.</p></div>)}</div>;
}

function Notifications() {
  return <div className="grid gap-3">{['New lesson added', 'Certificate generated', 'Instructor replied to your review'].map((item) => <Toast key={item} message={item} />)}</div>;
}

function Profile() {
  return (
    <form className="grid max-w-2xl gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <Settings className="text-blue-600" />
      <FormInput label="Full Name" name="name" placeholder="Demo User" />
      <FormInput label="Email" name="email" placeholder="demo@skillshare.test" />
    </form>
  );
}
