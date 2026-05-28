export function FormInput({ error, label, name, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <input
        name={name}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
        {...props}
      />
      {error && <span className="block text-sm font-medium text-red-600">{error}</span>}
    </label>
  );
}
