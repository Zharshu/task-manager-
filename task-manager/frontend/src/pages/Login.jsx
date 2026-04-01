import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Loader2, Zap, Users, BarChart3, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../api';
import { useAuthStore } from '../store/authStore';

const FEATURES = [
  { icon: Zap,          text: 'Real-time task updates via WebSockets' },
  { icon: Users,        text: 'Assign tasks and collaborate instantly' },
  { icon: BarChart3,    text: 'Track progress with live dashboards'    },
  { icon: CheckCircle2, text: 'AI-powered task description rewriting'  },
];

/* ── shared field styles ── */
const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  color: '#64748b',
  marginBottom: '6px',
  letterSpacing: '0.02em',
};

const inputStyle = {
  width: '100%',
  padding: '9px 13px',
  borderRadius: '10px',
  border: '1.5px solid #e2e8f0',
  fontSize: '13px',
  color: '#1e293b',
  background: '#f8fafc',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const Login = () => {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: '#f8fafc', overflowY: 'auto' }}>

      {/* ── Left decorative panel ── */}
      <div style={{
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '44%',
        maxWidth: '520px',
        padding: '52px 56px',
        background: 'linear-gradient(145deg, #4f46e5 0%, #6d28d9 100%)',
        position: 'relative',
        overflow: 'hidden',
        // show on lg screens via media — keep as-is for mobile
      }}
        className="hidden lg:flex"
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '50%', right: '30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(167,139,250,0.2)' }} />

        {/* Brand */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={22} color="#ffffff" />
          </div>
          <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '20px', letterSpacing: '-0.02em' }}>TaskFlow</span>
        </div>

        {/* Hero */}
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Work smarter,<br />ship faster.
          </h2>
          <p style={{ color: '#c7d2fe', fontSize: '15px', lineHeight: '1.7', marginBottom: '40px' }}>
            Everything your team needs to stay organized, aligned, and moving forward — all in one place.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#ffffff" />
                </div>
                <span style={{ color: '#e0e7ff', fontSize: '14px', fontWeight: '500' }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p style={{ position: 'relative', color: '#818cf8', fontSize: '12px' }}>© 2026 TaskFlow Inc. Built for high-performing teams.</p>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Compact icon + heading */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(79,70,229,0.3)',
              marginBottom: '10px',
            }}>
              <Layers size={20} color="#ffffff" />
            </div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em' }}>
              Welcome back
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Sign in to your TaskFlow account
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '24px 24px',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email" name="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password" required
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', height: '44px', marginTop: '2px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  borderRadius: '11px', border: 'none',
                  background: loading ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                  color: '#ffffff', fontSize: '14px', fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(79,70,229,0.38)',
                  transition: 'all 0.2s',
                }}
              >
                {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}
              >
                Sign up free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
