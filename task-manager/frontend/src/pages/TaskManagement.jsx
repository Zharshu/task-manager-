import { useCallback, useEffect, useState } from 'react';
import { Plus, ListFilter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import ActivityLogPanel from '../components/ActivityLogPanel';
import useSocket from '../hooks/useSocket';

const TaskManagement = () => {
  useSocket();
  const { user } = useAuthStore();
  const { tasks, pagination, filters, setTasks, setFilters } = useTaskStore();
  const isManager = user?.role === 'manager';

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(() => {
    getTasks({ page, limit: 20, ...filters })
      .then((res) => setTasks(res.data.tasks, res.data))
      .catch(() => toast.error('Failed to load tasks'));
  }, [page, filters, setTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
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

  const selectStyle = {
    height: '40px',
    fontSize: '14px',
    border: '1.5px solid var(--border)',
    borderRadius: '12px',
    padding: '0 14px',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Page header card */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
          backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-card)', padding: '20px 24px', marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Task Board
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Drag cards between columns to update status
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
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

          <select
            value={filters.priority}
            onChange={(e) => { setFilters({ priority: e.target.value }); setPage(1); }}
            style={selectStyle}
          >
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {isManager && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 20px',
                backgroundColor: '#4f46e5', color: '#fff', fontSize: '14px', fontWeight: 600,
                borderRadius: '12px', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79,70,229,0.3)', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338ca'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; }}
            >
              <Plus size={16} />
              New Task
            </button>
          )}
        </div>
      </div>

      <div className={`flex gap-6 ${selectedTaskId ? 'flex-col lg:flex-row' : ''}`}>
        <div className="flex-1 min-w-0">
          {tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
              <ListFilter className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No tasks found</p>
            </div>
          ) : (
            <KanbanBoard
              tasks={tasks}
              onEdit={(task) => setEditing(task)}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        {selectedTaskId && (
          <div className="w-full lg:w-72 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm h-fit">
            <ActivityLogPanel taskId={selectedTaskId} />
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {showForm && <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editing && <TaskForm initial={editing} onSubmit={handleEdit} onClose={() => setEditing(null)} />}
    </div>
  );
};

export default TaskManagement;
