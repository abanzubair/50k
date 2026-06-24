import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (auth.login(email, password)) {
        navigate('/admin');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full animate-float-1"
          style={{
            width: 500,
            height: 500,
            background: 'rgba(196, 154, 132, 0.15)',
            filter: 'blur(100px)',
            top: '10%',
            left: '20%',
          }}
        />
        <div
          className="absolute rounded-full animate-float-2"
          style={{
            width: 400,
            height: 400,
            background: 'rgba(238, 219, 215, 0.2)',
            filter: 'blur(100px)',
            bottom: '20%',
            right: '20%',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="font-body font-semibold text-sm tracking-[0.12em]" style={{ color: 'var(--color-text)' }}>
            TAVISHI
          </Link>
          <span
            className="ml-2 font-body text-[10px] px-2 py-0.5 rounded-pill font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            Admin
          </span>
          <h1 className="font-display font-semibold text-2xl mt-4" style={{ color: 'var(--color-text)' }}>
            Welcome Back
          </h1>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Sign in to access the admin panel
          </p>
        </div>

        {/* Login Form */}
        <div
          className="rounded-xl p-8"
          style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
        >
          {error && (
            <div
              className="mb-4 p-3 rounded-lg font-body text-sm"
              style={{ backgroundColor: 'rgba(184,92,92,0.1)', color: 'var(--color-danger)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tavishisarees.com"
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm font-body outline-none transition-shadow focus:shadow-glow"
                  style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm font-body outline-none transition-shadow focus:shadow-glow"
                  style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-pill font-body font-medium text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] hover:shadow-md disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p className="font-body text-xs text-center" style={{ color: 'var(--color-muted)' }}>
              Demo credentials: <strong>admin@tavishisarees.com</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link
            to="/"
            className="font-body text-sm transition-colors hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            ← Back to Storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
