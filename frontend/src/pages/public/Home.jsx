import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { createElement } from 'react';
import { CourseCard } from '../../components/common/CourseCard.jsx';
import { InstructorCard } from '../../components/common/InstructorCard.jsx';
import { ReviewCard } from '../../components/common/ReviewCard.jsx';
import { categories, courses, faqs, instructors, stats, testimonials } from '../../data/platformData.js';

export function Home() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">Modern e-learning marketplace</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-gray-950 sm:text-6xl">
              Learn practical skills from top instructors.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
 
              Join thousands of learners and instructors on our platform. Explore courses, share knowledge, and grow your skills in a vibrant community.

            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                Browse Courses <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="inline-flex min-h-12 items-center rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50">
                Become an Instructor
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-3 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
              alt="Students learning together"
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <article key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              {createElement(Icon, { size: 22, className: 'text-blue-600' })}
              <strong className="mt-3 block text-2xl font-black text-gray-950">{value}</strong>
              <span className="text-sm text-gray-500">{label}</span>
            </article>
          ))}
        </div>
      </section>

      <Section title="Featured Courses" action="/courses">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </Section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-950">Categories</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category} to={`/courses?category=${category}`} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <CheckCircle2 size={22} className="text-blue-600" />
                <h3 className="mt-4 text-lg font-black text-gray-950">{category}</h3>
                <p className="mt-2 text-sm text-gray-500">Explore curated courses and projects.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section title="Top Instructors" action="/instructors">
        <div className="grid gap-5 md:grid-cols-3">
          {instructors.map((instructor) => <InstructorCard key={instructor.name} instructor={instructor} />)}
        </div>
      </Section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-950">Testimonials</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => <ReviewCard key={item.name} name={item.name} text={item.text} />)}
          </div>
        </div>
      </section>

      <Section title="FAQ">
        <div className="grid gap-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-black text-gray-950">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-gray-600">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}

function Section({ action, children, title }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black text-gray-950">{title}</h2>
          {action && <Link to={action} className="text-sm font-bold text-blue-600 hover:text-blue-700">View all</Link>}
        </div>
        {children}
      </div>
    </section>
  );
}
