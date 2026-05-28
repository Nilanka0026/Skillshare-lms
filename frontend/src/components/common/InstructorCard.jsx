import { Star } from 'lucide-react';

export function InstructorCard({ instructor }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-xl font-black text-gray-950">
        {instructor.name[0]}
      </div>
      <h3 className="mt-4 text-lg font-black text-gray-950">{instructor.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{instructor.role}</p>
      <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600">
        <span>{instructor.courses} courses</span>
        <span>{instructor.students}</span>
        <span className="flex items-center gap-1"><Star size={15} className="text-amber-500" /> {instructor.rating}</span>
      </div>
    </article>
  );
}
