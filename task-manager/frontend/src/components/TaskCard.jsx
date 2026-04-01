import { useState } from 'react';
import { Calendar, Trash2, Pencil, CheckCheck, User } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useAuthStore } from '../store/authStore';

const PRIORITY_LEFT = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-emerald-500',
};

const PRIORITY_BADGE = {
  high:   'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
  medium: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low:    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/* ─── Action button ─────────────────────────────────── */
const ActionBtn = ({ children, onClick, disabled, title, hoverCls }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${hoverCls}`}
  >
    {children}
  </button>
);

/* ─── Task Card ─────────────────────────────────────── */
const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuthStore();
  const isManager = user?.role === 'manager';
  const [updating, setUpdating] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleComplete = async () => {
    if (task.status === 'completed') return;
    setUpdating(true);
    await onStatusChange(task._id, 'completed');
    setUpdating(false);
  };

  const isOverdue  = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const isDueSoon  = task.dueDate && !isOverdue && new Date(task.dueDate) < new Date(Date.now() + 2 * 86_400_000);
  const dateCls    = isOverdue ? 'text-red-500 dark:text-red-400' : isDueSoon ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500';

  const isCompleted = task.status === 'completed';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative bg-white dark:bg-slate-900/85
        border border-slate-200/80 dark:border-slate-800/80
        overflow-hidden
        transition-all duration-200
        ${hovered ? 'shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border-slate-300/80 dark:border-slate-700/80 z-10' : 'shadow-sm'}
      `}
      style={{ 
        borderRadius: '16px', 
        transform: hovered ? 'translateY(-2px)' : 'none' 
      }}
    >
      <div className="flex flex-col" style={{ padding: '20px', gap: '12px' }}>
        {/* Title row */}
        <div 
          className="flex items-start gap-2 border-b border-slate-100 dark:border-slate-800/60"
          style={{ paddingBottom: '5px' }}
        >
          <p className={`flex-1 text-[14px] font-semibold leading-relaxed ${
            isCompleted
              ? 'line-through text-slate-400 dark:text-slate-600'
              : 'text-slate-800 dark:text-slate-200'
          }`}>
            {task.title}
          </p>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags / Pills row */}
        <div className="flex flex-wrap items-center mt-1" style={{ gap: '8px' }}>
          <span 
            className={`inline-flex items-center shrink-0 rounded-full font-bold uppercase tracking-wider border border-current/10 shadow-sm ${PRIORITY_BADGE[task.priority]}`}
            style={{ padding: '4px 12px', fontSize: '11px', letterSpacing: '0.05em' }}
          >
            {task.priority}
          </span>
          {task.assignedTo && (
            <span 
              className="inline-flex items-center shrink-0 rounded-full font-semibold bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 shadow-sm"
              style={{ padding: '4px 12px', gap: '6px', fontSize: '12px' }}
            >
              <div 
                className="rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm"
                style={{ width: '16px', height: '16px', fontSize: '9px' }}
              >
                {initials(task.assignedTo.name)[0]}
              </div>
              {task.assignedTo.name.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          {/* Due date */}
          {task.dueDate ? (
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${dateCls}`}>
              <Calendar size={13} strokeWidth={2.5} />
              {isOverdue && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
              {formatDate(task.dueDate)}
            </span>
          ) : <span className="text-[11px] font-semibold text-slate-300 dark:text-slate-700">&mdash;</span>}

          {/* Action buttons (always visible on touch, opacity swap on hover) */}
          <div className={`flex items-center gap-0.5 transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'}`}>
            {!isCompleted && (
              <ActionBtn onClick={handleComplete} disabled={updating} title="Complete" hoverCls="hover:bg-emerald-50 text-slate-400 hover:text-emerald-500">
                <CheckCheck size={14} strokeWidth={2.5} />
              </ActionBtn>
            )}
            {isManager && (
              <>
                <ActionBtn onClick={() => onEdit(task)} title="Edit" hoverCls="hover:bg-indigo-50 text-slate-400 hover:text-indigo-500">
                  <Pencil size={13} strokeWidth={2.5} />
                </ActionBtn>
                <ActionBtn onClick={() => onDelete(task._id)} title="Delete" hoverCls="hover:bg-red-50 text-slate-400 hover:text-red-500">
                  <Trash2 size={13} strokeWidth={2.5} />
                </ActionBtn>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
