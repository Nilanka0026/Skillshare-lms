import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Star } from 'lucide-react';
import { CourseCard } from '../../components/common/CourseCard.jsx';
import { ReviewCard } from '../../components/common/ReviewCard.jsx';
import { courses } from '../../data/platformData.js';
import { courseApi } from '../../services/api.js';
import { formatCurrency } from '../../utils/formatters.js';

export function CourseDetails() {
  const { courseId } = useParams();
  const fallbackCourse = courses.find((item) => item.id === courseId) || courses[0];
  const [apiPayload, setApiPayload] = useState(null);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    courseApi.details(courseId)
      .then((data) => setApiPayload(data))
      .catch((error) => setApiError(error.message));
  }, [courseId]);

  const course = apiPayload?.course || fallbackCourse;
  const reviews = apiPayload?.reviews || [];
  const courseIdForLinks = course._id || course.id;
  const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor;
  const lessonItems = course.lessons?.length ? course.lessons : fallbackCourse.lessons;
  const rating = typeof course.ratings === 'object' ? course.ratings?.average || 0 : course.rating;
  const reviewCount = typeof course.ratings === 'object' ? course.ratings?.count || reviews.length : course.reviews;
  const studentCount = course.students || course.studentsEnrolled?.length || 0;
  const thumbnail = course.thumbnail || course.image;
  const relatedCourses = courses.filter((item) => item.id !== fallbackCourse.id).slice(0, 3);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{course.category}</span>
            <h1 className="mt-5 text-4xl font-black text-gray-950">{course.title}</h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">{course.description}</p>
            {apiError && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">Backend detail unavailable: {apiError}. Showing mock detail.</p>}
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Star size={16} className="text-amber-500" /> {rating || 'New'} ({reviewCount || 0} reviews)</span>
              <span>{studentCount.toLocaleString()} students</span>
              <span>{course.level || 'All levels'}</span>
              <span>{course.duration || 'Self-paced'}</span>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-black text-gray-950">Lessons List</h2>
              <div className="mt-4 grid gap-3">
                {lessonItems.map((lesson, index) => (
                  <div key={lesson._id || lesson.title || lesson} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                    <span className="flex items-center gap-3 font-semibold text-gray-800"><CheckCircle2 size={18} className="text-blue-600" /> {index + 1}. {lesson.title || lesson}</span>
                    <span className="text-sm text-gray-500">{lesson.duration || `${12 + index * 8} min`}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-black text-gray-950">Reviews</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {reviews.length > 0 ? reviews.map((review) => (
                  <ReviewCard key={review._id} name={review.userId?.name || 'Student'} text={review.comment} />
                )) : (
                  <>
                    <ReviewCard />
                    <ReviewCard name="Daniel P." text="Clear structure and realistic examples throughout the course." />
                  </>
                )}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <img src={thumbnail} alt={course.title} className="h-56 w-full rounded-xl object-cover" />
            <div className="mt-5 flex items-center justify-between">
              <strong className="text-3xl font-black text-gray-950">{formatCurrency(course.price)}</strong>
              <span className="text-sm text-gray-500">Lifetime access</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">Instructor: <strong>{instructorName || 'SkillShare Instructor'}</strong></p>
            <Link to={`/checkout/${courseIdForLinks}`} className="mt-5 inline-flex w-full justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Buy Course
            </Link>
          </aside>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-black text-gray-950">Related Courses</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {relatedCourses.map((item) => <CourseCard key={item.id} course={item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
