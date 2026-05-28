import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CreditCard,
  GraduationCap,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Settings,
  ShieldAlert,
  Sparkles,
  UserRound,
  Users
} from 'lucide-react';

export const routeGroups = [
  {
    title: 'Landing & General',
    scope: 'public',
    icon: Home,
    pages: [
      { key: 'home', title: 'Home', path: '/home', description: 'A marketplace homepage with featured courses and platform highlights.' },
      { key: 'about', title: 'About', path: '/about', description: 'Company story, mission, and learning outcomes.' },
      { key: 'contact', title: 'Contact', path: '/contact', description: 'Support channels and a direct contact form.' },
      { key: 'faq', title: 'FAQ', path: '/faq', description: 'Common questions about courses, accounts, payments, and certificates.' },
      { key: 'terms', title: 'Terms & Conditions', path: '/terms', description: 'Platform usage, course policies, and account responsibilities.' },
      { key: 'privacy', title: 'Privacy Policy', path: '/privacy', description: 'How learner, instructor, and payment data is handled.' }
    ]
  },
  {
    title: 'Authentication',
    scope: 'public',
    icon: Lock,
    pages: [
      { key: 'login', title: 'Login', path: '/login', description: 'Sign in to continue learning or managing courses.' },
      { key: 'register', title: 'Register', path: '/register', description: 'Create a student or instructor account.' },
      { key: 'forgotPassword', title: 'Forgot Password', path: '/forgot-password', description: 'Request a secure password reset link.' },
      { key: 'resetPassword', title: 'Reset Password', path: '/reset-password', description: 'Set a new account password.' },
      { key: 'verifyEmail', title: 'Verify Email', path: '/verify-email', description: 'Confirm email ownership with a verification code.' }
    ]
  },
  {
    title: 'Course Related',
    scope: 'public',
    icon: BookOpen,
    pages: [
      { key: 'courses', title: 'Courses Listing', path: '/courses', description: 'Browse courses with filters, search, and pagination.' },
      { key: 'courseDetails', title: 'Course Details', path: '/courses/product-design-foundations', description: 'Course curriculum, instructor, reviews, and enrollment CTA.' },
      { key: 'categoryCourses', title: 'Category Courses', path: '/categories/design', description: 'Courses filtered by category.' },
      { key: 'searchResults', title: 'Search Results', path: '/search', description: 'Search results for learners exploring topics.' }
    ]
  },
  {
    title: 'Instructor Related',
    scope: 'public',
    icon: GraduationCap,
    pages: [
      { key: 'instructorListing', title: 'Instructor Listing', path: '/instructors', description: 'Discover expert instructors.' },
      { key: 'instructorProfile', title: 'Instructor Profile', path: '/instructors/amira-jay', description: 'Instructor biography, courses, stats, and reviews.' }
    ]
  },
  {
    title: 'Payment Related',
    scope: 'public',
    icon: CreditCard,
    pages: [
      { key: 'checkout', title: 'Checkout', path: '/checkout', description: 'Purchase summary, coupon input, and payment details.' },
      { key: 'paymentSuccess', title: 'Payment Success', path: '/payment/success', description: 'Successful purchase receipt and next steps.' },
      { key: 'paymentFailed', title: 'Payment Failed', path: '/payment/failed', description: 'Payment issue details and retry action.' },
      { key: 'orderHistory', title: 'Order History', path: '/orders', description: 'Learner purchase history and receipts.' }
    ]
  },
  {
    title: 'Student Pages',
    scope: 'student',
    icon: UserRound,
    pages: [
      { key: 'studentDashboard', title: 'Student Dashboard', path: '/student/dashboard', description: 'Learning progress, upcoming lessons, and recent activity.' },
      { key: 'myCourses', title: 'My Courses', path: '/student/my-courses', description: 'All enrolled courses.' },
      { key: 'continueLearning', title: 'Continue Learning', path: '/student/continue-learning', description: 'Resume active lessons quickly.' },
      { key: 'wishlist', title: 'Wishlist', path: '/student/wishlist', description: 'Saved courses for later.' },
      { key: 'myCertificates', title: 'My Certificates', path: '/student/certificates', description: 'Earned certificates and downloads.' },
      { key: 'notifications', title: 'Notifications', path: '/student/notifications', description: 'Course updates, replies, and platform messages.' },
      { key: 'profileSettings', title: 'Profile Settings', path: '/student/profile-settings', description: 'Student account and profile information.' },
      { key: 'changePassword', title: 'Change Password', path: '/student/change-password', description: 'Update account credentials.' },
      { key: 'reviewRatings', title: 'Review & Ratings', path: '/student/reviews', description: 'Submitted reviews and ratings.' }
    ]
  },
  {
    title: 'Instructor Pages',
    scope: 'instructor',
    icon: BriefcaseBusiness,
    pages: [
      { key: 'instructorDashboard', title: 'Instructor Dashboard', path: '/instructor/dashboard', description: 'Course performance, students, and earnings.' },
      { key: 'createCourse', title: 'Create Course', path: '/instructor/courses/create', description: 'Course builder with curriculum and pricing.' },
      { key: 'editCourse', title: 'Edit Course', path: '/instructor/courses/edit', description: 'Update course metadata and lessons.' },
      { key: 'uploadLessons', title: 'Upload Lessons', path: '/instructor/lessons/upload', description: 'Upload videos, resources, and lesson details.' },
      { key: 'courseAnalytics', title: 'Course Analytics', path: '/instructor/analytics', description: 'Enrollment, completion, and engagement charts.' },
      { key: 'studentEnrollments', title: 'Student Enrollments', path: '/instructor/enrollments', description: 'Learner roster and course status.' },
      { key: 'earningsDashboard', title: 'Earnings Dashboard', path: '/instructor/earnings', description: 'Revenue, payouts, and transaction summaries.' },
      { key: 'withdrawRequests', title: 'Withdraw Requests', path: '/instructor/withdrawals', description: 'Instructor payout requests.' },
      { key: 'instructorProfileSettings', title: 'Instructor Profile Settings', path: '/instructor/profile-settings', description: 'Public instructor profile and teaching details.' }
    ]
  },
  {
    title: 'Admin Pages',
    scope: 'admin',
    icon: ShieldAlert,
    pages: [
      { key: 'adminDashboard', title: 'Admin Dashboard', path: '/admin/dashboard', description: 'Platform-wide health and moderation overview.' },
      { key: 'manageUsers', title: 'Manage Users', path: '/admin/users', description: 'View, suspend, and support users.' },
      { key: 'manageCourses', title: 'Manage Courses', path: '/admin/courses', description: 'Approve, feature, and audit courses.' },
      { key: 'manageInstructors', title: 'Manage Instructors', path: '/admin/instructors', description: 'Instructor applications and status.' },
      { key: 'managePayments', title: 'Manage Payments', path: '/admin/payments', description: 'Payment transactions and refunds.' },
      { key: 'manageCategories', title: 'Manage Categories', path: '/admin/categories', description: 'Course taxonomy management.' },
      { key: 'reportsAnalytics', title: 'Reports & Analytics', path: '/admin/reports', description: 'Platform growth and content reports.' },
      { key: 'platformSettings', title: 'Platform Settings', path: '/admin/settings', description: 'Global platform settings.' }
    ]
  },
  {
    title: 'Error Pages',
    scope: 'public',
    icon: LifeBuoy,
    pages: [
      { key: 'notFound', title: '404 Not Found', path: '/404', description: 'Missing page state.' },
      { key: 'unauthorized', title: 'Unauthorized Access', path: '/unauthorized', description: 'Protected access warning.' },
      { key: 'serverError', title: 'Server Error', path: '/server-error', description: 'Unexpected error state.' }
    ]
  }
];

export const quickStats = [
  { label: 'Active learners', value: '42.8k', icon: Users },
  { label: 'Published courses', value: '1,280', icon: BookOpen },
  { label: 'Completion rate', value: '78%', icon: BarChart3 },
  { label: 'New this week', value: '96', icon: Sparkles }
];
