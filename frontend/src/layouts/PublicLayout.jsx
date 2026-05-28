import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/common/Footer.jsx';
import { MobileMenu } from '../components/common/MobileMenu.jsx';
import { Navbar } from '../components/common/Navbar.jsx';

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
