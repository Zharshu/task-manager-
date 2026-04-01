import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, CheckCheck, Clock, AlertCircle, TrendingUp,
  Loader2, ArrowRight, Calendar, Sun, Moon
} from 'lucide-react';
import { getTasks } from '../api';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import useSocket from '../hooks/useSocket';
import { useThemeStore } from '../store/themeStore';

/* ─── Helpers ────────────────────────────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getShortDate = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/* ─── Priority config ────────────────────────────────────────── */
const PRIORITY_CFG = {
  high:   { label: 'High',   dot: 'bg-red-500',    badge: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' },
  medium: { label: 'Medium', dot: 'bg-amber-400',  badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  low:    { label: 'Low',    dot: 'bg-emerald-500', badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
};

const STATUS_CFG = {
  todo:        { label: 'To Do',       badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  in_progress: { label: 'In Progress', badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  completed:   { label: 'Completed',   badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
};

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accentClass, bgCls, delay }) => (
  <div
    style={{ position: 'relative', minHeight: '160px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    className={`slide-in delay-${delay} ${bgCls} rounded-[24px] border border-white/60 dark:border-white/5 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
  >
    {/* Decorative soft glow */}
    <div 
      style={{ position: 'absolute', top: '-24px', right: '-24px', width: '120px', height: '120px', filter: 'blur(30px)', opacity: '0.15' }}
      className={`rounded-full ${accentClass.replace('text-', 'bg-').split(' ')[0]} pointer-events-none dark:opacity-25`} 
    />
    
    {/* Explicitly positioned icon in top right */}
    <div 
      style={{ position: 'absolute', top: '16px', right: '16px', width: '44px', height: '44px' }}
      className={`rounded-[14px] flex items-center justify-center shrink-0 bg-white/95 dark:bg-slate-900/70 border border-slate-100/50 dark:border-slate-800/80 backdrop-blur-md shadow-sm ${accentClass}`}
    >
      <Icon size={22} strokeWidth={2.5} className="opacity-100" />
    </div>
    
    <div className="flex flex-col items-center justify-center gap-1 mt-4">
      <p className={`text-[52px] font-black ${accentClass} tracking-tight leading-none text-center`}>
        {value}
      </p>
      <p className={`text-[15px] font-bold ${accentClass} opacity-80 text-center`}>{label}</p>
    </div>
  </div>
);

/* ─── Dashboard ──────────────────────────────────────────────── */
const Dashboard = () => {
  useSocket();
  const { user } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const { tasks, setTasks } = useTaskStore();
  const isManager = user?.role === 'manager';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks({ limit: 100 })
      .then((res) => setTasks(res.data.tasks, res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setTasks]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500 min-h-96">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading workspace…</p>
      </div>
    );
  }

  const todo       = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const done       = tasks.filter((t) => t.status === 'completed').length;
  const total      = tasks.length;
  const pct        = total ? Math.round((done / total) * 100) : 0;
  const recentTasks = [...tasks].slice(0, 8);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-[#0B1120]">
      <div 
        className="w-full flex flex-col gap-8 lg:gap-10"
        style={{ padding: '30px 40px', maxWidth: '1280px', margin: '0 auto' }}
      >

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="slide-in flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {getShortDate()}
          </p>
          <h1 className="text-3xl sm:text-[32px] font-bold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, <span className="text-indigo-600 dark:text-indigo-400">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {total === 0
              ? 'Ready to conquer the day? Create a task to get started.'
              : `You have ${inProgress} tasks in progress and ${todo} tasks to do today.`
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Theme Toggle Button */}
          <button
            onClick={toggle}
            className="w-[42px] h-[42px] shrink-0 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            title={dark ? 'Light Mode' : 'Dark Mode'}
          >
            {dark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

          {isManager && (
            <Link
              to="/tasks"
              style={{ padding: '10px 22px' }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white text-[15px] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.3)] active:scale-95 transition-all duration-300"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>New Task</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TrendingUp}  label="Total Tasks"  value={total}      accentClass="text-indigo-600 dark:text-indigo-400" bgCls="bg-indigo-50 dark:bg-indigo-500/10" delay={1} />
        <StatCard icon={AlertCircle} label="To Do"        value={todo}       accentClass="text-slate-600 dark:text-slate-400"  bgCls="bg-slate-100 dark:bg-slate-800" delay={2} />
        <StatCard icon={Clock}       label="In Progress"  value={inProgress} accentClass="text-amber-600 dark:text-amber-400" bgCls="bg-amber-50 dark:bg-amber-500/10" delay={3} />
        <StatCard icon={CheckCheck}  label="Completed"    value={done}       accentClass="text-emerald-600 dark:text-emerald-400" bgCls="bg-emerald-50 dark:bg-emerald-500/10" delay={4} />
      </div>

      {/* ── Progress bar ────────────────────────────────────── */}
      {total > 0 && (
        <div className="slide-in delay-5" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Project Momentum</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overall completion rate</p>
            </div>
            <span className="text-4xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{pct}%</span>
          </div>
          
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner w-full">
            <div
              className={`h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>
          
          <div className="flex items-center gap-6 mt-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              {done} completed
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              {total - done} pending
            </div>
          </div>
        </div>
      )}

      {/* ── Recent tasks ────────────────────────────────────── */}
      <div className="slide-in delay-6 w-full" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {isManager ? 'Recent Activity' : 'My Active Tasks'}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Latest task updates and status changes
            </p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Manage Board <ArrowRight size={16} />
          </Link>
        </div>

        {/* Tasks list */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full min-w-[500px]">
              <thead className="bg-slate-50 dark:bg-slate-800/80">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6 py-4" style={{ paddingLeft: '48px' }}>Task Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Priority</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Assignee</th>
                </tr>
              </thead>
            <tbody>
              {recentTasks.length === 0 ? (
                <tr className="slide-in border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-all duration-200 delay-1">
                  <td className="pr-6 py-4" style={{ paddingLeft: '48px' }}>
                    <div className="flex items-center">
                      <span className="text-[14px] font-medium max-w-[200px] md:max-w-xs xl:max-w-md truncate text-slate-800 dark:text-slate-200">
                        Assigment Ai
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider ${PRIORITY_CFG.medium.badge}`}>
                      {PRIORITY_CFG.medium.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider ${STATUS_CFG.todo.badge}`}>
                      {STATUS_CFG.todo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-start items-center">
                      <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-[12px] border border-slate-100/80 dark:border-slate-700/50">
                        <div className="w-6 h-6 rounded-[8px] bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-[0_2px_6px_rgba(99,102,241,0.2)] dark:shadow-none">
                          R
                        </div>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[90px]">
                          Ram
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                recentTasks.map((task, idx) => {
                  const pCfg = PRIORITY_CFG[task.priority];
                  const sCfg = STATUS_CFG[task.status];
                  return (
                    <tr
                      key={task._id}
                      className={`slide-in border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-all duration-200 delay-${Math.min(idx + 1, 8)}`}
                    >
                      {/* Title */}
                      <td className="pr-6 py-4" style={{ paddingLeft: '48px' }}>
                        <div className="flex items-center">
                          <span className={`text-[14px] font-medium max-w-[200px] md:max-w-xs xl:max-w-md truncate ${
                            task.status === 'completed'
                              ? 'line-through text-slate-400 dark:text-slate-600'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {task.title}
                          </span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4 text-left">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider ${pCfg?.badge}`}>
                          {pCfg?.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-left">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider ${sCfg?.badge}`}>
                          {sCfg?.label}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="px-6 py-4">
                        <div className="flex justify-start items-center">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-[12px] border border-slate-100/80 dark:border-slate-700/50">
                              <div className="w-6 h-6 rounded-[8px] bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-[0_2px_6px_rgba(99,102,241,0.2)] dark:shadow-none">
                                {initials(task.assignedTo.name)}
                              </div>
                              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[90px]">
                                {task.assignedTo.name.split(' ')[0]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] font-black text-slate-300 dark:text-slate-700">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Dashboard;
