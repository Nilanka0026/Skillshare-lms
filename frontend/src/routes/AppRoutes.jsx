import { Navigate, Route, Routes } from 'react-router-dom';
import { adminLinks, instructorLinks, studentLinks } from '../data/platformData.js';
import { DashboardShell } from '../layouts/DashboardShell.jsx';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleBasedRoute } from './RoleBasedRoute.jsx';
import { About } from '../pages/public/About.jsx';
import { Contact } from '../pages/public/Contact.jsx';
import { CourseDetails } from '../pages/courses/CourseDetails.jsx';
import { Courses } from '../pages/courses/Courses.jsx';
import { Faq } from '../pages/public/Faq.jsx';
import { Home } from '../pages/public/Home.jsx';
import { Instructors } from '../pages/public/Instructors.jsx';
import { Legal } from '../pages/public/Legal.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Register } from '../pages/auth/Register.jsx';
import { ResetPassword } from '../pages/auth/ResetPassword.jsx';
import { Checkout } from '../pages/payment/Checkout.jsx';
import { PaymentFailed } from '../pages/payment/PaymentFailed.jsx';
import { PaymentProcessing } from '../pages/payment/PaymentProcessing.jsx';
import { PaymentSuccess } from '../pages/payment/PaymentSuccess.jsx';
import { LearningPage } from '../pages/dashboard/student/LearningPage.jsx';
import { StudentPage } from '../pages/dashboard/student/StudentPage.jsx';
import { InstructorPage } from '../pages/dashboard/instructor/InstructorPage.jsx';
import { AdminPage } from '../pages/dashboard/admin/AdminPage.jsx';
import { NotFound } from '../pages/public/NotFound.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="search" element={<Courses />} />
        <Route path="categories" element={<Courses />} />
        <Route path="pricing" element={<Courses />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<Faq />} />
        <Route path="terms" element={<Legal title="Terms & Conditions" />} />
        <Route path="privacy" element={<Legal title="Privacy Policy" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ResetPassword title="Forgot Password" />} />
        <Route path="reset-password" element={<ResetPassword title="Reset Password" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout/:courseId" element={<Checkout />} />
          <Route path="payment/processing" element={<PaymentProcessing />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/failed" element={<PaymentFailed />} />
        </Route>
      </Route>

      <Route element={<RoleBasedRoute allowedRoles={['student']} />}>
        <Route element={<DashboardShell links={studentLinks} title="Student Dashboard" />}>
          <Route path="dashboard/student" element={<StudentPage title="Student Dashboard" view="overview" />} />
          <Route path="dashboard/student/my-courses" element={<StudentPage title="My Courses" view="courses" />} />
          <Route path="dashboard/student/learning/:courseId" element={<LearningPage />} />
          <Route path="dashboard/student/wishlist" element={<StudentPage title="Wishlist" view="wishlist" />} />
          <Route path="dashboard/student/certificates" element={<StudentPage title="Certificates" view="certificates" />} />
          <Route path="dashboard/student/notifications" element={<StudentPage title="Notifications" view="notifications" />} />
          <Route path="dashboard/student/profile" element={<StudentPage title="Profile Settings" view="profile" />} />
        </Route>
      </Route>

      <Route element={<RoleBasedRoute allowedRoles={['instructor']} />}>
        <Route element={<DashboardShell links={instructorLinks} title="Instructor Dashboard" />}>
          <Route path="dashboard/instructor" element={<InstructorPage title="Instructor Dashboard" view="overview" />} />
          <Route path="dashboard/instructor/create-course" element={<InstructorPage title="Create Course" view="create" />} />
          <Route path="dashboard/instructor/courses" element={<InstructorPage title="Manage Courses" view="courses" />} />
          <Route path="dashboard/instructor/lessons" element={<InstructorPage title="Upload Lessons" view="lessons" />} />
          <Route path="dashboard/instructor/enrollments" element={<InstructorPage title="Student Enrollments" view="enrollments" />} />
          <Route path="dashboard/instructor/earnings" element={<InstructorPage title="Earnings Dashboard" view="earnings" />} />
          <Route path="dashboard/instructor/analytics" element={<InstructorPage title="Analytics" view="analytics" />} />
          <Route path="dashboard/instructor/reviews" element={<InstructorPage title="Reviews" view="reviews" />} />
          <Route path="dashboard/instructor/profile" element={<InstructorPage title="Profile Settings" view="profile" />} />
        </Route>
      </Route>

      <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardShell links={adminLinks} title="Admin Dashboard" />}>
          <Route path="dashboard/admin" element={<AdminPage title="Admin Dashboard" view="overview" />} />
          <Route path="dashboard/admin/users" element={<AdminPage title="Manage Users" view="users" />} />
          <Route path="dashboard/admin/courses" element={<AdminPage title="Manage Courses" view="courses" />} />
          <Route path="dashboard/admin/instructors" element={<AdminPage title="Manage Instructors" view="instructors" />} />
          <Route path="dashboard/admin/payments" element={<AdminPage title="Manage Payments" view="payments" />} />
          <Route path="dashboard/admin/categories" element={<AdminPage title="Categories" view="categories" />} />
          <Route path="dashboard/admin/reports" element={<AdminPage title="Reports & Analytics" view="reports" />} />
          <Route path="dashboard/admin/settings" element={<AdminPage title="Platform Settings" view="settings" />} />
        </Route>
      </Route>

      <Route path="student/dashboard" element={<Navigate to="/dashboard/student" replace />} />
      <Route path="student/courses" element={<Navigate to="/dashboard/student/my-courses" replace />} />
      <Route path="student/learning/:courseId" element={<Navigate to="/dashboard/student/learning/product-design" replace />} />
      <Route path="instructor/dashboard" element={<Navigate to="/dashboard/instructor" replace />} />
      <Route path="instructor/create-course" element={<Navigate to="/dashboard/instructor/create-course" replace />} />
      <Route path="instructor/manage-courses" element={<Navigate to="/dashboard/instructor/courses" replace />} />
      <Route path="admin/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
      <Route path="admin/users" element={<Navigate to="/dashboard/admin/users" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
