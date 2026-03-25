import { useState } from 'react';
import { Calendar, Trash2, Pencil, CheckCheck, User } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useAuthStore } from '../store/authStore';

const PRIORITY_DOT = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const PRIORITY_BADGE = {
  high: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  medium: { background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' },
  low: { background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' },
};

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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && !isOverdue && new Date(task.dueDate) < new Date(Date.now() + 2 * 86_400_000);
  const dateColor = isOverdue ? '#ef4444' : isDueSoon ? '#f59e0b' : 'var(--text-muted)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1.5px solid var(--border)',
        padding: '20px',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
        marginBottom: '12px'
      }}
    >
      {/* Priority dot */}
      <span style={{
        position: 'absolute', top: '22px', right: '20px',
        width: '10px', height: '10px', borderRadius: '50%',
        backgroundColor: PRIORITY_DOT[task.priority], display: 'inline-block',
      }} />

      {/* Title */}
      <h3 style={{
        fontSize: '15px', fontWeight: 600,
        color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
        lineHeight: 1.4, paddingRight: '22px', marginBottom: '8px', marginTop: 0,
      }}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
          marginBottom: '14px', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      {/* Meta pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '4px 10px',
          borderRadius: '20px', textTransform: 'capitalize', ...PRIORITY_BADGE[task.priority],
        }}>
          {task.priority}
        </span>
        {task.assignedTo && (
          <span style={{
            fontSize: '11px', fontWeight: 500, padding: '4px 10px', borderRadius: '20px',
            backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <User size={12} />
            {task.assignedTo.name}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '12px', borderTop: '1px solid var(--border)',
      }}>
        {task.dueDate ? (
          <span style={{ fontSize: '12px', fontWeight: 500, color: dateColor, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        ) : <span />}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
          {task.status !== 'completed' && (
            <ActionBtn onClick={handleComplete} disabled={updating} title="Mark complete" color="#22c55e">
              <CheckCheck size={14} />
            </ActionBtn>
          )}
          {isManager && (
            <>
              <ActionBtn onClick={() => onEdit(task)} title="Edit" color="#6366f1">
                <Pencil size={14} />
              </ActionBtn>
              <ActionBtn onClick={() => onDelete(task._id)} title="Delete" color="#ef4444">
                <Trash2 size={14} />
              </ActionBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ children, onClick, disabled, title, color }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: '30px', height: '30px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', borderRadius: '8px', border: 'none',
        backgroundColor: h ? `${color}22` : 'transparent',
        color: h ? color : 'var(--text-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, transition: 'background 0.2s, color 0.2s', padding: 0,
      }}
    >
      {children}
    </button>
  );
};

export default TaskCard;
