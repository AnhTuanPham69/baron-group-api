const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const bookController = require('../controllers/bookController');

router.post(
    '/',
    tokenHandler.verifyToken,
    bookController.postBook
);

router.post(
    '/createCategory',
    tokenHandler.verifyAdminToken,
    bookController.createCategory
);

router.get(
    '/getCategory',
    tokenHandler.verifyToken,
    bookController.getListCategory
);

router.get(
    '/',
    tokenHandler.verifyToken,
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