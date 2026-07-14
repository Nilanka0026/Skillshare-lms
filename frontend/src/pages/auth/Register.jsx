import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';
import { FormInput } from '../../components/common/FormInput.jsx';
import { RoleSelector } from '../../components/common/RoleSelector.jsx';
import { useAuth } from '../../context/useAuth.js';

const initialValues = { fullName: '', email: '', password: '', confirmPassword: '', role: 'student' };

export function Register() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Document Upload States
  const [instructorIdFile, setInstructorIdFile] = useState(null);
  const [qualificationFile, setQualificationFile] = useState(null);
  const [instructorIdBase64, setInstructorIdBase64] = useState('');
  const [qualificationBase64, setQualificationBase64] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const roleText = values.role === 'instructor' ? 'Start teaching and earn from your courses' : 'Start learning from top instructors';

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: '' }));
  };

  const handleFileChange = (event, setter, base64Setter, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    setter(file);
    setErrors((current) => ({ ...current, [fieldName]: '' }));

    const reader = new FileReader();
    reader.onloadend = () => {
      base64Setter(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (values.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Passwords must match.';
    if (!values.role) nextErrors.role = 'Choose a role.';
    
    if (values.role === 'instructor') {
      if (!instructorIdBase64) nextErrors.instructorId = 'Instructor ID document is required.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);

    try {
      const payload = { ...values };
      if (values.role === 'instructor') {
        payload.verificationDocuments = {
          instructorId: instructorIdBase64,
          degreeQualifications: qualificationBase64
        };
      }
      console.log('Registration data:', payload);
      await register(payload);
      navigate('/');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Create your account" subtitle={roleText}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {apiError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{apiError}</p>}
        <FormInput label="Full Name" name="fullName" value={values.fullName} onChange={handleChange} error={errors.fullName} placeholder="Your full name" />
        <FormInput label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
        <PasswordField label="Password" name="password" value={values.password} onChange={handleChange} error={errors.password} visible={showPassword} onToggle={() => setShowPassword((current) => !current)} />
        <PasswordField label="Confirm Password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} visible={showConfirm} onToggle={() => setShowConfirm((current) => !current)} />
        <RoleSelector value={values.role} onChange={handleChange} error={errors.role} />
        
        {values.role === 'instructor' && (
          <div className="grid gap-4 border border-blue-100 rounded-2xl bg-blue-50/50 p-4 transition-all duration-300">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
              <span>Verification Documents Required</span>
            </h3>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Instructor ID / Corporate ID Document</label>
              <div className="relative flex flex-col items-center justify-center border border-dashed border-blue-200 hover:border-blue-400 bg-white rounded-xl p-3 transition cursor-pointer group min-h-16">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setInstructorIdFile, setInstructorIdBase64, 'instructorId')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-500 group-hover:text-blue-600 text-center">
                  {instructorIdFile ? `Selected: ${instructorIdFile.name}` : "Click or Drag to Upload ID Document"}
                </span>
                {instructorIdFile && (
                  <span className="mt-1 text-[10px] text-gray-400">
                    ({(instructorIdFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
              {errors.instructorId && <span className="block text-xs font-semibold text-red-600">{errors.instructorId}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Degree or Qualification Certificate (Optional)</label>
              <div className="relative flex flex-col items-center justify-center border border-dashed border-blue-200 hover:border-blue-400 bg-white rounded-xl p-3 transition cursor-pointer group min-h-16">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setQualificationFile, setQualificationBase64, 'qualification')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-500 group-hover:text-blue-600 text-center">
                  {qualificationFile ? `Selected: ${qualificationFile.name}` : "Click or Drag to Upload Certificate"}
                </span>
                {qualificationFile && (
                  <span className="mt-1 text-[10px] text-gray-400">
                    ({(qualificationFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
              {errors.qualification && <span className="block text-xs font-semibold text-red-600">{errors.qualification}</span>}
            </div>
          </div>
        )}

        <Button disabled={loading}>{loading && <LoaderCircle className="animate-spin" size={18} />} Sign Up</Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link className="font-bold text-blue-600" to="/login">Login</Link></p>
    </AuthFrame>
  );
}

function PasswordField({ error, label, name, onChange, onToggle, value, visible }) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <div className="relative">
        <input name={name} value={value} onChange={onChange} type={visible ? 'text' : 'password'} className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${error ? 'border-red-400' : 'border-gray-200'}`} />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
      </div>
      {error && <span className="block text-sm font-medium text-red-600">{error}</span>}
    </div>
  );
}

function AuthFrame({ children, subtitle, title }) {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[0.85fr_1fr]">
        <div className="hidden bg-gray-100 p-8 lg:block">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85" alt="Learning" className="h-full min-h-[560px] rounded-2xl object-cover" />
        </div>
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-black text-gray-950">{title}</h1>
          <p className="mt-2 text-gray-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
