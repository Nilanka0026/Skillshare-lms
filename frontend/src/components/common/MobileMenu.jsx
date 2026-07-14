import { Link } from 'react-router-dom';
import { X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';
import { useTheme } from '../../context/useTheme.js';

export function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  let menuLinks = [];
  if (!isAuthenticated) {
    menuLinks = [
      ['Home', '/'],
      ['Explore Courses', '/courses'],
      ['Teachers', '/teachers'],
      ['About', '/about'],
      ['Contact', '/contact'],
      ['Login', '/login'],
      ['Register', '/register']
    ];
  } else if (user?.role === 'student') {
    menuLinks = [
      ['Home', '/'],
      ['Explore Courses', '/courses'],
      ['Chatbot', '/chatbot'],
      ['My Learning', '/dashboard/student/my-courses'],
      ['Student Dashboard', '/dashboard/student'],
      ['Profile Settings', '/dashboard/student/profile']
    ];
  } else if (user?.role === 'instructor') {
    menuLinks = [
      ['Home', '/'],
      ['Explore Courses', '/courses'],
      ['Teachers', '/teachers'],
      ['Chatbot', '/chatbot'],
      ['Teacher Dashboard', '/dashboard/teacher'],
      ['Create Course', '/dashboard/teacher/create-course'],
      ['Profile Settings', '/dashboard/teacher/profile']
    ];
  } else if (user?.role === 'admin') {
    menuLinks = [
      ['Home', '/'],
      ['Explore Courses', '/courses'],
      ['Teachers', '/teachers'],
      ['Chatbot', '/chatbot'],
      ['Admin Dashboard', '/dashboard/admin']
    ];
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/30 lg:hidden">
      <aside className="ml-auto h-full w-80 max-w-[88vw] bg-white dark:bg-gray-950 border-l border-transparent dark:border-gray-800 p-5 shadow-2xl transition-colors duration-300 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between">
          <span className="text-lg font-black">SkillShare</span>
<<<<<<< Updated upstream
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
=======
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={19} className="text-yellow-500" /> : <Moon size={19} />}
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 cursor-pointer" onClick={onClose} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
>>>>>>> Stashed changes
        </div>
        <nav className="mt-8 grid gap-2">
          {menuLinks.map(([label, path]) => (
            <Link key={path} to={path} onClick={onClose} className="rounded-xl px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-950 dark:hover:text-white transition-colors">
              {label}
            </Link>
          ))}
          {isAuthenticated && (
<<<<<<< Updated upstream
            <button onClick={handleLogout} className="rounded-xl px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-950 dark:hover:text-white transition-colors">
=======
            <button onClick={handleLogout} className="rounded-xl px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-950 cursor-pointer">
>>>>>>> Stashed changes
              Logout
            </button>
          )}
        </nav>
      </aside>
    </div>
  );
}
export default MobileMenu;
