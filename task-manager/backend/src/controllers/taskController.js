const taskService = require('../services/taskService');

const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.user._id, req.user.role, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    const io = req.app.get('io');
    io.emit('task:created', task);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user._id,
      req.user.role
    );
    const io = req.app.get('io');
    io.emit('task:updated', task);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    const io = req.app.get('io');
    io.emit('task:deleted', { id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
