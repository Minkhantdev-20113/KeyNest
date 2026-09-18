import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginDialog() {
  const { login, register, loading, error, clearError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, [isRegistering]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();
    if (isRegistering && form.password !== form.confirmPassword) return;
    if (isRegistering) await register(form.email, form.password, form.username);
    else await login(form.email, form.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="glass-card text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            {isRegistering ? <Shield size={32} className="text-white" /> : <Lock size={32} className="text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">AI Key Vault</h1>
          <p className="text-surface-500 text-sm">{isRegistering ? 'Create your secure account' : 'Sign in to your secure account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card space-y-5">
          {isRegistering && (
            <div>
              <label className="label-text">Username</label>
              <input className="input-field" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Your name" required minLength={2} maxLength={50} />
            </div>
          )}
          <div>
            <label className="label-text">Email</label>
            <input ref={emailRef} className="input-field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <input className="input-field pr-10" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" autoComplete={isRegistering ? 'new-password' : 'current-password'} required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {isRegistering && (
            <div>
              <label className="label-text">Confirm Password</label>
              <input className="input-field" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Repeat your password" autoComplete="new-password" required minLength={6} />
            </div>
          )}
          {isRegistering && form.password && form.confirmPassword && form.password !== form.confirmPassword && <p className="text-sm text-red-500">Passwords do not match.</p>}
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Please wait...' : isRegistering ? 'Create Account' : 'Sign In'}</button>
          <button type="button" onClick={() => { setIsRegistering(!isRegistering); clearError(); }} className="w-full text-sm text-primary-600 hover:text-primary-700">
            {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
        </form>
      </div>
    </div>
  );
}
