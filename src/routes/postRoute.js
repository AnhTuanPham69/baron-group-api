const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const tokenHandler = require('../middleware/tokenHander');

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

router.put('/:id',
postController.update
);

router.delete('/:id',
postController.delete
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

router.post(
    '/:id/comment/vote',
    commentController.voteComment
);

router.delete(
    '/:id/comment/vote',
    tokenHandler.verifyToken,
    commentController.deleteVote
);

router.post(
    '/:id/comment/getVote',
    commentController.getVote
);


module.exports = router;