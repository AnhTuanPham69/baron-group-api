const router = require('express').Router();

router.use('/user', require('./userRoute'));
router.use('/admin', require('./adminRoute'));
router.use('/', (req, res) => {
    return res.json(
        {"admin route": {
            "/admin/": "login",
            "/admin/forgot_password": "forgot password",
            "/admin/change_password": "change password"},
        "user route": {
            "/user/:id": "get id user",
            "/user/postQuestion": "Post Question"},
        "post route": {
            "//": "//",
            "//": "//",
            "//": "//"},
        });
});

module.exports = router;
