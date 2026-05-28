import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Menu, Search, UserRound } from 'lucide-react';

const navItems = [
  ['Home', '/home'],
  ['Courses', '/courses'],
  ['Instructors', '/instructors'],
  ['FAQ', '/faq']
];

export function Navbar() {
  return (
    <header className="navbar">
      <Link className="brand" to="/home">
        <span className="brand-mark"><BookOpen size={21} /></span>
        <span>SkillShare</span>
      </Link>
      <nav className="nav-links">
        {navItems.map(([label, path]) => (
          <NavLink key={path} to={path}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        <div className="mini-search">
          <Search size={16} />
          <input placeholder="Search" />
        </div>
        <Link className="button button-ghost" to="/login"><UserRound size={17} /> Login</Link>
        <Link className="button button-primary" to="/register">Join</Link>
        <button className="icon-button mobile-only" aria-label="Open menu"><Menu size={20} /></button>
      </div>
    </header>
  );
}
