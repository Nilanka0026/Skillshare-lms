import { useEffect, useMemo, useState } from 'react';
import { CourseCard } from '../../components/common/CourseCard.jsx';
import { FilterSidebar } from '../../components/common/FilterSidebar.jsx';
import { Pagination } from '../../components/common/Pagination.jsx';
import { SearchBar } from '../../components/common/SearchBar.jsx';
import { courses } from '../../data/platformData.js';
import { courseApi } from '../../services/api.js';

export function Courses() {
  const [apiCourses, setApiCourses] = useState([]);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    courseApi.list()
      .then((data) => {
        setApiCourses(data);
      })
      .catch((error) => {
        setApiError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const sourceCourses = apiCourses.length > 0 ? apiCourses : courses;

  const filteredCourses = useMemo(() => sourceCourses.filter((course) => {
    const instructorName = typeof course.instructor === 'object' ? course.instructor?.name || '' : course.instructor || '';
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || instructorName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || course.category === category;
    const matchesPrice = !price || (price === 'free' ? course.price === 0 : course.price > 0);
    return matchesSearch && matchesCategory && matchesPrice;
  }), [category, price, search, sourceCourses]);

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black text-gray-950">Courses</h1>
          <p className="mt-4 text-gray-600">Search, filter, and explore practical courses from the backend. Mock courses appear until your database has courses.</p>
          {apiError && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">Backend courses unavailable: {apiError}. Showing mock courses.</p>}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            category={category}
            onCategoryChange={(event) => setCategory(event.target.value)}
            onPriceChange={(event) => setPrice(event.target.value)}
            price={price}
          />
          <div>
            <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} />
            {loading && <p className="mt-4 text-sm font-semibold text-gray-500">Loading backend courses...</p>}
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => <CourseCard key={course._id || course.id} course={course} />)}
            </div>
            <Pagination />
          </div>
        </div>
      </div>
    </section>
  );
}
