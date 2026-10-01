import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { CourseCard } from '../../components/common/CourseCard.jsx';
import { FilterSidebar } from '../../components/common/FilterSidebar.jsx';
import { Pagination } from '../../components/common/Pagination.jsx';
import { SearchBar } from '../../components/common/SearchBar.jsx';
import { courseApi } from '../../services/api.js';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [apiCourses, setApiCourses] = useState([]);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState('');

  // Sync state with URL search params when URL changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Fetch from backend API
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;

    courseApi.list(params)
      .then((data) => {
        setApiCourses(data);
        setApiError('');
      })
      .catch((error) => {
        setApiError(error.message);
      })
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('category', val);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams, { replace: true });
  };

  const clearSearch = () => {
    setSearch('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams, { replace: true });
  };

  const filteredCourses = useMemo(() => {
    return apiCourses.filter((course) => {
      const matchesPrice = !price || (price === 'free' ? course.price === 0 : course.price > 0);
      return matchesPrice;
    });
  }, [apiCourses, price]);

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black text-gray-950">Explore Courses</h1>
          <p className="mt-3 text-gray-600">
            Search keyword, filter categories, and find practical courses taught by industry professionals.
          </p>
          {apiError && (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              Could not fetch courses from backend: {apiError}.
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            category={category}
            onCategoryChange={handleCategoryChange}
            onPriceChange={(event) => setPrice(event.target.value)}
            price={price}
          />
          <div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1">
                <SearchBar value={search} onChange={handleSearchChange} placeholder="Search course title, description, or instructor..." />
              </div>
              {search && (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center gap-1.5 justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  <X size={16} /> Clear Search
                </button>
              )}
            </div>

            {search && (
              <p className="mt-4 text-sm font-bold text-gray-700">
                Showing results for &ldquo;<span className="text-blue-600">{search}</span>&rdquo; ({filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found)
              </p>
            )}

            {loading && (
              <div className="mt-8 text-center text-sm font-semibold text-gray-500 py-12">
                Searching courses...
              </div>
            )}

            {!loading && filteredCourses.length === 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <h3 className="text-xl font-black text-gray-900">No courses match your search</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try searching for a different keyword like &quot;React&quot;, &quot;Design&quot;, &quot;Python&quot;, or &quot;Jenkins&quot;.
                </p>
                {search && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
                  >
                    View All Courses
                  </button>
                )}
              </div>
            )}

            {!loading && filteredCourses.length > 0 && (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id || course.id} course={course} />
                ))}
              </div>
            )}

            <Pagination />
          </div>
        </div>
      </div>
    </section>
  );
}
