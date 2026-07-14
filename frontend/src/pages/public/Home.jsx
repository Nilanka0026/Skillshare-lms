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
      <section 
        className="relative overflow-hidden py-20 sm:py-24 lg:py-32 transition-colors duration-300"
        style={{ backgroundColor: '#0b0f19' }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay to ensure high contrast and text readability */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundImage: 'linear-gradient(to top, #0b0f19 0%, rgba(11, 15, 25, 0.5) 50%, rgba(11, 15, 25, 0.8) 100%)' }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span 
              className="rounded-full border px-4 py-2 text-sm font-bold animate-pulse"
              style={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.2)', 
                borderColor: 'rgba(59, 130, 246, 0.3)', 
                color: '#60a5fa' 
              }}
            >
              Modern e-learning marketplace
            </span>
            <h1 
              className="mt-6 text-5xl font-black tracking-tight sm:text-6xl"
              style={{ color: '#ffffff' }}
            >
              Learn practical skills from top instructors.
            </h1>
            <p 
              className="mt-6 text-lg leading-8"
              style={{ color: '#d1d5db' }}
            >
              The Engineering Skill Sharing Platform connects students and staff across all engineering departments to learn, teach, and grow together.
      <section className="bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-400">Modern e-learning marketplace</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-gray-950 dark:text-white sm:text-6xl">
              Learn practical skills from top instructors.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Join thousands of learners and instructors on our platform. Explore courses, share knowledge, and grow your skills in a vibrant community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link 
                to="/courses" 
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition-colors duration-200"
                style={{ color: '#ffffff' }}
              >
                Browse Courses <ArrowRight size={18} style={{ color: '#ffffff' }} />
              </Link>
              <Link 
                to="/register" 
                className="inline-flex min-h-12 items-center rounded-xl px-6 py-3 font-semibold transition-colors duration-200 hover:bg-[rgba(255,255,255,0.2)]"
                style={{ 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: '#ffffff' 
                }}
              >
              <Link to="/register" className="inline-flex min-h-12 items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Become an Instructor
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3 shadow-sm transition-colors">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
              alt="Students learning together"
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 transition-colors duration-300">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <article key={label} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-colors">
              {createElement(Icon, { size: 22, className: 'text-blue-600' })}
              <strong className="mt-3 block text-2xl font-black text-gray-950 dark:text-white">{value}</strong>
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            </article>
          ))}
        </div>
      </section>

      <Section title="Featured Courses" action="/courses">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </Section>

      <section className="bg-gray-50 dark:bg-gray-900/30 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-950 dark:text-white">Categories</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category} to={`/courses?category=${category}`} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <CheckCircle2 size={22} className="text-blue-600" />
                <h3 className="mt-4 text-lg font-black text-gray-950 dark:text-white">{category}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Explore curated courses and projects.</p>
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

      <section className="bg-gray-50 dark:bg-gray-900/30 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-950 dark:text-white">Testimonials</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => <ReviewCard key={item.name} name={item.name} text={item.text} />)}
          </div>
        </div>
      </section>

      <Section title="FAQ">
        <div className="grid gap-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-colors duration-300">
              <summary className="cursor-pointer font-black text-gray-950 dark:text-white">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}

function Section({ action, children, title }) {
  return (
    <section className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black text-gray-950 dark:text-white">{title}</h2>
          {action && <Link to={action} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">View all</Link>}
        </div>
        {children}
      </div>
    </section>
  );
}
