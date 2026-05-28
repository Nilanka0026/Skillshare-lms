import { Button } from '../../components/common/Button.jsx';
import { FormInput } from '../../components/common/FormInput.jsx';

export function ResetPassword({ title }) {
  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center bg-gray-50 px-4 py-16">
      <form className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-gray-950">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">Frontend-only password recovery placeholder.</p>
        <div className="mt-8 grid gap-4">
          <FormInput label="Email" name="email" type="email" placeholder="you@example.com" />
          <Button>Continue</Button>
        </div>
      </form>
    </section>
  );
}
