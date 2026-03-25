const router = require('express').Router({ mergeParams: true });
const { getLogs } = require('../controllers/logController');
const protect = require('../middleware/auth');

router.get('/:taskId', protect, getLogs);

module.exports = router;
