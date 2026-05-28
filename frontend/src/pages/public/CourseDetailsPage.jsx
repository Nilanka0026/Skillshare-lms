import { CoursePreviewVideo, EnrollmentButton, LessonList, ReviewCard } from '../../components/course/CourseComponents.jsx';
import { Breadcrumb, ProgressBar, RatingStars, Tabs } from '../../components/ui/index.jsx';
import { courses } from '../../data/mockData.js';

export function CourseDetailsPage({ page }) {
  const course = courses[0];

  return (
    <section className="page-section page-pad">
      <Breadcrumb items={['Home', 'Courses', course.title]} />
      <div className="details-layout">
        <div>
          <span className="badge">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{page.description}</p>
          <div className="inline-meta"><RatingStars value={course.rating} /><span>{course.students.toLocaleString()} students</span><span>{course.duration}</span></div>
          <Tabs />
          <LessonList />
          <ReviewCard />
        </div>
        <aside className="course-aside">
          <CoursePreviewVideo />
          <h3>${course.price}</h3>
          <EnrollmentButton />
          <ProgressBar value={course.progress} />
        </aside>
      </div>
    </section>
  );
}
