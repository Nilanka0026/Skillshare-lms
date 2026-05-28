export function Pagination() {
  return (
    <div className="mt-8 flex justify-center gap-2">
      {['Prev', '1', '2', 'Next'].map((item) => (
        <button key={item} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${item === '1' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
          {item}
        </button>
      ))}
    </div>
  );
}
