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
tokenHandler.verifyAdminToken,
postController.getListQuestion
);

router.get('/:id',
postController.getQuestion
);

router.put('/:id',
postController.update
);

router.delete('/:id',
tokenHandler.verifyToken,
postController.delete
);

// Like Route
router.post('/:id/like',
postController.likeQuestion
);

router.get('/:id/like',
postController.getLike
);

// Comment Route
router.post(
    '/:id/comment',
    commentController.postComment
);

router.get(
    '/:id/comment',
    commentController.getComment
);

/* reply comment */
router.post(
    '/:id/comment/:idCmt/reply',
    tokenHandler.isUser,
    commentController.replyComment
);

router.get(
    '/:id/comment/:idCmt/reply',
    commentController.getReplyComment
);

// Vote Route
router.post(
    '/:id/comment/vote',
    commentController.voteComment
);

router.get(
    '/:id/comment/:voteId',
    commentController.getOneVote
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