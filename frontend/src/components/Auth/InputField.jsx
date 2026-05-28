import { Eye, EyeOff } from 'lucide-react';

export function InputField({
  error,
  label,
  name,
  onToggleVisibility,
  showPasswordToggle = false,
  type = 'text',
  visible = false,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-200" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none backdrop-blur-md transition duration-200 focus:border-cyan-300 focus:bg-white/15 focus:ring-4 focus:ring-cyan-300/10 ${
            error ? 'border-rose-400/80' : 'border-white/15 hover:border-white/30'
          } ${showPasswordToggle ? 'pr-12' : ''}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-sm font-medium text-rose-300">{error}</p>}
    </div>
  );
}
