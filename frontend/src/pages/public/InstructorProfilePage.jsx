import { CourseGrid } from '../../components/course/CourseComponents.jsx';
import { EarningsChart, InstructorStats, StudentList } from '../../components/domain/InstructorComponents.jsx';
import { courses } from '../../data/mockData.js';

export function InstructorProfilePage({ page }) {
  return (
    <section className="page-section page-pad">
      <div className="profile-hero">
        <div className="avatar large">A</div>
        <div>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <InstructorStats />
        </div>
      </div>
      <div className="two-col">
        <div className="chart-panel"><h3>Earnings Chart</h3><EarningsChart /></div>
        <div className="chart-panel"><h3>Student List</h3><StudentList /></div>
      </div>
      <CourseGrid courses={courses} />
    </section>
  );
}
