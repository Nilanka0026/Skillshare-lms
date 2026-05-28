import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-5xl font-black text-gray-950">404</h1>
        <p className="mt-3 text-gray-600">The page you requested does not exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Back Home</Link>
      </div>
    </section>
  );
}
