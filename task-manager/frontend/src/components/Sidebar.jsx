import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, LogOut, Layers, X, PanelLeftClose, PanelLeftOpen, Menu
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'     },
];

const NavItem = ({ to, icon: Icon, label, onClick, collapsed }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        relative flex items-center transition-colors duration-200 group
        ${collapsed ? 'justify-center py-3 border-none' : 'px-6 py-3 gap-3.5 border-none'}
        ${active
          ? 'bg-slate-200/50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
          : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
        }
      `}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2.5 : 2}
        className={`shrink-0 transition-colors duration-200 ${
          active
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
        }`}
      />
      {!collapsed && <span className="text-[15px]">{label}</span>}
    </Link>
  );
};

const Sidebar = ({ collapsed, onToggleCollapse, onClose }) => {
  const { user, logout } = useAuthStore();
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
    .toUpperCase() || '?';

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-[#1C1C1E] border-r border-slate-200/60 dark:border-slate-800/60">

      {/* ── Logo & Toggle ─────────────────────────────────────── */}
      <div className={`flex items-center h-[72px] shrink-0 ${collapsed ? 'flex-col justify-center gap-4 py-4 h-auto' : 'justify-between px-5'}`}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
              <Layers size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-[15px] tracking-tight">
              TaskFlow
            </span>
          </Link>
        )}
        
        {collapsed && (
          <Link to="/dashboard" title="TaskFlow">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
              <Layers size={18} className="text-white" />
            </div>
          </Link>
        )}

        {/* Global Collapse Toggle / Mobile Close */}
        <div className="flex items-center">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          )}
          {onToggleCollapse && (
            <button 
              onClick={onToggleCollapse} 
              className={`hidden lg:flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ${collapsed ? 'w-10 h-10 hover:bg-slate-200/60 dark:hover:bg-slate-800' : 'w-8 h-8 hover:bg-slate-200/60 dark:hover:bg-slate-800'}`}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className={`flex flex-col ${collapsed ? 'space-y-4' : 'space-y-3'}`}>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* ── Bottom section ──────────────────────────────────── */}
      <div className="shrink-0">

        {/* User card / Footer */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-3 py-5 border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#2C2C2E]' : 'gap-3 px-6 py-4 border-t border-slate-200/60 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#2C2C2E]'}`}>
          <div
            className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-[10px] font-bold shrink-0"
            title={user?.name}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate leading-tight">
                {user?.name}
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {user?.email || 'admin@taskflow.com'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className={`flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 transition-colors duration-200 shrink-0 ${collapsed ? 'w-8 h-8' : 'w-6 h-6'}`}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
