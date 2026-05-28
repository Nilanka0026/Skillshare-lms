import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { createElement } from 'react';
import { CourseGrid } from '../../components/course/CourseComponents.jsx';
import { InstructorCard } from '../../components/domain/InstructorComponents.jsx';
import { Accordion } from '../../components/ui/index.jsx';
import { courses, faqs, instructors } from '../../data/mockData.js';
import { quickStats } from '../../data/navigation.js';

export function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><BookOpen size={16} /> Learn. Build. Share.</span>
          <h1>SkillShare</h1>
          <p>Build career-ready skills through focused courses, expert instructors, progress tracking, certificates, and a complete instructor marketplace.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/courses">Browse courses <ArrowRight size={18} /></Link>
            <Link className="button button-ghost" to="/instructor/dashboard">Instructor dashboard</Link>
          </div>
        </div>
        <div className="hero-media" aria-label="Students learning online">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1100&q=80" alt="" />
        </div>
      </section>

      <section className="stats-band">
        {quickStats.map(({ label, value, icon: Icon }) => (
          <article key={label}>
            {createElement(Icon, { size: 23 })}
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Featured Courses</h2>
          <Link to="/courses">View all <ArrowRight size={17} /></Link>
        </div>
        <CourseGrid courses={courses} />
      </section>

      <section className="page-section split-section">
        <div>
          <h2>Teach with a complete instructor workflow</h2>
          <p>Launch courses, upload lessons, track analytics, manage enrollments, and request withdrawals from one dashboard.</p>
          <ul className="check-list">
            {['Course builder', 'Lesson uploads', 'Earnings dashboard', 'Student enrollments'].map((item) => (
              <li key={item}><CheckCircle2 size={18} /> {item}</li>
            ))}
          </ul>
        </div>
        <div className="instructor-grid compact">
          {instructors.map((instructor) => <InstructorCard key={instructor.name} instructor={instructor} />)}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>FAQ Accordion</h2>
        </div>
        <Accordion items={faqs} />
      </section>
    </>
  );
}
