import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, CheckSquare, Moon, Sun, Layers, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks' },
];

const NavLink = ({ to, icon: Icon, label, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 14px', borderRadius: 'var(--radius-md)',
        fontSize: '14px', fontWeight: 600, textDecoration: 'none',
        transition: 'background var(--transition-base), color var(--transition-base)',
        backgroundColor: active ? 'var(--color-primary-50)' : 'transparent',
        color: active ? 'var(--color-primary-600)' : 'var(--text-secondary)',
        border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
    >
      <Icon size={15} />
      {label}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-nav)',
        transition: 'background var(--transition-slow)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 20px',
          height: '62px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px',
        }}>

          {/* Brand */}
          <Link to="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            fontWeight: 800, fontSize: '17px', color: 'var(--color-primary-600)',
            textDecoration: 'none', flexShrink: 0, letterSpacing: '-0.02em',
          }}>
            <div style={{
              width: '30px', height: '30px',
              background: 'linear-gradient(135deg, var(--color-primary-600) 0%, #7c3aed 100%)',
              borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 2px 8px rgba(79,70,229,0.35)',
            }}>
              <Layers size={16} color="#fff" />
            </div>
            TaskFlow
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden-mobile" style={{ alignItems: 'center', gap: '4px' }}>
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} {...link} />
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)',
                cursor: 'pointer', transition: 'background var(--transition-base), color var(--transition-base), border-color var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-focus)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Separator */}
            <div style={{ height: '22px', width: '1px', backgroundColor: 'var(--border)' }} />

            {/* User avatar + info */}
            <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar avatar-md" style={{ boxShadow: '0 0 0 2px var(--border)' }}>
                {initials}
              </div>
              <div className="hidden-mobile-block">
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize', margin: '2px 0 0' }}>
                  {user?.role}
                </p>
              </div>
            </div>

            {/* Logout — desktop only */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="hidden-mobile"
              style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)', border: '1px solid transparent',
                backgroundColor: 'transparent', color: 'var(--text-muted)',
                cursor: 'pointer', transition: 'background var(--transition-base), color var(--transition-base), border-color var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle-red)';
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <LogOut size={16} />
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                backgroundColor: drawerOpen ? 'var(--bg-subtle)' : 'var(--bg-input)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                transition: 'background var(--transition-base)',
              }}
              className="visible-mobile"
            >
              {drawerOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(2px)',
            animation: 'fadeIn 0.15s ease both',
          }}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed', top: '62px', right: 0, bottom: 0,
          width: '260px', zIndex: 41,
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* User info in drawer */}
        <div style={{
          padding: '20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div className="avatar avatar-md">
            {initials}
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize', margin: '2px 0 0' }}>
              {user?.role}
            </p>
          </div>
        </div>

        {/* Drawer nav links */}
        <nav style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} {...link} onClick={() => setDrawerOpen(false)} />
          ))}
        </nav>

        {/* Drawer footer */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)',
              backgroundColor: 'var(--bg-subtle-red)', color: '#ef4444',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background var(--transition-base)',
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
