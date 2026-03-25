const router = require('express').Router();
const { getUsers } = require('../controllers/userController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

router.get('/', protect, requireRole('manager'), getUsers);

module.exports = router;
