import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Button } from './Button.jsx';

export function Navbar({ onOpenMenu }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gray-950 dark:text-white font-bold'
      : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors duration-200';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-black text-gray-950 dark:text-white shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-white border border-transparent dark:border-gray-800 transition-colors duration-300">
            <BookOpen size={21} />
          </span>
          SkillShare
        </Link>

        {/* Header Search Input */}
        <form onSubmit={handleNavSearch} className="hidden sm:flex items-center relative max-w-xs w-full ml-2">
          <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900"
          />
        </form>

        <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex ml-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/courses" className={linkClass}>
            Courses
          </NavLink>
          {(!isAuthenticated || user?.role !== 'student') && (
            <NavLink to="/teachers" className={linkClass}>
              Teachers
            </NavLink>
          )}
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/chatbot" className={linkClass}>
              Chatbot
            </NavLink>
          )}

          {isAuthenticated && user?.role === 'student' && (
            <>
              <NavLink to="/dashboard/student/my-courses" className={linkClass}>
                My Learning
              </NavLink>
              <NavLink to="/dashboard/student" end className={linkClass}>
                Dashboard
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'instructor' && (
            <>
              <NavLink to="/dashboard/teacher" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/teacher/create-course" className={linkClass}>
                Create Course
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <NavLink to="/dashboard/admin" end className={linkClass}>
                Admin
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
              <Moon size={20} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Desktop Auth Section */}
          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                <LogOut size={17} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-950 dark:hover:text-white lg:hidden transition-colors cursor-pointer"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
