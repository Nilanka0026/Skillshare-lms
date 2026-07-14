import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/common/Footer.jsx';
import { MobileMenu } from '../components/common/MobileMenu.jsx';
import { Navbar } from '../components/common/Navbar.jsx';
import { ChatbotWidget } from '../components/common/ChatbotWidget.jsx';

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-300">
      <Navbar onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
