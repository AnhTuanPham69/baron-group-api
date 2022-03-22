const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const postController = require('../controllers/postController');

router.get(
    '/',
    tokenHandler.verifyAdminToken,
    postController.getTotalLike
);


// Post management

module.exports = router;