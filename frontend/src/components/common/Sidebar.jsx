import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { createElement } from 'react';
import { useAuth } from '../../context/useAuth.js';

export function Sidebar({ links, title }) {
  const { logout } = useAuth();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-gray-200 bg-white lg:block">
      <div className="border-b border-gray-200 p-6">
        <div className="text-lg font-black text-gray-950">SkillShare</div>
        <p className="mt-1 text-sm text-gray-500">{title}</p>
      </div>
      <nav className="grid gap-1 p-4">
        {links.map(([label, path, Icon]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              }`
            }
          >
            {createElement(Icon, { size: 18 })}
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-950">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
