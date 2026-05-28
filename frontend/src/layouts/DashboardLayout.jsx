import { Outlet } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.jsx';

export function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="icon-button" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="search-input">
            <Search size={18} />
            <input placeholder="Search courses, learners, payments..." />
          </div>
          <button className="icon-button" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
