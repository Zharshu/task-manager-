const ActivityLog = require('../models/ActivityLog');

const getLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({ task: req.params.taskId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs };
