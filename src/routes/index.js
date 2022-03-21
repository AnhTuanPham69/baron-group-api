const router = require('express').Router();

router.use('/user', require('./userRoute'));
router.use('/admin', require('./adminRoute'));
router.use('/post', require('./postRoute'));
router.use('/book', require('./bookRoute'));
router.use('/tutor', require('./tutorRoute'));
router.use('/', require('./document'));

module.exports = router;
