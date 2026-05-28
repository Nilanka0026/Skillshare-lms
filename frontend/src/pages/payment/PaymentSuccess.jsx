import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export function PaymentSuccess() {
  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center bg-gray-50 px-4">
      <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 size={56} className="mx-auto text-blue-600" />
        <h1 className="mt-4 text-3xl font-black text-gray-950">Payment Successful</h1>
        <p className="mt-3 text-gray-600">Course access is now unlocked in the student dashboard.</p>
        <Link to="/dashboard/student/learning/product-design" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          Continue Learning
        </Link>
      </div>
    </section>
  );
}
