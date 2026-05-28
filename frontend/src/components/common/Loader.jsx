import { LoaderCircle } from 'lucide-react';

export function Loader({ label = 'Loading...' }) {
  return <div className="flex items-center gap-2 text-sm font-semibold text-gray-600"><LoaderCircle className="animate-spin" size={18} /> {label}</div>;
}
