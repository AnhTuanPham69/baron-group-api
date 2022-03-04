const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

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

module.exports = router;