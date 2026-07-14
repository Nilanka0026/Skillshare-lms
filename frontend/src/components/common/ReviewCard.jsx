import { Star } from 'lucide-react';

export function ReviewCard({ name = 'Maya K.', text = 'Practical lessons and a smooth learning experience.' }) {
  return (
    <article className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-colors duration-300">
      <div className="flex gap-1 text-amber-500">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{text}</p>
      <strong className="mt-4 block text-sm text-gray-950 dark:text-white">{name}</strong>
    </article>
  );
}
