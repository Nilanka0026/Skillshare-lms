import { createElement } from 'react';

export function DashboardCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {createElement(Icon, { size: 22, className: 'text-blue-600' })}
      <p className="mt-4 text-sm font-semibold text-gray-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-gray-950">{value}</strong>
    </article>
  );
}
