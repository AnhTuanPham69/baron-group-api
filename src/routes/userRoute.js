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
    userController.syncUser
);

router.post(
    '/loginFirebase',
    userController.loginFb
);

//tokenHandler.verifyAdminToken,
router.get(
    '/:id',
    userController.getOne
);

router.put(
    '/:id',
    tokenHandler.verifyAdminToken,
    userController.update
);

router.delete(
    '/:id',
    tokenHandler.verifyAdminToken,
    userController.delete
);

module.exports = router;
