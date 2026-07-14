import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';
<<<<<<< Updated upstream
import { useTheme } from '../../context/ThemeContext.jsx';
=======
import { useTheme } from '../../context/useTheme.js';
>>>>>>> Stashed changes
import { Button } from './Button.jsx';

export function Navbar({ onOpenMenu }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gray-950 dark:text-white font-bold'
      : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors duration-200';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-black text-gray-950 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-white border border-transparent dark:border-gray-800 transition-colors duration-300">
            <BookOpen size={21} />
          </span>
          SkillShare
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/courses" className={linkClass}>
            Explore Courses
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
                Student Dashboard
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'instructor' && (
            <>
              <NavLink to="/dashboard/teacher" end className={linkClass}>
                Teacher Dashboard
              </NavLink>
              <NavLink to="/dashboard/teacher/create-course" className={linkClass}>
                Create Course
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <NavLink to="/dashboard/admin" end className={linkClass}>
                Admin Dashboard
              </NavLink>
            </>
          )}
        </nav>

<<<<<<< Updated upstream
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
=======
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={19} className="text-yellow-500" /> : <Moon size={19} />}
          </button>

          {isAuthenticated ? (
            <>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-950 cursor-pointer">
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
          {/* Mobile Menu Toggle */}
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-950 dark:hover:text-white lg:hidden transition-colors cursor-pointer"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
=======
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={19} className="text-yellow-500" /> : <Moon size={19} />}
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 cursor-pointer" onClick={onOpenMenu} aria-label="Open menu">
>>>>>>> Stashed changes
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
