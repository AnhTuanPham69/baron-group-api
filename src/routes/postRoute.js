const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.post(
    '/postQuestion',
    postController.postQuestion
);

router.get('/listQuestion',
postController.getListQuestion
);

router.get('/:id',
postController.getQuestion
);

router.post('/:id/like',
postController.likeQuestion
);

router.get('/:id/like',
postController.getLike
);

router.post(
    '/:id/comment',
    commentController.postComment
);

router.get(
    '/:id/comment',
    commentController.getComment
);

module.exports = router;