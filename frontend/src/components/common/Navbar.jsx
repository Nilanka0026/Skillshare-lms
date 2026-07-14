import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Button } from './Button.jsx';

export function Navbar({ onOpenMenu }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-black text-gray-950 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-white border border-transparent dark:border-gray-800 transition-colors duration-300">
            <BookOpen size={21} />
          </span>
          SkillShare
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-400 lg:flex">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
            Explore Courses
          </NavLink>
          {(!isAuthenticated || user?.role !== 'student') && (
            <NavLink to="/teachers" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
              Teachers
            </NavLink>
          )}
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
            Contact
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/chatbot" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
              Chatbot
            </NavLink>
          )}

          {isAuthenticated && user?.role === 'student' && (
            <>
              <NavLink to="/dashboard/student/my-courses" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
                My Learning
              </NavLink>
              <NavLink to="/dashboard/student" end className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
                Student Dashboard
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'instructor' && (
            <>
              <NavLink to="/dashboard/teacher" end className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
                Teacher Dashboard
              </NavLink>
              <NavLink to="/dashboard/teacher/create-course" className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
                Create Course
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <NavLink to="/dashboard/admin" end className={({ isActive }) => (isActive ? 'text-gray-950 dark:text-white font-bold' : 'hover:text-gray-950 dark:hover:text-white')}>
                Admin Dashboard
              </NavLink>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-950 dark:hover:text-white transition-all duration-300 focus:outline-none cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-amber-500 transition-transform hover:rotate-45" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>

          {/* Desktop Auth Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white cursor-pointer">
                <LogOut size={17} />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white">Login</Link>
                <Link to="/register"><Button>Register</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 dark:border-gray-800 lg:hidden text-gray-700 dark:text-gray-300 cursor-pointer" onClick={onOpenMenu} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
