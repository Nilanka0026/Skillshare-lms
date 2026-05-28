import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <h2 className="text-xl font-black text-gray-950">SkillShare</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
            A frontend-ready learning marketplace for students, instructors, and platform admins.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-600">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
