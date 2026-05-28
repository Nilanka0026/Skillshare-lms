import { formatCurrency } from '../../utils/formatters.js';

export function PaymentSummary({ course }) {
  const discount = 10;
  const total = Math.max(course.price - discount, 0);

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-black text-gray-950">Payment Summary</h3>
      <div className="mt-5 space-y-3 text-sm text-gray-600">
        <p className="flex justify-between"><span>{course.title}</span><strong>{formatCurrency(course.price)}</strong></p>
        <p className="flex justify-between"><span>Discount</span><strong>-{formatCurrency(discount)}</strong></p>
        <p className="flex justify-between border-t border-gray-200 pt-3 text-base text-gray-950"><span>Total</span><strong>{formatCurrency(total)}</strong></p>
      </div>
    </aside>
  );
}
