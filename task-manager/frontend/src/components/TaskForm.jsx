import { useEffect, useState } from 'react';
import { X, Loader2, AlignLeft, Tag, Calendar, User, BarChart2, Activity, Sparkles, Mic } from 'lucide-react';
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

const Field = ({ label, icon: Icon, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <label
      style={{
        fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase',
        letterSpacing: '0.04em', marginBottom: '6px', fontSize: '11px',
      }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  borderRadius: '10px',
  border: '1.5px solid var(--border-input)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  padding: '10px 12px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const InputField = (props) => (
  <input
    {...props}
    style={inputStyle}
    onFocus={(e) => {
      e.target.style.borderColor = '#6366f1';
      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
      e.target.style.backgroundColor = 'var(--bg-card)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = 'var(--border-input)';
      e.target.style.boxShadow = 'none';
      e.target.style.backgroundColor = 'var(--bg-input)';
    }}
  />
);

const SelectField = ({ children, ...props }) => (
  <select
    {...props}
    style={{ ...inputStyle, cursor: 'pointer' }}
    onFocus={(e) => {
      e.target.style.borderColor = '#6366f1';
      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
      e.target.style.backgroundColor = 'var(--bg-card)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = 'var(--border-input)';
      e.target.style.boxShadow = 'none';
      e.target.style.backgroundColor = 'var(--bg-input)';
    }}
  >
    {children}
  </select>
);

const TaskForm = ({ initial, onSubmit, onClose }) => {
  const { user } = useAuthStore();
  const isManager = user?.role === 'manager';

  const [form, setForm] = useState(
    initial
      ? { ...defaultForm, ...initial, assignedTo: initial.assignedTo?._id || '' }
      : defaultForm
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleRewrite = async () => {
    if (!form.description) return;
    setLoadingAI(true);
    try {
      const { data } = await rewriteTaskDescription(form.description);
      setForm((p) => ({ ...p, description: data.result }));
      toast.success('Description rewritten by AI ✨');
    } catch (err) {
      toast.error('Failed to rewrite description');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in your browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setForm((p) => ({ ...p, description: (p.description + ' ' + transcript).trim() }));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.start();
  };

  useEffect(() => {
    if (isManager) {
      getUsers()
        .then((res) => setUsers(res.data))
        .catch(() => {});
    }
  }, [isManager]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    if (!payload.dueDate) delete payload.dueDate;
    if (!payload.assignedTo) delete payload.assignedTo;
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          width: '100%', maxWidth: '540px', border: '1px solid var(--border)',
          maxHeight: '92vh', display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px 14px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {initial ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {initial ? 'Update the task details below' : 'Fill in the details to create a task'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto' }}>
          <Field label="Title" icon={Tag}>
            <InputField
              name="title" required value={form.title} onChange={handleChange}
              placeholder="What needs to be done?"
            />
          </Field>

          <Field label="Description" icon={AlignLeft}>
            <div style={{ position: 'relative' }}>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Add context or use the Mic to dictate…"
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.5, minHeight: '80px', paddingBottom: '40px' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
                  e.target.style.backgroundColor = 'var(--bg-card)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-input)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'var(--bg-input)';
                }}
              />
              
              {/* AI Tools Bar */}
              <div style={{
                position: 'absolute', bottom: '8px', right: '8px',
                display: 'flex', gap: '6px'
              }}>
                <button
                  type="button" onClick={handleSpeech} title="Speech to text"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px',
                    borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: isListening ? '#ef4444' : 'var(--bg-card)', 
                    color: isListening ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isListening ? '0 0 0 4px rgba(239, 68, 68, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => { if(!isListening) { e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; e.currentTarget.style.color = '#ef4444'; }}}
                  onMouseLeave={(e) => { if(!isListening) { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                >
                  <Mic size={14} className={isListening ? "animate-pulse" : ""} />
                </button>
                <button
                  type="button" onClick={handleRewrite} disabled={loadingAI || !form.description} title="Rewrite with AI"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '28px', padding: '0 10px', gap: '6px',
                    borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.3)', backgroundColor: 'rgba(168, 85, 247, 0.1)', 
                    color: '#a855f7', cursor: (loadingAI || !form.description) ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    fontSize: '11px', fontWeight: 600, opacity: (!form.description && !loadingAI) ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => { if(!loadingAI && form.description) { e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                  onMouseLeave={(e) => { if(!loadingAI && form.description) { e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}}
                >
                  {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Rewrite
                </button>
              </div>
            </div>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Priority" icon={BarChart2}>
              <SelectField name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </SelectField>
            </Field>

            <Field label="Status" icon={Activity}>
              <SelectField name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </SelectField>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Due Date" icon={Calendar}>
              <InputField
                type="date" name="dueDate"
                value={form.dueDate ? form.dueDate.slice(0, 10) : ''}
                onChange={handleChange}
              />
            </Field>

            {isManager && (
              <Field label="Assign To" icon={User}>
                <SelectField name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </SelectField>
              </Field>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid var(--border)',
                backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                backgroundColor: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', fontSize: '13px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#4338ca'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#4f46e5'; }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {initial ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
