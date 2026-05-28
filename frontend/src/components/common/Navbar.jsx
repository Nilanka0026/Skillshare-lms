import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';
import { Button } from './Button.jsx';

export function Navbar({ onOpenMenu }) {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-black text-gray-950">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100 text-gray-950">
            <BookOpen size={21} />
          </span>
          SkillShare
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-gray-600 lg:flex">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
            Home
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink to="/courses" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Courses
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                About
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Contact
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'student' && (
            <>
              <NavLink to="/courses" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Explore Courses
              </NavLink>
              <NavLink to="/dashboard/student/my-courses" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                My Learning
              </NavLink>
              <NavLink to="/dashboard/student" end className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/student/profile" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Profile
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'instructor' && (
            <>
              <NavLink to="/courses" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Explore Courses
              </NavLink>
              <NavLink to="/dashboard/instructor" end className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Instructor Dashboard
              </NavLink>
              <NavLink to="/dashboard/instructor/create-course" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Create Course
              </NavLink>
              <NavLink to="/dashboard/instructor/profile" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Profile
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <NavLink to="/dashboard/admin" end className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Admin Dashboard
              </NavLink>
              <NavLink to="/dashboard/admin/users" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Users
              </NavLink>
              <NavLink to="/dashboard/admin/courses" className={({ isActive }) => (isActive ? 'text-gray-950' : 'hover:text-gray-950')}>
                Courses
              </NavLink>
            </>
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-950">
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-950">Login</Link>
              <Link to="/register"><Button>Register</Button></Link>
            </>
          )}
        </div>

        <button className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-gray-200 lg:hidden" onClick={onOpenMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
export default Navbar;
