import { Github, Mail } from 'lucide-react';
import { Button, InputField } from '../ui/index.jsx';

export function PasswordStrengthMeter() {
  return <div className="strength"><span /><span /><span /></div>;
}

export function OTPInput() {
  return <div className="otp">{[1, 2, 3, 4, 5, 6].map((item) => <input key={item} maxLength="1" />)}</div>;
}

export function SocialLoginButtons() {
  return <div className="social-row"><Button variant="ghost"><Github size={18} /> GitHub</Button><Button variant="ghost"><Mail size={18} /> Google</Button></div>;
}

export function LoginForm() {
  return <form className="form-card"><InputField label="Email" type="email" /><InputField label="Password" type="password" /><Button>Login</Button><SocialLoginButtons /></form>;
}

export function RegisterForm() {
  return <form className="form-card"><InputField label="Full name" /><InputField label="Email" type="email" /><InputField label="Password" type="password" /><PasswordStrengthMeter /><Button>Create account</Button></form>;
}
