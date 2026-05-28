import { faqs } from '../../data/platformData.js';

export function Faq() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-950">FAQ</h1>
        <div className="mt-8 grid gap-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-black">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-gray-600">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
