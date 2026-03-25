const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const logActivity = async (taskId, userId, action, metadata = {}) => {
  await ActivityLog.create({ task: taskId, user: userId, action, metadata });
};

const getTasks = async (userId, role, query) => {
  const { page = 1, limit = 10, status, priority } = query;
  const filter = {};

  if (role !== 'manager') {
    filter.assignedTo = userId;
  }
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(filter),
  ]);

  return { tasks, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  return task;
};

const createTask = async (data, creatorId) => {
  const task = await Task.create({ ...data, createdBy: creatorId });
  await logActivity(task._id, creatorId, 'Created task', { title: task.title });
  return task.populate('assignedTo', 'name email');
};

const updateTask = async (taskId, updates, userId, role) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }

  // Regular users can only change status
  if (role !== 'manager') {
    if (Object.keys(updates).some((k) => k !== 'status')) {
      const err = new Error('You can only update the task status');
      err.statusCode = 403;
      throw err;
    }
  }

  const changed = {};
  Object.entries(updates).forEach(([key, val]) => {
    if (task[key] !== val) {
      changed[key] = { from: task[key], to: val };
      task[key] = val;
    }
  });

  await task.save();
  if (Object.keys(changed).length > 0) {
    await logActivity(taskId, userId, 'Updated task', changed);
  }

  return task.populate(['assignedTo', 'createdBy']);
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  await task.deleteOne();
  await logActivity(taskId, userId, 'Deleted task', { title: task.title });
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
