import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function PaymentFailed() {
  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center bg-gray-50 px-4">
      <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <XCircle size={56} className="mx-auto text-red-600" />
        <h1 className="mt-4 text-3xl font-black text-gray-950">Payment Failed</h1>
        <p className="mt-3 text-gray-600">No charge was completed. You can retry checkout.</p>
        <Link to="/courses" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          Back to Courses
        </Link>
      </div>
    </section>
  );
}
