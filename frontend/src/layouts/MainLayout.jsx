import { Outlet } from 'react-router-dom';
import { Footer } from '../components/layout/Footer.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';

export function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
