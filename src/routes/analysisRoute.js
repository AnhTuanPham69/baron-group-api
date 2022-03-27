const express = require('express');
const { overview, analysisChart, getRank } = require('../controllers/analysisController');
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

router.get('/rank',
getRank
);

module.exports = router;