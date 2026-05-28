import { categories } from '../../data/platformData.js';

export function FilterSidebar({ category, onCategoryChange, onPriceChange, price }) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-black text-gray-950">Filters</h3>
      <label className="mt-5 block space-y-2">
        <span className="text-sm font-semibold text-gray-700">Category</span>
        <select value={category} onChange={onCategoryChange} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500">
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-gray-700">Price</span>
        <select value={price} onChange={onPriceChange} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500">
          <option value="">All prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </label>
    </aside>
  );
}
