export function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-gray-950/30 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">{title}</h2>
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-3 py-1 text-sm font-semibold">Close</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
