import { useCallback, useEffect, useState } from 'react';
import { Plus, Loader2, SlidersHorizontal, LayoutGrid, ChevronLeft, ChevronRight, Sun, Moon, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import ConfirmModal from '../components/ConfirmModal';
import useSocket from '../hooks/useSocket';
import { useThemeStore } from '../store/themeStore';

const TaskManagement = () => {
  useSocket();
  const { user } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const { tasks, pagination, filters, setTasks, setFilters } = useTaskStore();
  const isManager = user?.role === 'manager';

  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);

  const fetchTasks = useCallback(() => {
    getTasks({ page, limit: 20, ...filters })
      .then((res) => setTasks(res.data.tasks, res.data))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, [page, filters, setTasks]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (data) => {
    try {
      await createTask(data);
      toast.success('Task created');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateTask(editing._id, data);
      toast.success('Task updated');
      setEditing(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTask(deletingId);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
      fetchTasks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500 min-h-96">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading board…</p>
      </div>
    );
  }

  const selectStyle = {
    height: '42px',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#334155',
    padding: '0 40px 0 14px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const selectWrapperStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  };

  const chevronStyle = {
    position: 'absolute',
    right: '10px',
    pointerEvents: 'none',
    color: '#94a3b8',
  };

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{ padding: '20px 40px 30px', maxWidth: '1280px', margin: '0 auto' }}
    >

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="slide-in" style={{ paddingBottom: '28px' }}>
        <div className="flex flex-wrap items-start justify-between gap-6">

          {/* Left: title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40">
              <LayoutGrid size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Task Board
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                  {tasks.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Drag cards between columns to update status
              </p>
            </div>
          </div>

          {/* Right: filters + button */}
          <div className="flex flex-wrap items-center" style={{ gap: '10px' }}>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <SlidersHorizontal size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />

              {/* All Statuses Dropdown */}
              <div style={selectWrapperStyle}>
                <select
                  value={filters.status}
                  onChange={(e) => { setFilters({ status: e.target.value }); setPage(1); }}
                  style={selectStyle}
                >
                  <option value="">All statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <ChevronDown size={14} style={chevronStyle} />
              </div>

              {/* All Priorities Dropdown */}
              <div style={selectWrapperStyle}>
                <select
                  value={filters.priority}
                  onChange={(e) => { setFilters({ priority: e.target.value }); setPage(1); }}
                  style={selectStyle}
                >
                  <option value="">All priorities</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
                <ChevronDown size={14} style={chevronStyle} />
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggle}
              style={{
                width: '42px',
                height: '42px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                color: '#64748b',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
              }}
              title={dark ? 'Light Mode' : 'Dark Mode'}
            >
              {dark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>

            {isManager && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '42px',
                  gap: '8px',
                  padding: '0 24px',
                  borderRadius: '12px',
                  background: '#4f46e5',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
                  transition: 'all 0.2s',
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Kanban / Empty ──────────────────────────────────── */}
      <div className="flex-1 pb-10 overflow-x-auto">
        {tasks.length === 0 ? (
          <div className="fade-in flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <LayoutGrid size={26} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">No tasks found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">
              Try adjusting your filters or create a new task.
            </p>
            {isManager && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all duration-150"
              >
                <Plus size={15} />
                Create Task
              </button>
            )}
          </div>
        ) : (
          <KanbanBoard
            tasks={tasks}
            onEdit={(task) => setEditing(task)}
            onDelete={(id) => setDeletingId(id)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────── */}
      {pagination.pages > 1 && (
        <div className="fade-in flex items-center justify-center gap-2 pb-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-4 h-9 inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            {page} / {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────────── */}
      {showForm && <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editing  && <TaskForm initial={editing} onSubmit={handleEdit} onClose={() => setEditing(null)} />}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskManagement;
