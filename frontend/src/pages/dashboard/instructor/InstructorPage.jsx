import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookOpen, CreditCard, Star, Trash2, Users } from 'lucide-react';
import { CourseCard } from '../../../components/common/CourseCard.jsx';
import { DashboardCard } from '../../../components/common/DashboardCard.jsx';
import { DataTable } from '../../../components/common/DataTable.jsx';
import { FormInput } from '../../../components/common/FormInput.jsx';
import { useAuth } from '../../../context/useAuth.js';
import { tableRows } from '../../../data/platformData.js';
import { courseApi } from '../../../services/api.js';
import { formatCurrency } from '../../../utils/formatters.js';

const initialCourse = {
  title: '',
  category: '',
  price: '',
  thumbnail: '',
  description: ''
};

export function InstructorPage({ title, view }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    setError('');
    setLoading(true);

    try {
      const data = await courseApi.list();
      setCourses(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const instructorCourses = useMemo(() => {
    return courses.filter((course) => {
      const instructorId = typeof course.instructor === 'object' ? course.instructor?._id : course.instructor;
      return instructorId === user?._id;
    });
  }, [courses, user?._id]);

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm('Delete this course?');

    if (!confirmed) {
      return;
    }

    try {
      await courseApi.remove(courseId);
      setCourses((current) => current.filter((course) => course._id !== courseId));
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div>
      <PageHeader title={title} />
      {loading && <p className="mb-4 text-sm font-semibold text-gray-500">Loading instructor courses...</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      {success && <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">{success}</p>}

      {view === 'overview' && <Overview courses={instructorCourses} />}
      {view === 'create' && <CourseForm onCreated={(course) => { setCourses((current) => [course, ...current]); setSuccess('Course added to MongoDB successfully.'); }} onError={setError} />}
      {view === 'courses' && <CourseGrid courses={instructorCourses} onDeleteCourse={handleDeleteCourse} />}
      {view === 'lessons' && <CourseForm lessonMode onCreated={(course) => setCourses((current) => [course, ...current])} onError={setError} />}
      {view === 'enrollments' && <DataTable columns={['Student', 'Role', 'Status', 'Amount']} rows={tableRows} />}
      {view === 'earnings' && <Earnings courses={instructorCourses} />}
      {view === 'analytics' && <Analytics />}
      {view === 'reviews' && <Reviews />}
      {view === 'profile' && <CourseForm profileMode onCreated={() => {}} onError={setError} />}
    </div>
  );
}

function PageHeader({ title }) {
  return <div className="mb-6"><h1 className="text-3xl font-black text-gray-950">{title}</h1><p className="mt-2 text-gray-600">Instructor tools connected to MongoDB courses.</p></div>;
}

function Overview({ courses }) {
  const students = courses.reduce((sum, course) => sum + (course.studentsEnrolled?.length || 0), 0);
  const earnings = courses.reduce((sum, course) => sum + (course.price || 0) * (course.studentsEnrolled?.length || 0), 0);
  const rating = courses.length ? (courses.reduce((sum, course) => sum + (course.ratings?.average || 0), 0) / courses.length).toFixed(1) : '0.0';

  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"><DashboardCard icon={BookOpen} label="Courses" value={courses.length} /><DashboardCard icon={Users} label="Students" value={students} /><DashboardCard icon={CreditCard} label="Earnings" value={formatCurrency(earnings)} /><DashboardCard icon={Star} label="Rating" value={rating} /></div>;
}

function CourseForm({ lessonMode = false, onCreated, onError, profileMode = false }) {
  const [values, setValues] = useState(initialCourse);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (profileMode || lessonMode) {
      return;
    }

    setSubmitting(true);
    onError('');

    try {
      const course = await courseApi.create({
        ...values,
        price: Number(values.price),
        thumbnail: values.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'
      });
      setValues(initialCourse);
      onCreated(course);
    } catch (apiError) {
      onError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid max-w-3xl gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-gray-950">{profileMode ? 'Profile Settings' : lessonMode ? 'Upload Lessons' : 'Create Course Flow'}</h2>
      <FormInput label={profileMode ? 'Display Name' : 'Course Title'} name="title" value={values.title} onChange={handleChange} placeholder="Example: React for Beginners" />
      <FormInput label={lessonMode ? 'Lesson Video URL' : 'Course Category'} name="category" value={values.category} onChange={handleChange} placeholder="Development" />
      <FormInput label={lessonMode ? 'Lesson Resource' : 'Course Pricing'} name="price" value={values.price} onChange={handleChange} placeholder="49" type="number" />
      {!lessonMode && !profileMode && <FormInput label="Thumbnail URL" name="thumbnail" value={values.thumbnail} onChange={handleChange} placeholder="https://..." />}
      <label className="block space-y-2"><span className="text-sm font-semibold">Description</span><textarea name="description" value={values.description} onChange={handleChange} className="min-h-32 w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
      <button className="w-fit rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60" disabled={submitting || lessonMode || profileMode} type="submit">{submitting ? 'Publishing...' : 'Publish Course'}</button>
    </form>
  );
}

function CourseGrid({ courses, onDeleteCourse }) {
  if (!courses.length) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">No courses created by this instructor yet.</div>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <div key={course._id} className="relative">
          <CourseCard course={course} />
          <button onClick={() => onDeleteCourse(course._id)} className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function Earnings({ courses }) {
  return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><Analytics /><div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="font-black">Withdraw Requests</h2><p className="mt-3 text-sm text-gray-600">Estimated course value: {formatCurrency(courses.reduce((sum, course) => sum + course.price, 0))}</p></div></div>;
}

function Analytics() {
  return <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><BarChart3 className="text-blue-600" /><h2 className="mt-3 text-xl font-black">Course Analytics</h2><div className="mt-6 flex h-56 items-end gap-3">{[48, 70, 55, 88, 76, 94].map((height) => <span key={height} className="flex-1 rounded-t-xl bg-blue-600" style={{ height: `${height}%` }} />)}</div></div>;
}

function Reviews() {
  return <div className="grid gap-3">{['Excellent course structure', 'Helpful resources', 'Clear explanations'].map((item) => <div key={item} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><Star className="text-amber-500" /><p className="mt-3 font-semibold">{item}</p></div>)}</div>;
}
