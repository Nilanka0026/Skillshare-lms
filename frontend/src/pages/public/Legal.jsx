export function Legal({ title }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-950">{title}</h1>
        <div className="mt-8 space-y-6 text-gray-600">
          <p>This frontend-only document is placeholder content for future legal policy integration.</p>
          <p>Account, course, payment, and instructor policies should be connected to backend-managed content later.</p>
        </div>
      </div>
    </section>
  );
}
