import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button.jsx';
import { FormInput } from '../../components/common/FormInput.jsx';
import { useAuth } from '../../context/useAuth.js';

export function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const handleChange = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login({ email: values.email, password: values.password });
      // If user came from specific page, go there, otherwise go to role dashboard or home
      if (location.state?.from) {
        navigate(from, { replace: true });
      } else {
        const roleRedirect = {
          student: '/dashboard/student',
          instructor: '/dashboard/teacher',
          admin: '/dashboard/admin'
        };
        navigate(roleRedirect[loggedUser.role] || '/', { replace: true });
      }
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center bg-gray-50 px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black text-gray-950">Login</h1>
        <p className="mt-2 text-sm text-gray-600">Enter your credentials. Your account role will be matched automatically.</p>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
        <div className="mt-8 grid gap-4">
          <FormInput label="Email" name="email" value={values.email} onChange={handleChange} />
          <FormInput label="Password" name="password" type="password" value={values.password} onChange={handleChange} />
          <Button disabled={loading}>{loading && <LoaderCircle className="animate-spin" size={18} />} Login</Button>
        </div>
        <div className="mt-5 flex justify-between text-sm font-semibold">
          <Link to="/forgot-password" className="text-blue-600">Forgot password?</Link>
          <Link to="/register" className="text-gray-600">Create account</Link>
        </div>
      </form>
    </section>
  );
}
