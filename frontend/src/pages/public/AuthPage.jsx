import { KeyRound, MailCheck } from 'lucide-react';
import { LoginForm, OTPInput, RegisterForm } from '../../components/domain/AuthComponents.jsx';
import { Button, InputField } from '../../components/ui/index.jsx';

export function AuthPage({ page }) {
  const isRegister = page.key === 'register';
  const isOtp = page.key === 'verifyEmail';
  const isReset = page.key === 'forgotPassword' || page.key === 'resetPassword';

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="eyebrow">{isOtp ? <MailCheck size={16} /> : <KeyRound size={16} />} Authentication</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        {isOtp && <div className="form-card"><OTPInput /><Button>Verify email</Button></div>}
        {isReset && <form className="form-card"><InputField label="Email" type="email" /><InputField label="New password" type="password" /><Button>Continue</Button></form>}
        {!isOtp && !isReset && (isRegister ? <RegisterForm /> : <LoginForm />)}
      </div>
    </section>
  );
}
