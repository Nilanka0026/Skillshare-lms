import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, LoaderCircle, Sparkles } from 'lucide-react';
import { InputField } from '../components/Auth/InputField.jsx';
import { RoleSelector } from '../components/Auth/RoleSelector.jsx';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
};

export function Register() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleText = useMemo(() => {
    if (formData.role === 'instructor') {
      return 'Start teaching and earn from your courses';
    }

    if (formData.role === 'student') {
      return 'Start learning from top instructors';
    }

    return 'Choose how you want to grow with SkillShare';
  }, [formData.role]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ''
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.role) {
      nextErrors.role = 'Select a role.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      console.log('SkillShare signup data:', formData);
      setIsLoading(false);
    }, 700);
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-136px)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-slate-900 lg:block">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
            alt="Learners collaborating"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/60 to-cyan-950/60" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <Link to="/home" className="inline-flex items-center gap-3 text-xl font-black">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 text-slate-950">
                <BookOpen size={23} />
              </span>
              SkillShare
            </Link>

            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
                <Sparkles size={16} />
                Join the learning marketplace
              </span>
              <div className="space-y-4">
                <h1 className="max-w-md text-5xl font-black leading-tight">
                  Build skills, share knowledge, grow faster.
                </h1>
                <p className="max-w-md text-lg leading-8 text-slate-200">
                  Create one account for focused courses, instructor tools, progress tracking, and certificates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['1.2k courses', '42k learners', 'Top mentors'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold backdrop-blur-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="relative flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.12),transparent_32%)]" />
          <div className="relative w-full max-w-xl">
            <div className="mb-8 space-y-3 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100">
                <GraduationCap size={16} />
                Create your account
              </span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Sign up for SkillShare</h2>
              <p className="text-base font-medium text-slate-300">{roleText}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/30 backdrop-blur-xl sm:p-7">
              <InputField
                error={errors.fullName}
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                placeholder="Enter your full name"
                value={formData.fullName}
              />
              <InputField
                error={errors.email}
                label="Email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                type="email"
                value={formData.email}
              />
              <InputField
                error={errors.password}
                label="Password"
                name="password"
                onChange={handleChange}
                onToggleVisibility={() => setShowPassword((current) => !current)}
                placeholder="Create a secure password"
                showPasswordToggle
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                visible={showPassword}
              />
              <InputField
                error={errors.confirmPassword}
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                onToggleVisibility={() => setShowConfirmPassword((current) => !current)}
                placeholder="Confirm your password"
                showPasswordToggle
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                visible={showConfirmPassword}
              />
              <RoleSelector error={errors.role} onChange={handleChange} value={formData.role} />

              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={19} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="transition group-hover:translate-x-1" size={19} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-300 transition hover:text-cyan-100">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
