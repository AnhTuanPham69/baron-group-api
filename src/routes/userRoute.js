const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

router.get(
    '/listUserFirebase',
    tokenHandler.verifyAdminToken,
    userController.listUserFirebase
);
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
    userController.loginFb
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

module.exports = router;
