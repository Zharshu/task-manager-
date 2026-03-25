const express = require('express');
const { rewriteText } = require('../controllers/aiController');
const protect = require('../middleware/auth');

const router = express.Router();

// Allow any authenticated user to rewrite text
router.post('/rewrite', protect, rewriteText);

module.exports = router;
