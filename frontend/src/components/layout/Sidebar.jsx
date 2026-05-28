import { NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { routeGroups } from '../../data/navigation.js';

export function Sidebar() {
  const dashboardGroups = routeGroups.filter((group) => group.scope !== 'public');

  return (
    <aside className="sidebar">
      <NavLink className="brand sidebar-brand" to="/home">
        <span className="brand-mark"><BookOpen size={21} /></span>
        <span>SkillShare</span>
      </NavLink>
      <div className="sidebar-scroll">
        {dashboardGroups.map((group) => {
          const Icon = group.icon;
          return (
            <section key={group.title} className="sidebar-section">
              <h3><Icon size={15} /> {group.title}</h3>
              {group.pages.map((page) => (
                <NavLink key={page.path} to={page.path}>
                  {page.title}
                </NavLink>
              ))}
            </section>
          );
        })}
      </div>
    </aside>
  );
}
