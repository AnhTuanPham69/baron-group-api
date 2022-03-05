const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post(
    '/comment',
    commentController.postComment
);

// router.get('/listQuestion',
// commentController.getListQuestion
// );

// router.get('/:id',
// commentController.getQuestion
// );

module.exports = router;