import { Search, SlidersHorizontal } from 'lucide-react';
import { CourseGrid, CourseListItem } from '../../components/course/CourseComponents.jsx';
import { Badge, Pagination, SelectDropdown } from '../../components/ui/index.jsx';
import { categories, courses } from '../../data/mockData.js';

export function CourseListingPage({ page }) {
  return (
    <section className="page-section page-pad">
      <div className="page-header">
        <span className="eyebrow"><Search size={16} /> Course marketplace</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <div className="catalog-layout">
        <aside className="filter-sidebar">
          <h3><SlidersHorizontal size={18} /> Filter Sidebar</h3>
          <SelectDropdown label="Category" options={categories} />
          <SelectDropdown label="Level" options={['Beginner', 'Intermediate', 'Advanced']} />
          <SelectDropdown label="Price" options={['All', 'Free', 'Paid']} />
          <div className="category-stack">
            {categories.map((category) => <Badge key={category}>{category}</Badge>)}
          </div>
        </aside>
        <div>
          <div className="search-bar"><Search size={18} /><input placeholder="Search courses" /></div>
          <CourseGrid courses={courses} />
          <div className="list-stack">
            {courses.map((course) => <CourseListItem key={course.title} course={course} />)}
          </div>
          <Pagination />
        </div>
      </div>
    </section>
  );
}
