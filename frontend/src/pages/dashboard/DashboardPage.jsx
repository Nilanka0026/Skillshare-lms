import { CheckSquare, Circle, Save, Upload } from 'lucide-react';
import { CourseListItem } from '../../components/course/CourseComponents.jsx';
import { AnalyticsGraph, DashboardCards, NotificationsPanel, RecentActivity } from '../../components/domain/DashboardComponents.jsx';
import { EarningsChart, StudentList } from '../../components/domain/InstructorComponents.jsx';
import { TransactionHistoryTable } from '../../components/domain/PaymentComponents.jsx';
import { Button, Checkbox, InputField, RadioButton, SelectDropdown, Textarea } from '../../components/ui/index.jsx';
import { categories, courses } from '../../data/mockData.js';

export function DashboardPage({ page }) {
  const formLike = page.key?.includes('create') || page.key?.includes('edit') || page.key?.includes('upload') || page.key?.includes('settings') || page.key?.includes('Password');
  const paymentLike = page.key?.includes('earnings') || page.key?.includes('Payments') || page.key?.includes('withdraw');

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <DashboardCards />
      {formLike ? (
        <div className="form-grid">
          <form className="form-card">
            <InputField label="Title" placeholder={page.title} />
            <SelectDropdown label="Category" options={categories} />
            <Textarea label="Description" rows="4" />
            <Checkbox label="Publish after review" />
            <RadioButton name="visibility" label="Public" />
            <div className="button-row">
              <Button><Save size={18} /> Save</Button>
              <Button variant="ghost"><Upload size={18} /> Upload</Button>
            </div>
          </form>
          <RecentActivity />
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <AnalyticsGraph />
            <NotificationsPanel />
          </div>
          <div className="dashboard-grid">
            <RecentActivity />
            <div className="chart-panel">
              <h3>{paymentLike ? 'Transaction History Table' : 'Student List'}</h3>
              {paymentLike ? <TransactionHistoryTable /> : <StudentList />}
            </div>
          </div>
          <div className="chart-panel">
            <h3>{paymentLike ? 'Earnings Chart' : 'Course Progress'}</h3>
            {paymentLike ? <EarningsChart /> : courses.map((course) => <CourseListItem key={course.title} course={course} />)}
          </div>
          <div className="status-row">
            <span><CheckSquare size={17} /> Ready for backend API integration</span>
            <span><Circle size={12} fill="currentColor" /> Mock data enabled</span>
          </div>
        </>
      )}
    </section>
  );
}
