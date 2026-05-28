import { InstructorCard } from '../../components/common/InstructorCard.jsx';
import { instructors } from '../../data/platformData.js';

export function Instructors() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-950">Top Instructors</h1>
        <p className="mt-4 max-w-2xl text-gray-600">Discover instructors teaching practical, career-ready courses.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {instructors.map((instructor) => <InstructorCard key={instructor.name} instructor={instructor} />)}
        </div>
      </div>
    </section>
  );
}
