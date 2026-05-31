import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users } from 'lucide-react';
import apiClient from '../../services/apiClient';

export function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/teachers')
      .then((data) => setTeachers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl font-black text-gray-950">Expert Teachers</h1>
          <p className="mt-4 text-gray-600">
            Learn from real-world developers, professional designers, and growth marketers who teach from experience.
          </p>
        </div>

        {loading && (
          <p className="text-sm font-semibold text-gray-500">Loading instructors...</p>
        )}

        {error && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            Could not fetch teachers list: {error}
          </p>
        )}

        {!loading && !error && teachers.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            No teachers registered on the platform yet.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <article
              key={teacher._id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-2xl font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                  {teacher.profileImage ? (
                    <img
                      src={teacher.profileImage}
                      alt={teacher.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    teacher.name[0]
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-950">{teacher.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {teacher.experience || 'Professional Educator'}
                  </p>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm text-gray-600 min-h-[60px]">
                {teacher.bio || 'This instructor has not shared a biography yet, but they teach career-focused and practical courses.'}
              </p>

              {teacher.skills && teacher.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {teacher.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-gray-400" />
                  {teacher.courseCount} {teacher.courseCount === 1 ? 'course' : 'courses'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={16} className="text-gray-400" />
                  {teacher.studentCount.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5 font-bold text-amber-600">
                  <Star size={16} className="fill-amber-500 text-amber-500" />
                  {teacher.rating || 5.0}
                </span>
              </div>

              <Link
                to={`/teachers/${teacher._id}`}
                className="mt-5 inline-flex w-full justify-center rounded-xl bg-gray-50 py-3 text-sm font-bold text-gray-900 transition hover:bg-blue-600 hover:text-white"
              >
                View Profile
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
