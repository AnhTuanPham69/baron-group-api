const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const tutorController = require('../controllers/tutorController');

router.post(
    '/accept/:uid',
    tokenHandler.verifyAdminToken,
    tutorController.acceptTutor
);

router.post(
    '/register_tutor',
    tokenHandler.verifyToken,
    tutorController.registerTutor
);

router.get(
    '/',
    tokenHandler.verifyToken,
    tutorController.getListTutor
);

module.exports = router;