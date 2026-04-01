import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers, Loader2, ShieldCheck, Users2, Sparkles,
  BarChart3, BriefcaseBusiness, Eye, EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { signup } from '../api';
import { useAuthStore } from '../store/authStore';

const FEATURES = [
  { icon: ShieldCheck,      text: 'Role-based access for managers & teams' },
  { icon: BarChart3,        text: 'Live dashboards and smart filtering'     },
  { icon: Sparkles,         text: 'AI-powered task description rewriting'   },
  { icon: Users2,           text: 'Real-time collaboration via WebSockets'  },
];

const ROLE_OPTIONS = [
  { value: 'user',    icon: Users2,           label: 'Team Member', description: 'Work on assigned tasks'        },
  { value: 'manager', icon: BriefcaseBusiness, label: 'Manager',     description: 'Create, assign & manage tasks' },
];

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
  transition: 'border-color 0.15s',
};

const Signup = () => {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await signup(form);
      setAuth(data.user, data.token);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: '#f8fafc', overflowY: 'auto' }}>

      {/* ── Left decorative panel ── */}
      <div
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '42%',
          maxWidth: '480px',
          padding: '40px 48px',
          background: 'linear-gradient(145deg, #4f46e5 0%, #6d28d9 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden lg:flex"
      >
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '45%', right: '30px', width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(167,139,250,0.2)' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={20} color="#ffffff" />
          </div>
          <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '18px', letterSpacing: '-0.02em' }}>TaskFlow</span>
        </div>

        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Join a smarter<br />way to work.
          </h2>
          <p style={{ color: '#c7d2fe', fontSize: '14px', lineHeight: '1.7', marginBottom: '32px' }}>
            Set up your free account in under 30 seconds and start collaborating today.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color="#ffffff" />
                </div>
                <span style={{ color: '#e0e7ff', fontSize: '13px', fontWeight: '500' }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p style={{ position: 'relative', color: '#818cf8', fontSize: '11px' }}>© 2026 TaskFlow Inc. Built for high-performing teams.</p>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 24px' }}>
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
              Create your account
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Start managing tasks with your team
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            padding: '24px 24px',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '10px' }}>
                {/* Full name */}
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password" required
                    value={form.password} onChange={handleChange}
                    placeholder="At least 6 characters"
                    style={{ ...inputStyle, paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div>
                <label style={labelStyle}>I am a…</label>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '10px' }}>
                  {ROLE_OPTIONS.map(({ value, icon: Icon, label, description }) => {
                    const active = form.role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, role: value }))}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: '3px',
                          padding: '10px 10px',
                          borderRadius: '10px',
                          border: active ? '2px solid #6366f1' : '2px solid #e2e8f0',
                          background: active ? '#eef2ff' : '#f8fafc',
                          textAlign: 'left', cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icon size={13} color={active ? '#4f46e5' : '#94a3b8'} />
                          <span style={{ fontSize: '12px', fontWeight: '700', color: active ? '#4338ca' : '#475569' }}>{label}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '10px', color: active ? '#6366f1' : '#94a3b8', lineHeight: '1.3' }}>{description}</p>
                      </button>
                    );
                  })}
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
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            {/* Divider + link */}
            <div style={{ height: '1px', background: '#f1f5f9', margin: '14px 0' }} />
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
