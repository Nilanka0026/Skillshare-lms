import { Link } from 'react-router-dom';
import { Clock, Star, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

export function CourseCard({ course }) {
  const courseId = course._id || course.id;
  const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor;
  const rating = typeof course.ratings === 'object' ? course.ratings?.average || 0 : course.rating;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md duration-300">
      <img src={course.image} alt={course.title} className="h-48 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400">{course.category}</span>
          <span className="text-sm font-black text-gray-950 dark:text-white">{formatCurrency(course.price)}</span>
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-950 dark:text-white">{course.title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">By {instructorName || 'SkillShare Instructor'}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Star size={15} className="text-amber-500" /> {rating || 'New'}</span>
          <span className="flex items-center gap-1"><Users size={15} /> {(course.students || course.studentsEnrolled?.length || 0).toLocaleString()}</span>
          <span className="flex items-center gap-1"><Clock size={15} /> {course.duration}</span>
        </div>
        <Link to={`/courses/${courseId}`} className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
          View Course
        </Link>
      </div>
    </article>
  );
}
