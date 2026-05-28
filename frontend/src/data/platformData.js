import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';

export const courses = [
  {
    id: 'product-design',
    title: 'Product Design Foundations',
    category: 'Design',
    instructor: 'Amira Jay',
    rating: 4.9,
    reviews: 842,
    students: 12840,
    price: 49,
    level: 'Beginner',
    duration: '8h 20m',
    lessons: ['Design thinking basics', 'User research', 'Wireframes', 'Portfolio project'],
    description: 'Learn practical UI and product design through hands-on workflows and portfolio-ready projects.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'mern-marketplace',
    title: 'MERN Stack Marketplace',
    category: 'Development',
    instructor: 'Noah Silva',
    rating: 4.8,
    reviews: 691,
    students: 9310,
    price: 69,
    level: 'Intermediate',
    duration: '12h 10m',
    lessons: ['React architecture', 'Express APIs', 'MongoDB models', 'Payments-ready checkout'],
    description: 'Build a complete marketplace frontend and backend foundation using modern MERN practices.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'growth-marketing',
    title: 'Digital Marketing Systems',
    category: 'Marketing',
    instructor: 'Priya Sen',
    rating: 4.7,
    reviews: 520,
    students: 7520,
    price: 39,
    level: 'All levels',
    duration: '6h 45m',
    lessons: ['Funnels', 'Campaign planning', 'Analytics', 'Retention loops'],
    description: 'Create repeatable marketing systems using campaigns, analytics, and practical optimization.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'data-dashboard',
    title: 'Data Dashboard Essentials',
    category: 'Data',
    instructor: 'Lena Hart',
    rating: 4.8,
    reviews: 433,
    students: 6120,
    price: 59,
    level: 'Intermediate',
    duration: '7h 05m',
    lessons: ['Metrics planning', 'Charts', 'Dashboards', 'Insights'],
    description: 'Turn raw data into focused dashboards that teams can understand and act on quickly.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80'
  }
];

export const categories = ['Design', 'Development', 'Marketing', 'Business', 'Data', 'Photography'];

export const instructors = [
  { name: 'Amira Jay', role: 'Product Design', students: '18.4k', courses: 12, rating: 4.9 },
  { name: 'Noah Silva', role: 'Full-stack Development', students: '14.1k', courses: 9, rating: 4.8 },
  { name: 'Priya Sen', role: 'Growth Marketing', students: '11.6k', courses: 7, rating: 4.7 }
];

export const testimonials = [
  { name: 'Maya K.', text: 'The lessons are practical and the dashboard makes it easy to keep momentum.' },
  { name: 'Daniel P.', text: 'I used the instructor tools to launch my first paid course in a weekend.' },
  { name: 'Sara L.', text: 'Clean learning flow, useful notes, and certificates all in one place.' }
];

export const faqs = [
  ['Can I learn at my own pace?', 'Yes. Courses are on demand and progress is saved automatically.'],
  ['Can instructors publish paid courses?', 'Yes. The frontend is ready for course pricing and future payment integration.'],
  ['Which payment gateways are planned?', 'The checkout UI is prepared for Stripe and PayHere integration.'],
  ['Is there a backend connected?', 'Not yet. This version uses mock data and fake authentication state.']
];

export const stats = [
  { label: 'Active learners', value: '42.8k', icon: Users },
  { label: 'Published courses', value: '1,280', icon: BookOpen },
  { label: 'Top instructors', value: '320+', icon: GraduationCap },
  { label: 'Course revenue', value: '$128k', icon: CreditCard }
];

export const studentLinks = [
  ['Overview', '/dashboard/student', LayoutDashboard],
  ['My Courses', '/dashboard/student/my-courses', BookOpen],
  ['Continue Learning', '/dashboard/student/learning/product-design', GraduationCap],
  ['Wishlist', '/dashboard/student/wishlist', Star],
  ['Certificates', '/dashboard/student/certificates', ShieldCheck],
  ['Notifications', '/dashboard/student/notifications', Users],
  ['Profile Settings', '/dashboard/student/profile', Settings]
];

export const instructorLinks = [
  ['Overview', '/dashboard/instructor', LayoutDashboard],
  ['Create Course', '/dashboard/instructor/create-course', BookOpen],
  ['Manage Courses', '/dashboard/instructor/courses', BriefcaseBusiness],
  ['Upload Lessons', '/dashboard/instructor/lessons', GraduationCap],
  ['Enrollments', '/dashboard/instructor/enrollments', Users],
  ['Earnings', '/dashboard/instructor/earnings', CreditCard],
  ['Analytics', '/dashboard/instructor/analytics', BarChart3],
  ['Reviews', '/dashboard/instructor/reviews', Star],
  ['Profile Settings', '/dashboard/instructor/profile', Settings]
];

export const adminLinks = [
  ['Overview', '/dashboard/admin', LayoutDashboard],
  ['Manage Users', '/dashboard/admin/users', Users],
  ['Manage Courses', '/dashboard/admin/courses', BookOpen],
  ['Manage Instructors', '/dashboard/admin/instructors', GraduationCap],
  ['Manage Payments', '/dashboard/admin/payments', CreditCard],
  ['Categories', '/dashboard/admin/categories', BriefcaseBusiness],
  ['Reports & Analytics', '/dashboard/admin/reports', BarChart3],
  ['Platform Settings', '/dashboard/admin/settings', Settings]
];

export const tableRows = [
  ['Maya Khan', 'Student', 'Active', '$49.00'],
  ['Noah Silva', 'Instructor', 'Active', '$1,240.00'],
  ['Priya Sen', 'Instructor', 'Review', '$890.00'],
  ['Daniel Perera', 'Student', 'Active', '$69.00']
];
