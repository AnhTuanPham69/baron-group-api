const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const tokenHandler = require('../middleware/tokenHander');

router.post(
    '/postQuestion',
    tokenHandler.verifyToken,
    postController.postQuestion
);

router.get('/listQuestion',
tokenHandler.verifyToken,
postController.getListQuestion
);

router.get('/:id',
tokenHandler.verifyToken,
postController.getQuestion
);

router.put('/:id',
tokenHandler.verifyToken,
postController.update
);

router.delete('/:id',
tokenHandler.verifyToken,
postController.delete
);

// Like Route
router.post('/:id/like',
tokenHandler.verifyToken,
postController.likeQuestion
);

router.get('/:id/like',
tokenHandler.verifyToken,
postController.getLike
);

router.get('/like',
tokenHandler.verifyAdminToken,
postController.getTotalLike
);


// Comment Route
router.post(
    '/:id/comment',
    tokenHandler.verifyToken,
    commentController.postComment
);

router.get(
    '/:id/comment',
    tokenHandler.verifyToken,
    commentController.getComment
);

/* reply comment */
router.post(
    '/:id/comment/:idCmt/reply',
    tokenHandler.verifyToken,
    commentController.replyComment
);

router.get(
    '/:id/comment/:idCmt/reply',
    tokenHandler.verifyToken,
    commentController.getReplyComment
);

// Vote Route
router.post(
    '/:id/comment/:idCmt/vote',
    tokenHandler.verifyToken,
    commentController.voteComment
);

router.get(
    '/:id/comment/:idCmt/vote',
    tokenHandler.verifyToken,
    commentController.getVote
);

router.get(
    '/:id/comment/vote/:voteId',
    tokenHandler.verifyToken,
    commentController.getOneVote
);

router.delete(
    '/:id/comment/:idComment/vote',
    tokenHandler.verifyToken,
    commentController.deleteVote
);

module.exports = router;