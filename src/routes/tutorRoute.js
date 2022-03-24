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

// Post Bài Giảng
router.get(
    '/post',
    tutorController.getListPost
);

router.get(
    '/post/:id',
    tokenHandler.verifyToken,
    tutorController.getTutorPost
);

router.post(
    '/post/',
    tokenHandler.isTutor,
    tutorController.tutorPost
);

router.put(
    '/post/:id',
    tokenHandler.verifyToken,
    tutorController.updatePost
);

router.delete(
    '/post/:id',
    tokenHandler.verifyToken,
    tutorController.updatePost
);

module.exports = router;