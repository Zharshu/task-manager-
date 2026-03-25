const router = require('express').Router();
const taskController = require('../controllers/taskController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

router.use(protect);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', requireRole('manager'), taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', requireRole('manager'), taskController.deleteTask);

module.exports = router;
