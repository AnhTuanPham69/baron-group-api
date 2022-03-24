const express = require('express');
const { overview, analysisChart } = require('../controllers/analysisController');
const { verifyAdminToken } = require('../middleware/tokenHander');
const router = express.Router();

router.get('/overview',
verifyAdminToken,
overview
);

router.get('/chart',
verifyAdminToken,
analysisChart
);
module.exports = router;