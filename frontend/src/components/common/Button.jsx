export function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
