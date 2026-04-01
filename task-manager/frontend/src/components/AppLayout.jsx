import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const overlayRef = useRef(null);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">

      {/* ── Desktop Sidebar ──────────────────────────────────── */}
      <aside className={`hidden lg:flex shrink-0 flex-col bg-[#FAFAFA] dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60 z-10 transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      </aside>

      {/* ── Mobile: backdrop ─────────────────────────────────── */}
      {sidebarOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in sidebar ─────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden flex flex-col bg-[#FAFAFA] dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60 shadow-2xl"
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Sidebar collapsed={false} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main content column ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-5 h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
              TaskFlow
            </span>
          </div>
          {/* Subtle accent dot */}
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse ring-4 ring-indigo-500/20" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
