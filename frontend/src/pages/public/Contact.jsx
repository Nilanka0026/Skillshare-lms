import { Button } from '../../components/common/Button.jsx';
import { FormInput } from '../../components/common/FormInput.jsx';

export function Contact() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
        <div>
          <h1 className="text-4xl font-black text-gray-950">Contact</h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">Send a message to the SkillShare support team.</p>
        </div>
        <form className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <FormInput label="Name" name="name" placeholder="Your name" />
          <FormInput label="Email" name="email" placeholder="you@example.com" />
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-gray-900">Message</span>
            <textarea className="min-h-36 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
          <Button>Send Message</Button>
        </form>
      </div>
    </section>
  );
}
