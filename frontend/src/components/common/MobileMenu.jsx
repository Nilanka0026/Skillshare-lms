import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';

export function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated, logout, user } = useAuth();

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
      ['My Learning', '/dashboard/student/my-courses'],
      ['Student Dashboard', '/dashboard/student'],
      ['Profile Settings', '/dashboard/student/profile']
    ];
  } else if (user?.role === 'instructor') {
    menuLinks = [
      ['Home', '/'],
      ['Explore Courses', '/courses'],
      ['Teachers', '/teachers'],
      ['Teacher Dashboard', '/dashboard/teacher'],
      ['Create Course', '/dashboard/teacher/create-course'],
      ['Profile Settings', '/dashboard/teacher/profile']
    ];
  } else if (user?.role === 'admin') {
    menuLinks = [
      ['Home', '/'],
      ['Explore Courses', '/courses'],
      ['Teachers', '/teachers'],
      ['Admin Dashboard', '/dashboard/admin']
    ];
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/30 lg:hidden">
      <aside className="ml-auto h-full w-80 max-w-[88vw] bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-lg font-black">SkillShare</span>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-8 grid gap-2">
          {menuLinks.map(([label, path]) => (
            <Link key={path} to={path} onClick={onClose} className="rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-950">
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <button onClick={handleLogout} className="rounded-xl px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-950">
              Logout
            </button>
          )}
        </nav>
      </aside>
    </div>
  );
}
export default MobileMenu;
