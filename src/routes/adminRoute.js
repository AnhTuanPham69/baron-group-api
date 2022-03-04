const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const adminController = require('../controllers/adminController');

/*  __ Admin route __
     Author: Tuanpham 
     Start: 24/2/2021
     Finish: ...
*/
router.post(
    '/resgister',
    adminController.create_user
);

router.post(
    '/',
    adminController.login
);

router.post(
    '/forgot_password',
    adminController.forgotPassword
);

router.post(
    '/change_password',
    adminController.changePassword
);

// Post management

module.exports = router;