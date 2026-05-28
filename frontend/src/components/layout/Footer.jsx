import { Link } from 'react-router-dom';
import { routeGroups } from '../../data/navigation.js';

export function Footer() {
  const links = routeGroups.find((group) => group.title === 'Landing & General').pages;

  return (
    <footer className="footer">
      <div>
        <h2>SkillShare</h2>
        <p>Learn practical skills from experienced instructors and keep every milestone in one dashboard.</p>
      </div>
      <div className="footer-links">
        {links.map((link) => (
          <Link key={link.path} to={link.path}>{link.title}</Link>
        ))}
      </div>
    </footer>
  );
}
