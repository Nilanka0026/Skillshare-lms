import { Navigate, Route, Routes } from 'react-router-dom';
import { adminLinks, instructorLinks, studentLinks } from '../data/platformData.js';
import { DashboardShell } from '../layouts/DashboardShell.jsx';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleBasedRoute } from './RoleBasedRoute.jsx';
import { About } from '../pages/public/About.jsx';
import { ChatbotPage } from '../pages/public/ChatbotPage.jsx';
import { Contact } from '../pages/public/Contact.jsx';
import { CourseDetails } from '../pages/courses/CourseDetails.jsx';
import { Courses } from '../pages/courses/Courses.jsx';
import { Faq } from '../pages/public/Faq.jsx';
import { Home } from '../pages/public/Home.jsx';
import { Instructors } from '../pages/public/Instructors.jsx';
import { Teachers } from '../pages/public/Teachers.jsx';
import { TeacherProfile } from '../pages/public/TeacherProfile.jsx';
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
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="search" element={<Courses />} />
        <Route path="categories" element={<Courses />} />
        <Route path="pricing" element={<Courses />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="teachers/:teacherId" element={<TeacherProfile />} />
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
          <Route path="chatbot" element={<ChatbotPage />} />
        </Route>

        {/* Student Dashboard (Nested inside PublicLayout so it has header/footer) */}
        <Route element={<RoleBasedRoute allowedRoles={['student']} />}>
          <Route path="dashboard/student" element={<DashboardShell links={studentLinks} title="Student Dashboard" />}>
            <Route index element={<StudentPage title="Student Dashboard" view="overview" />} />
            <Route path="my-courses" element={<StudentPage title="My Courses" view="courses" />} />
            <Route path="learning/:courseId" element={<LearningPage />} />
            <Route path="wishlist" element={<StudentPage title="Wishlist" view="wishlist" />} />
            <Route path="certificates" element={<StudentPage title="Certificates" view="certificates" />} />
            <Route path="notifications" element={<StudentPage title="Notifications" view="notifications" />} />
            <Route path="profile" element={<StudentPage title="Profile Settings" view="profile" />} />
          </Route>
        </Route>

        {/* Teacher Dashboard (Nested inside PublicLayout so it has header/footer) */}
        <Route element={<RoleBasedRoute allowedRoles={['instructor']} />}>
          <Route path="dashboard/teacher" element={<DashboardShell links={instructorLinks} title="Teacher Dashboard" />}>
            <Route index element={<InstructorPage title="Teacher Dashboard" view="overview" />} />
            <Route path="create-course" element={<InstructorPage title="Create Course" view="create" />} />
            <Route path="courses" element={<InstructorPage title="Manage Courses" view="courses" />} />
            <Route path="course/:courseId/students" element={<InstructorPage title="Course Students" view="students" />} />
            <Route path="analytics" element={<InstructorPage title="Analytics" view="analytics" />} />
            <Route path="profile" element={<InstructorPage title="Profile Settings" view="profile" />} />
          </Route>
        </Route>

        {/* Admin Dashboard (Nested inside PublicLayout so it has header/footer) */}
        <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
          <Route path="dashboard/admin" element={<DashboardShell links={adminLinks} title="Admin Dashboard" />}>
            <Route index element={<AdminPage title="Admin Dashboard" view="overview" />} />
            <Route path="users" element={<AdminPage title="Manage Users" view="users" />} />
            <Route path="courses" element={<AdminPage title="Manage Courses" view="courses" />} />
            <Route path="instructors" element={<AdminPage title="Manage Instructors" view="instructors" />} />
            <Route path="payments" element={<AdminPage title="Manage Payments" view="payments" />} />
            <Route path="categories" element={<AdminPage title="Categories" view="categories" />} />
            <Route path="reports" element={<AdminPage title="Reports & Analytics" view="reports" />} />
            <Route path="settings" element={<AdminPage title="Platform Settings" view="settings" />} />
          </Route>
        </Route>
      </Route>

      {/* Redirect fallbacks */}
      <Route path="student/dashboard" element={<Navigate to="/dashboard/student" replace />} />
      <Route path="student/courses" element={<Navigate to="/dashboard/student/my-courses" replace />} />
      <Route path="student/learning/:courseId" element={<Navigate to="/dashboard/student/learning/product-design" replace />} />
      
      {/* Teacher/Instructor Dashboard Redirects */}
      <Route path="dashboard/instructor" element={<Navigate to="/dashboard/teacher" replace />} />
      <Route path="dashboard/instructor/create-course" element={<Navigate to="/dashboard/teacher/create-course" replace />} />
      <Route path="dashboard/instructor/courses" element={<Navigate to="/dashboard/teacher/courses" replace />} />
      <Route path="dashboard/instructor/analytics" element={<Navigate to="/dashboard/teacher/analytics" replace />} />
      <Route path="dashboard/instructor/profile" element={<Navigate to="/dashboard/teacher/profile" replace />} />
      <Route path="instructor/dashboard" element={<Navigate to="/dashboard/teacher" replace />} />
      <Route path="instructor/create-course" element={<Navigate to="/dashboard/teacher/create-course" replace />} />
      <Route path="instructor/manage-courses" element={<Navigate to="/dashboard/teacher/courses" replace />} />
      
      <Route path="admin/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
      <Route path="admin/users" element={<Navigate to="/dashboard/admin/users" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
