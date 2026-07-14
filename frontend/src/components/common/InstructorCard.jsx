import { Star } from 'lucide-react';

export function InstructorCard({ instructor }) {
  return (
    <article className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md duration-300">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-100 dark:bg-gray-800 text-xl font-black text-gray-950 dark:text-white border border-transparent dark:border-gray-700 transition-colors">
        {instructor.name[0]}
      </div>
      <h3 className="mt-4 text-lg font-black text-gray-950 dark:text-white">{instructor.name}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{instructor.role}</p>
      <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>{instructor.courses} courses</span>
        <span>{instructor.students}</span>
        <span className="flex items-center gap-1"><Star size={15} className="text-amber-500" /> {instructor.rating}</span>
      </div>
    </article>
  );
}
