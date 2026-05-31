import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <h2 className="text-xl font-black text-white">SkillShare</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-300">
            A premium learning marketplace for students, teachers, and platform admins to collaborate.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm font-semibold text-gray-300 items-center">
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/faq" className="hover:text-white transition">FAQ</Link>
          <Link to="/terms" className="hover:text-white transition">Terms</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
