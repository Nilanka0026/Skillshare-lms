import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookOpen, CreditCard, Star, Trash2, Users, Edit3, Eye, EyeOff, Calendar } from 'lucide-react';
import { DashboardCard } from '../../../components/common/DashboardCard.jsx';
import { FormInput } from '../../../components/common/FormInput.jsx';
import { useAuth } from '../../../context/useAuth.js';
import { categories } from '../../../data/platformData.js';
import { courseApi } from '../../../services/api.js';
import { formatCurrency } from '../../../utils/formatters.js';

const initialCourse = {
  title: '',
  category: '',
  price: '',
  thumbnail: '',
  description: '',
  level: 'Beginner',
  duration: '',
  requirements: '',
  learningOutcomes: ''
};

export function InstructorPage({ title, view }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const [editingCourse, setEditingCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setError('');
    setLoading(true);
    try {
      // Load teacher courses
      const coursesData = await courseApi.teacherCourses();
      setCourses(coursesData);

      // Load teacher analytics
      const analyticsData = await courseApi.teacherAnalytics();
      setAnalytics(analyticsData);
    } catch (apiError) {
      setError(apiError.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm('Are you sure you want to delete this course? All enrollments and reviews will be permanently removed.');
    if (!confirmed) return;

    try {
      await courseApi.teacherRemove(courseId);
      setCourses((current) => current.filter((course) => course._id !== courseId));
      setSuccess('Course deleted successfully.');
      loadDashboardData();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      await courseApi.teacherUpdate(courseId, { isPublished: !currentStatus });
      setSuccess(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully.`);
      loadDashboardData();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setEditMode(true);
  };

  const handleViewStudents = async (courseId) => {
    setLoading(true);
    try {
      const data = await courseApi.teacherStudents(courseId);
      setStudentData(data);
      setActiveCourseId(courseId);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={title} />
      
      {/* Verification status banners */}
      {user?.verificationStatus === 'pending' && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="mt-0.5 rounded-lg bg-amber-100 p-1.5 text-amber-600 flex-shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-amber-900">Instructor Account Pending Verification</h4>
            <p className="text-xs font-semibold mt-0.5 text-amber-800">Your profile is currently under review by our administration team. You will be able to create, publish, and manage courses as soon as your qualifications are approved.</p>
          </div>
        </div>
      )}

      {user?.verificationStatus === 'rejected' && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="mt-0.5 rounded-lg bg-rose-100 p-1.5 text-rose-600 flex-shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-rose-900">Verification Application Rejected</h4>
            <p className="text-xs font-semibold mt-0.5 text-rose-800">Unfortunately, the administration team could not verify your instructor documents. Please contact support at support@skillshare.test to update your credentials.</p>
          </div>
        </div>
      )}

      {loading && <p className="mb-4 text-sm font-semibold text-gray-500">Processing teacher workspace...</p>}
      {error && (
        <div className="mb-4 flex justify-between items-center rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-800 underline">Dismiss</button>
        </div>
      )}
      {success && (
        <div className="mb-4 flex justify-between items-center rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-blue-800 underline">Dismiss</button>
        </div>
      )}

      {view === 'overview' && <Overview courses={courses} analytics={analytics} />}
      
      {view === 'create' && (
        user?.verificationStatus === 'approved' ? (
          <CourseForm 
            onCreated={() => {
              setSuccess('Course published to platform successfully.');
              loadDashboardData();
            }} 
            onError={setError} 
          />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center max-w-xl mx-auto shadow-sm my-6">
            <h3 className="text-lg font-black text-gray-900">Action Restricted</h3>
            <p className="text-sm text-gray-500 mt-2">You cannot create or manage courses until your instructor application is approved by the platform administrator.</p>
          </div>
        )
      )}

      {view === 'courses' && !editMode && (
        user?.verificationStatus === 'approved' ? (
          <CourseGrid 
            courses={courses} 
            onDeleteCourse={handleDeleteCourse} 
            onTogglePublish={handleTogglePublish}
            onEditCourse={handleEditClick}
            onViewStudents={handleViewStudents}
          />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center max-w-xl mx-auto shadow-sm my-6">
            <h3 className="text-lg font-black text-gray-900">Action Restricted</h3>
            <p className="text-sm text-gray-500 mt-2">Course list and management features will unlock once your account has been verified.</p>
          </div>
        )
      )}

      {view === 'courses' && editMode && editingCourse && (
        <div>
          <button 
            onClick={() => { setEditMode(false); setEditingCourse(null); }}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
          >
            &larr; Back to Courses List
          </button>
          <CourseForm 
            existingCourse={editingCourse}
            onCreated={() => {
              setSuccess('Course updated successfully.');
              setEditMode(false);
              setEditingCourse(null);
              loadDashboardData();
            }}
            onError={setError}
          />
        </div>
      )}

      {view === 'students' && (
        <StudentsView 
          studentData={studentData} 
          courses={courses} 
          onSelectCourse={handleViewStudents} 
        />
      )}

      {view === 'analytics' && <Analytics analytics={analytics} courses={courses} />}
      
      {view === 'profile' && <ProfileSettings initialUser={user} />}
    </div>
  );
}

function PageHeader({ title }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-gray-950">{title}</h1>
      <p className="mt-2 text-gray-600">Teacher dashboard workspace. Manage course creations, details, publication status, and student list metrics.</p>
    </div>
  );
}

function Overview({ courses, analytics }) {
  const totalCourses = analytics?.totalCourses || courses.length;
  const totalStudents = analytics?.totalStudents || 0;
  const popularCourse = analytics?.mostPopularCourse?.title || 'None';
  const enrollmentsCount = analytics?.totalEnrollments || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard icon={BookOpen} label="Total Courses" value={totalCourses} />
        <DashboardCard icon={Users} label="Total Students" value={totalStudents} />
        <DashboardCard icon={CreditCard} label="Total Enrollments" value={enrollmentsCount} />
        <DashboardCard icon={Star} label="Most Popular Course" value={popularCourse} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Recent Enrollments list */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-gray-950 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" /> Recent Enrollments
          </h2>
          {analytics?.recentEnrollments && analytics.recentEnrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-400">
                    <th className="pb-3 pr-4">Student</th>
                    <th className="pb-3 pr-4">Course</th>
                    <th className="pb-3">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics.recentEnrollments.map((enroll) => (
                    <tr key={enroll._id}>
                      <td className="py-3 pr-4 font-semibold text-gray-900">{enroll.studentName}</td>
                      <td className="py-3 pr-4">{enroll.courseTitle}</td>
                      <td className="py-3 text-xs">{new Date(enroll.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No student enrollments registered yet.</p>
          )}
        </div>

        {/* Quick Tips */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <h2 className="text-lg font-black text-gray-950 mb-4">Teacher Resources</h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/50 rounded-xl">
              <h4 className="text-sm font-bold text-gray-900">1. Complete course descriptors</h4>
              <p className="text-xs text-gray-600 mt-1">Courses with level definitions, clear requirements, and durational info have 40% higher organic conversions.</p>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-xl">
              <h4 className="text-sm font-bold text-gray-900">2. Keep it published</h4>
              <p className="text-xs text-gray-600 mt-1">Publish your courses once you finish curriculum upload so students can immediately purchase and start learning.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseForm({ existingCourse = null, onCreated, onError }) {
  const isEdit = !!existingCourse;
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    import('../../../services/apiClient').then(({ default: apiClient }) => {
      apiClient.get('/categories')
        .then((data) => setCategoriesList(data))
        .catch(() => setCategoriesList(categories));
    });
  }, []);
  
  // Format array to string for textarea
  const arrayToString = (arr) => {
    if (!arr) return '';
    if (typeof arr === 'string') return arr;
    return arr.join('\n');
  };

  const [values, setValues] = useState(() => {
    if (existingCourse) {
      return {
        title: existingCourse.title || '',
        category: existingCourse.category || '',
        price: existingCourse.price || '',
        thumbnail: existingCourse.thumbnail || '',
        description: existingCourse.description || '',
        level: existingCourse.level || 'Beginner',
        duration: existingCourse.duration || '',
        requirements: arrayToString(existingCourse.requirements),
        learningOutcomes: arrayToString(existingCourse.learningOutcomes)
      };
    }
    return initialCourse;
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    onError('');

    const payload = {
      ...values,
      price: Number(values.price),
      thumbnail: values.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'
    };

    try {
      let course;
      if (isEdit) {
        course = await courseApi.teacherUpdate(existingCourse._id, payload);
      } else {
        course = await courseApi.teacherCreate({
          ...payload,
          isPublished: true // publish immediately
        });
      }
      onCreated(course);
    } catch (apiError) {
      onError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid max-w-4xl gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-gray-950">{isEdit ? 'Modify Course Specifications' : 'Build Premium Course'}</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput 
          label="Course Title" 
          name="title" 
          value={values.title} 
          onChange={handleChange} 
          placeholder="Example: React Masterclass for Developers" 
          required 
        />
        
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-700">Category</span>
          <select 
            name="category" 
            value={values.category} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-semibold bg-white"
            required
          >
            <option value="">-- Choose Category --</option>
            {categoriesList.map((cat) => (
              <option key={cat._id || cat} value={cat.name || cat}>{cat.name || cat}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormInput 
          label="Pricing (USD)" 
          name="price" 
          value={values.price} 
          onChange={handleChange} 
          placeholder="49" 
          type="number" 
          required 
        />
        
        <FormInput 
          label="Estimated Duration" 
          name="duration" 
          value={values.duration} 
          onChange={handleChange} 
          placeholder="Example: 12 hours" 
          required 
        />

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-700">Difficulty Level</span>
          <select 
            name="level" 
            value={values.level} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-semibold bg-white"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All levels">All levels</option>
          </select>
        </label>
      </div>

      <FormInput 
        label="Thumbnail URL" 
        name="thumbnail" 
        value={values.thumbnail} 
        onChange={handleChange} 
        placeholder="https://images.unsplash.com/photo-..." 
      />

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-gray-700">Description</span>
        <textarea 
          name="description" 
          value={values.description} 
          onChange={handleChange} 
          className="min-h-32 w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm" 
          placeholder="Describe course curricula and student objectives..."
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-700">Course Requirements (one per line)</span>
          <textarea 
            name="requirements" 
            value={values.requirements} 
            onChange={handleChange} 
            className="min-h-24 w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm" 
            placeholder="Basic JavaScript fundamentals&#10;HTML/CSS familiarity"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-700">Learning Outcomes (one per line)</span>
          <textarea 
            name="learningOutcomes" 
            value={values.learningOutcomes} 
            onChange={handleChange} 
            className="min-h-24 w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm" 
            placeholder="Build enterprise MERN marketplaces&#10;Connect secure Stripe payments"
          />
        </label>
      </div>

      <button 
        className="w-fit rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition" 
        disabled={submitting} 
        type="submit"
      >
        {submitting ? 'Processing course details...' : isEdit ? 'Update Course' : 'Create & Publish Course'}
      </button>
    </form>
  );
}

function CourseGrid({ courses, onDeleteCourse, onTogglePublish, onEditCourse, onViewStudents }) {
  if (!courses.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm font-semibold text-gray-500 shadow-sm">
        No courses published yet. Click "Create Course" to add courses to your workspace.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => {
        const studentCount = course.enrolledStudents?.length || course.studentsEnrolled?.length || course.enrollmentCount || 0;
        
        return (
          <article 
            key={course._id} 
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'} 
                  alt={course.title} 
                  className="h-44 w-full object-cover" 
                />
                <button
                  onClick={() => onTogglePublish(course._id, course.isPublished)}
                  className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-md hover:scale-105 transition duration-200 ${
                    course.isPublished 
                      ? 'bg-green-500 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {course.isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                  {course.isPublished ? 'Published' : 'Draft'}
                </button>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{course.category}</span>
                  <span className="text-sm font-black text-gray-950">{formatCurrency(course.price)}</span>
                </div>
                <h3 className="text-lg font-black text-gray-950 line-clamp-1">{course.title}</h3>
                
                <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1"><Users size={14} /> {studentCount} Enrolled</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5">{course.level || 'All levels'}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button 
                onClick={() => onEditCourse(course)}
                className="inline-flex justify-center items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                <Edit3 size={14} /> Edit
              </button>
              
              <button 
                onClick={() => onViewStudents(course._id)}
                className="inline-flex justify-center items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
              >
                <Users size={14} /> Students
              </button>

              <button 
                onClick={() => onDeleteCourse(course._id)}
                className="col-span-2 inline-flex justify-center items-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 size={14} /> Delete Course
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function StudentsView({ studentData, courses, onSelectCourse }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar selection */}
      <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-fit">
        <h3 className="text-base font-black text-gray-950 mb-3">Your Courses</h3>
        <div className="grid gap-2">
          {courses.map((course) => (
            <button 
              key={course._id}
              onClick={() => onSelectCourse(course._id)}
              className="w-full text-left rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {course.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Student details list */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {studentData ? (
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-gray-950">{studentData.courseTitle}</h2>
                <p className="text-sm text-gray-500 mt-1">Course Roster</p>
              </div>
              <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                Total Enrolled: {studentData.totalEnrolled}
              </span>
            </div>

            {studentData.students && studentData.students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Email Address</th>
                      <th className="pb-3">Join Date</th>
                      <th className="pb-3 text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {studentData.students.map((student) => (
                      <tr key={student._id}>
                        <td className="py-3 font-semibold text-gray-900">{student.name}</td>
                        <td className="py-3 text-gray-500">{student.email}</td>
                        <td className="py-3 text-xs">{new Date(student.joinDate).toLocaleDateString()}</td>
                        <td className="py-3 text-right font-black text-gray-900">
                          <span className="rounded bg-blue-50 px-2.5 py-1 text-xs text-blue-600 font-bold">
                            {student.progressPercentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-500 py-6 text-center">No students enrolled in this course yet.</p>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Users size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">Select a course from the sidebar to view enrolled students list and track progress.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Analytics({ analytics, courses }) {
  const enrollData = courses.map(c => ({
    title: c.title,
    count: c.enrolledStudents?.length || c.studentsEnrolled?.length || c.enrollmentCount || 0
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Analytics Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-gray-950 flex items-center gap-2 mb-4">
            <BarChart3 className="text-blue-600" /> Course Student Distributions
          </h3>
          <div className="mt-8 flex h-56 items-end gap-3 px-4">
            {enrollData.length > 0 ? (
              enrollData.map((data, index) => {
                const max = Math.max(...enrollData.map(d => d.count), 1);
                const heightPercentage = Math.max((data.count / max) * 100, 8);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">{data.count}</span>
                    <span 
                      className="w-full rounded-t-xl bg-blue-600 hover:bg-blue-700 transition cursor-pointer" 
                      style={{ height: `${heightPercentage}%` }} 
                      title={data.title}
                    />
                    <span className="text-[10px] font-semibold text-gray-400 line-clamp-1 w-full text-center">
                      {data.title}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 w-full text-center">No statistical data available yet.</p>
            )}
          </div>
        </div>

        {/* Aggregate overview */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <h3 className="text-lg font-black text-gray-950 mb-4">Statistical Details</h3>
          <div className="divide-y divide-gray-100">
            <div className="py-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-500">Total Published Courses</span>
              <span className="text-sm font-black text-gray-950">{analytics?.totalCourses || 0}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-500">Total Enrolled Students</span>
              <span className="text-sm font-black text-gray-950">{analytics?.totalStudents || 0}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-500">Most Popular Title</span>
              <span className="text-sm font-black text-blue-600">{analytics?.mostPopularCourse?.title || 'None'}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-500">Most Popular Enrollments</span>
              <span className="text-sm font-black text-gray-950">{analytics?.mostPopularCourse?.enrolledCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ initialUser }) {
  return (
    <div className="grid max-w-2xl gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-black text-gray-950">Teacher Profile Specifications</h3>
      
      <FormInput 
        label="Name" 
        value={initialUser?.name || ''} 
        readOnly 
      />
      <FormInput 
        label="Email" 
        value={initialUser?.email || ''} 
        readOnly 
      />
      
      <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-4 rounded-xl font-semibold">
        Note: Display details are synchronized with system core registration details.
      </div>
    </div>
  );
}
