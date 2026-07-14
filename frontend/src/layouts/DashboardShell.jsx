import { Link, Outlet } from 'react-router-dom';
import { Bell, Menu, Search, Sun, Moon } from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar.jsx';
import { useAuth } from '../context/useAuth.js';
import { useTheme } from '../context/useTheme.js';

export function DashboardShell({ links, title }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar links={links} title={title} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 lg:hidden" aria-label="Open sidebar">
              <Menu size={20} />
            </button>
            <div className="hidden min-h-11 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 md:flex">
              <Search size={18} className="text-gray-500" />
              <input className="w-full border-0 outline-none placeholder:text-gray-400" placeholder="Search dashboard..." />
            </div>
            <Link to="/courses" className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 md:inline-flex">
              Explore Courses
            </Link>
            <button
              onClick={toggleTheme}
              className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={19} className="text-yellow-500" /> : <Moon size={19} />}
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 cursor-pointer" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black text-gray-950">{user?.name}</p>
              <p className="text-xs capitalize text-gray-500">{user?.role}</p>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
