import { create } from 'zustand';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  pagination: { total: 0, page: 1, pages: 1 },
  filters: { status: '', priority: '' },

  setTasks: (tasks, pagination) => set({ tasks, pagination }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  addOrUpdateTask: (task) => {
    set((state) => {
      const exists = state.tasks.find((t) => t._id === task._id);
      if (exists) {
        return { tasks: state.tasks.map((t) => (t._id === task._id ? task : t)) };
      }
      return { tasks: [task, ...state.tasks] };
    });
  },

  removeTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
  },
}));
