const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

// GET /api/dashboard/stats (protected)
router.get('/stats', authenticate, getStats);

module.exports = router;
