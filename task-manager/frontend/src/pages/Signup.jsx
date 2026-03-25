import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { signup } from '../api';
import { useAuthStore } from '../store/authStore';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

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
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    borderRadius: '12px',
    border: '1.5px solid var(--border)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    padding: '14px 16px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    marginTop: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      background: 'var(--bg-page)',
      backgroundImage: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(255,255,255,0) 50%, rgba(168,85,247,0.05) 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '16px',
            backgroundColor: '#4f46e5', boxShadow: '0 8px 16px rgba(79,70,229,0.25)',
            marginBottom: '16px'
          }}>
            <Layers size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>
            Start managing tasks with your team
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-hover)',
          padding: '32px',
          border: '1px solid var(--border)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Full name
              </label>
              <input 
                name="name" required value={form.name} onChange={handleChange} 
                placeholder="Jane Smith"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)';
                  e.target.style.backgroundColor = 'var(--bg-card)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'var(--bg-input)';
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input 
                type="email" name="email" required value={form.email} onChange={handleChange} 
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)';
                  e.target.style.backgroundColor = 'var(--bg-card)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'var(--bg-input)';
                }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input 
                type="password" name="password" required value={form.password} onChange={handleChange} 
                placeholder="At least 6 characters"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)';
                  e.target.style.backgroundColor = 'var(--bg-card)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'var(--bg-input)';
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                I am a...
              </label>
              <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)';
                  e.target.style.backgroundColor = 'var(--bg-card)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'var(--bg-input)';
                }}
              >
                <option value="user">Team Member (User)</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <button 
              type="submit" disabled={loading} 
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                backgroundColor: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', 
                fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                boxShadow: '0 4px 14px rgba(79,70,229,0.3)', transition: 'background 0.2s, transform 0.1s',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => { if(!loading) e.currentTarget.style.backgroundColor = '#4338ca'; }}
              onMouseLeave={(e) => { if(!loading) e.currentTarget.style.backgroundColor = '#4f46e5'; }}
              onMouseDown={(e) => { if(!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { if(!loading) e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Create Account
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '24px', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
