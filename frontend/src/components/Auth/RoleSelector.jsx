export function RoleSelector({ error, onChange, value }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-200" htmlFor="role">
        Role
      </label>
      <select
        id="role"
        name="role"
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white outline-none backdrop-blur-md transition duration-200 focus:border-cyan-300 focus:bg-white/15 focus:ring-4 focus:ring-cyan-300/10 ${
          error ? 'border-rose-400/80' : 'border-white/15 hover:border-white/30'
        }`}
      >
        <option className="bg-slate-950 text-white" value="">
          Select your role
        </option>
        <option className="bg-slate-950 text-white" value="student">
          Student
        </option>
        <option className="bg-slate-950 text-white" value="instructor">
          Instructor
        </option>
      </select>
      {error && <p className="text-sm font-medium text-rose-300">{error}</p>}
    </div>
  );
}
