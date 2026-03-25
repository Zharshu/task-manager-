import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckCheck, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { getTasks } from '../api';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { STATUS_LABELS, PRIORITY_COLORS } from '../utils/helpers';
import useSocket from '../hooks/useSocket';

const StatCard = ({ icon: Icon, label, value, bg, iconColor }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)', 
      borderRadius: '20px', 
      border: '1.5px solid var(--border)',
      padding: '24px', 
      boxShadow: 'var(--shadow-card)',
      display: 'flex', flexDirection: 'column', gap: '16px',
      position: 'relative', overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: bg
        }}>
          <Icon size={24} color={iconColor} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '6px', margin: '6px 0 0 0' }}>{label}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  useSocket();
  const { user } = useAuthStore();
  const { tasks, setTasks } = useTaskStore();
  const isManager = user?.role === 'manager';

  useEffect(() => {
    getTasks({ limit: 100 })
      .then((res) => setTasks(res.data.tasks, res.data))
      .catch(() => {});
  }, [setTasks]);

  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const done = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length;

  const recentTasks = [...tasks].slice(0, 8);

  // Replicate priority pill colors for inline styling
  const prBadges = {
    high: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    medium: { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706' },
    low: { bg: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' },
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        borderRadius: '24px', padding: '24px 32px', marginBottom: '32px',
        color: '#fff', boxShadow: '0 20px 40px -12px rgba(99,102,241,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            You have <strong style={{ color: '#fff' }}>{inProgress}</strong> task{inProgress !== 1 ? 's' : ''} in progress and{' '}
            <strong style={{ color: '#fff' }}>{todo}</strong> to do.
          </p>
        </div>
        {isManager && (
          <Link
            to="/tasks"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', height: '44px',
              backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '15px', fontWeight: 600,
              borderRadius: '12px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)', transition: 'background 0.2s, transform 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={18} />
            New Task
          </Link>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px', marginBottom: '32px'
      }}>
        <StatCard icon={TrendingUp} label="Total Tasks" value={total} bg="var(--bg-subtle)" iconColor="#6366f1" />
        <StatCard icon={AlertCircle} label="To Do" value={todo} bg="var(--bg-subtle)" iconColor="var(--text-secondary)" />
        <StatCard icon={Clock} label="In Progress" value={inProgress} bg="var(--bg-subtle-amber)" iconColor="#d97706" />
        <StatCard icon={CheckCheck} label="Completed" value={done} bg="var(--bg-subtle-green)" iconColor="#16a34a" />
      </div>

      {/* Recent tasks table */}
      <div style={{
        backgroundColor: 'var(--bg-card)', borderRadius: '24px', 
        border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-card)', overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '24px 32px', borderBottom: '1px solid var(--border)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {isManager ? 'Recent Tasks' : 'My Tasks'}
          </h2>
          <Link to="/tasks" style={{
            fontSize: '13px', fontWeight: 600, color: '#4f46e5', textDecoration: 'none'
          }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
            View all →
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
            <CheckCheck size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', margin: 0 }}>No tasks yet. {isManager && 'Create one to get started!'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '800px' }}>
              {recentTasks.map((task, idx) => (
                <div key={task._id} style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 32px',
                  borderBottom: idx === recentTasks.length - 1 ? 'none' : '1px solid var(--border)',
                  transition: 'background 0.2s', cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: task.status === 'completed' ? '#22c55e' : task.status === 'in_progress' ? '#f59e0b' : '#94a3b8'
                }} />
                
                <p style={{
                  flex: 1, fontSize: '14px', fontWeight: 600, margin: 0,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                }}>
                  {task.title}
                </p>

                <span style={{
                  fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', 
                  textTransform: 'capitalize', whiteSpace: 'nowrap', display: 'inline-block',
                  backgroundColor: prBadges[task.priority]?.bg, color: prBadges[task.priority]?.color
                }}>
                  {task.priority}
                </span>

                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, minWidth: '90px', textAlign: 'right' }}>
                  {STATUS_LABELS[task.status]}
                </span>
                
                {task.assignedTo && (
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', minWidth: '120px', textAlign: 'right' }}>
                    {task.assignedTo.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
