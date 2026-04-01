import { useEffect, useState } from 'react';
import {
  X, Loader2, AlignLeft, Tag, Calendar, User,
  Sparkles, Mic, CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, rewriteTaskDescription } from '../api';
import { useAuthStore } from '../store/authStore';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
  assignedTo: '',
};

const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Low',    color: '#10b981', bg: '#ecfdf5', border: '#6ee7b7', textColor: '#065f46' },
  { value: 'medium', label: 'Medium', color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', textColor: '#92400e' },
  { value: 'high',   label: 'High',   color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', textColor: '#991b1b' },
];

const STATUS_OPTIONS = [
  { value: 'todo',        label: 'To Do'       },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed'   },
];

/* ─── Reusable inline styles ────────────────────────────────── */
const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #e2e8f0',
  fontSize: '14px',
  color: '#1e293b',
  background: '#f8fafc',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '8px',
};

/* ─── Field wrapper ─────────────────────────────────────────── */
const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label style={labelStyle}>
      {Icon && <Icon size={12} color="#94a3b8" />}
      {label}
    </label>
    {children}
  </div>
);

/* ─── TaskForm ─────────────────────────────────────────────── */
const TaskForm = ({ initial, onSubmit, onClose }) => {
  const { user }  = useAuthStore();
  const isManager = user?.role === 'manager';

  const [form,      setForm]      = useState(
    initial ? { ...defaultForm, ...initial, assignedTo: initial.assignedTo?._id || '' } : defaultForm,
  );
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (isManager) {
      getUsers().then((res) => setUsers(res.data)).catch(() => {});
    }
  }, [isManager]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleRewrite = async () => {
    if (!form.description) return;
    setLoadingAI(true);
    try {
      const { data } = await rewriteTaskDescription(form.description);
      setForm((p) => ({ ...p, description: data.result }));
      toast.success('Rewritten with AI ✨');
    } catch {
      toast.error('Failed to rewrite');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSpeech = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Speech not supported in this browser'); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setForm((p) => ({ ...p, description: (p.description + ' ' + t).trim() }));
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    if (!payload.dueDate)    delete payload.dueDate;
    if (!payload.assignedTo) delete payload.assignedTo;
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    /* ── Backdrop ── */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal card ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          width: '100%',
          maxWidth: '540px',
          border: '1px solid #f1f5f9',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 0.18s ease',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 28px 20px',
            borderBottom: '1px solid #f1f5f9',
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
              {initial ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              {initial ? 'Update the details below' : 'Fill in the task information'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              border: '1.5px solid #e2e8f0',
              background: '#f8fafc',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Form body ── */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Title */}
          <Field label="Title" icon={Tag}>
            <input
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              style={inputStyle}
            />
          </Field>

          {/* Description */}
          <Field label="Description" icon={AlignLeft}>
            <div style={{ position: 'relative' }}>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add context, details, or use the mic to dictate…"
                style={{
                  ...inputStyle,
                  resize: 'none',
                  lineHeight: '1.6',
                  paddingBottom: '44px',
                }}
              />
              {/* AI toolbar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <button
                  type="button"
                  onClick={handleSpeech}
                  title="Speech to text"
                  style={{
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    border: listening ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                    background: listening ? '#ef4444' : '#ffffff',
                    color: listening ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <Mic size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleRewrite}
                  disabled={loadingAI || !form.description}
                  title="Rewrite with AI"
                  style={{
                    height: '30px',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                    border: '1.5px solid #ddd6fe',
                    background: '#f5f3ff',
                    color: '#7c3aed',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: loadingAI || !form.description ? 'not-allowed' : 'pointer',
                    opacity: loadingAI || !form.description ? 0.4 : 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {loadingAI ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={12} />}
                  AI Rewrite
                </button>
              </div>
            </div>
          </Field>

          {/* Priority */}
          <div>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {PRIORITY_OPTIONS.map(({ value, label, color, bg, border, textColor }) => {
                const active = form.priority === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, priority: value }))}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      height: '42px',
                      borderRadius: '10px',
                      border: active ? `2px solid ${border}` : '2px solid #e2e8f0',
                      background: active ? bg : '#f8fafc',
                      color: active ? textColor : '#94a3b8',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: active ? color : '#cbd5e1',
                      flexShrink: 0,
                    }} />
                    {label}
                    {active && <CheckCircle2 size={13} style={{ marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status + Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={inputStyle}
              >
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>
            <Field label="Due Date" icon={Calendar}>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate ? form.dueDate.slice(0, 10) : ''}
                onChange={handleChange}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Assign To (manager only) */}
          {isManager && (
            <Field label="Assign To" icon={User}>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </Field>
          )}

          {/* ── Footer actions ── */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '8px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                height: '46px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                background: '#f8fafc',
                color: '#475569',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                height: '46px',
                borderRadius: '12px',
                border: 'none',
                background: loading ? '#818cf8' : '#4f46e5',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                transition: 'all 0.15s',
              }}
            >
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {initial ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
