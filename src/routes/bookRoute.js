const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const bookController = require('../controllers/bookController');

router.post(
    '/',
    tokenHandler.isUser,
    bookController.postBook
);

router.post(
    '/createCategory',
    tokenHandler.isUser,
    bookController.createCategory
);

router.get(
    '/',
    tokenHandler.verifyAdminToken,
    bookController.getBook
);

router.get(
    '/:id',
    tokenHandler.verifyToken,
    bookController.getOneBook
);
router.put(
    '/:id',
    tokenHandler.verifyToken,
    bookController.updateBook
);

router.delete(
    '/:id',
    tokenHandler.verifyToken,
    bookController.deleteBook
);

module.exports = router;