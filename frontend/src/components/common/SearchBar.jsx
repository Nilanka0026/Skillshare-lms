import { Search } from 'lucide-react';

export function SearchBar({ onChange, placeholder = 'Search courses...', value }) {
  return (
    <div className="flex min-h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4">
      <Search size={18} className="text-gray-500" />
      <input value={value} onChange={onChange} placeholder={placeholder} className="w-full border-0 bg-transparent text-gray-900 outline-none placeholder:text-gray-400" />
    </div>
  );
}
