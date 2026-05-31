import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Star, Users, Briefcase, Award } from 'lucide-react';
import { CourseCard } from '../../components/common/CourseCard.jsx';
import apiClient from '../../services/apiClient';

export function TeacherProfile() {
  const { teacherId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get(`/teachers/${teacherId}`)
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [teacherId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 flex justify-center items-center">
        <p className="text-sm font-semibold text-gray-500">Loading teacher profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            Could not fetch profile: {error || 'Profile not found'}
          </p>
        </div>
      </div>
    );
  }

  const { teacher, stats, courses } = data;

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-md">
              {teacher.profileImage ? (
                <img
                  src={teacher.profileImage}
                  alt={teacher.name}
                  className="h-full w-full rounded-3xl object-cover"
                />
              ) : (
                teacher.name[0]
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-950">{teacher.name}</h1>
              <p className="mt-2 text-lg text-gray-600 font-semibold">{teacher.experience || 'Instructor at SkillShare'}</p>

              <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                  <BookOpen size={17} className="text-blue-600" />
                  {stats.courseCount} Created Courses
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                  <Users size={17} className="text-blue-600" />
                  {stats.studentCount.toLocaleString()} Enrolled Students
                </span>
                <span className="flex items-center gap-1.5 font-black text-amber-600">
                  <Star size={17} className="fill-amber-500 text-amber-500" />
                  {stats.rating || 5.0} average rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details & Courses Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Sidebar Panel */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-gray-950 flex items-center gap-2 mb-4">
                <Briefcase size={18} className="text-blue-600" /> Bio & Background
              </h3>
              <p className="text-sm leading-6 text-gray-600 whitespace-pre-line">
                {teacher.bio || `${teacher.name} is an active educator on SkillShare dedicated to creating high-quality, practical training courses designed to advance career paths.`}
              </p>
            </div>

            {teacher.skills && teacher.skills.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-gray-950 flex items-center gap-2 mb-4">
                  <Award size={18} className="text-blue-600" /> Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Courses Listing */}
          <section>
            <h2 className="text-2xl font-black text-gray-950 mb-6">Courses by {teacher.name}</h2>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
                This teacher hasn't published any courses yet.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
