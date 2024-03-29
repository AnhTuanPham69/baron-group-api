const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const notificationController = require('../controllers/notificationController');

router.get(
    '/listUserFirebase',
    tokenHandler.verifyAdminToken,
    userController.listUserFirebase
);

// router.get(
//     '/rank',
//     userController.getRank
// );
//tokenHandler.verifyAdminToken,
router.get(
    '/listUser',
    tokenHandler.verifyAdminToken,
    userController.getAll
);

router.post(
    '/register',
    userController.register
);

router.get(
    '/sync',
    tokenHandler.verifyAdminToken,
    userController.syncUser
);

router.post(
    '/loginFirebase',
    userController.register
);

//tokenHandler.verifyAdminToken,
router.get(
    '/',
    tokenHandler.verifyToken,
    userController.getOne
);

router.put(
    '/:id',
    tokenHandler.verifyToken,
    userController.update
);

router.delete(
    '/:id',
    tokenHandler.verifyAdminToken,
    userController.delete
);

router.post(
    '/active/:id',
    tokenHandler.verifyAdminToken,
    userController.active
);

router.post(
    '/ban/:id',
    tokenHandler.verifyAdminToken,
    userController.ban
);

// notification
router.get(
    '/notice',
    tokenHandler.verifyToken,
    notificationController.getNotice
);

router.get(
    '/notice/see_all',
    tokenHandler.verifyToken,
    notificationController.getAllNotice
);

router.get(
    '/notice/read_all',
    tokenHandler.verifyToken,
    notificationController.readAll
);

router.get(
    '/notice/:id',
    tokenHandler.verifyToken,
    notificationController.getOneNotice
);

router.delete(
    '/notice/:id',
    tokenHandler.verifyToken,
    notificationController.delete
);

router.delete(
    '/notice/delete_all',
    tokenHandler.verifyToken,
    notificationController.deleteAll
);

module.exports = router;
