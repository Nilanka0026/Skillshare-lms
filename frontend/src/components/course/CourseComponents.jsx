import { PlayCircle, ShoppingCart } from 'lucide-react';
import { ProgressBar, RatingStars } from '../ui/index.jsx';

export function CourseCard({ course }) {
  return (
    <article className="course-card">
      <img src={course.image} alt={course.title} />
      <div className="course-card-body">
        <span className="badge">{course.category}</span>
        <h3>{course.title}</h3>
        <p>{course.instructor}</p>
        <div className="card-row">
          <RatingStars value={course.rating} />
          <span>{course.students.toLocaleString()} students</span>
        </div>
        <div className="card-row">
          <strong>${course.price}</strong>
          <span>{course.duration}</span>
        </div>
      </div>
    </article>
  );
}

export function CourseGrid({ courses }) {
  return <div className="course-grid">{courses.map((course) => <CourseCard key={course.title} course={course} />)}</div>;
}

export function CourseListItem({ course }) {
  return (
    <article className="list-item">
      <img src={course.image} alt="" />
      <div>
        <h3>{course.title}</h3>
        <p>{course.level} · {course.duration} · by {course.instructor}</p>
        <ProgressBar value={course.progress} />
      </div>
      <strong>${course.price}</strong>
    </article>
  );
}

export function CoursePreviewVideo() {
  return <div className="preview-video"><PlayCircle size={54} /><span>Course preview</span></div>;
}

export function LessonList() {
  return (
    <div className="lesson-list">
      {['Welcome and setup', 'Core principles', 'Project workflow', 'Publishing your project'].map((lesson, index) => (
        <div key={lesson}><span>{index + 1}</span>{lesson}<small>{12 + index * 6} min</small></div>
      ))}
    </div>
  );
}

export function ReviewCard() {
  return <article className="review-card"><RatingStars value={5} /><p>Clear lessons, practical projects, and a pace that made the concepts stick.</p><strong>Maya K.</strong></article>;
}

export function EnrollmentButton() {
  return <button className="button button-primary"><ShoppingCart size={18} /> Enroll now</button>;
}
