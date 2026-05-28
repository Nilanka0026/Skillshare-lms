export function RoleSelector({ error, includeAdmin = false, label = 'Role', name = 'role', onChange, value }) {
  const roles = includeAdmin ? ['student', 'instructor', 'admin'] : ['student', 'instructor'];

  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
      >
        <option value="">Select role</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role[0].toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
      {error && <span className="block text-sm font-medium text-red-600">{error}</span>}
    </label>
  );
}
