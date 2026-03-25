import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, CheckSquare, Moon, Sun, Layers } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const NavLink = ({ to, icon: Icon, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
        borderRadius: '8px', fontSize: '14px', fontWeight: 600,
        textDecoration: 'none', transition: 'background 0.2s, color 0.2s',
        backgroundColor: active ? 'rgba(79, 70, 229, 0.1)' : hovered ? 'var(--bg-subtle)' : 'transparent',
        color: active ? '#4f46e5' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}
    >
      <Icon size={16} />
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const [tHover, setTHover] = useState(false);
  const [lHover, setLHover] = useState(false);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--bg-card)',
      opacity: 0.95, backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 16px',
        height: '60px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px'
      }}>
        {/* Brand */}
        <Link to="/dashboard" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: 800, fontSize: '18px', color: '#4f46e5',
          textDecoration: 'none', flexShrink: 0
        }}>
          <div style={{
            width: '28px', height: '28px', backgroundColor: '#4f46e5',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={16} color="#fff" />
          </div>
          TaskFlow
        </Link>

        {/* Nav links */}
        <nav className="hidden-mobile" style={{ alignItems: 'center', gap: '4px' }}>
          <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink to="/tasks" icon={CheckSquare}>Tasks</NavLink>
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggle}
            onMouseEnter={() => setTHover(true)}
            onMouseLeave={() => setTHover(false)}
            style={{
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background 0.2s',
              backgroundColor: tHover ? 'var(--bg-subtle)' : 'transparent',
              color: 'var(--text-secondary)'
            }}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              {initials}
            </div>
            <div className="hidden-mobile-block">
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize', margin: '2px 0 0 0' }}>{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            onMouseEnter={() => setLHover(true)}
            onMouseLeave={() => setLHover(false)}
            style={{
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              backgroundColor: lHover ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              color: lHover ? '#ef4444' : 'var(--text-secondary)'
            }}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
