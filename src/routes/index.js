const router = require('express').Router();

router.use('/user', require('./userRoute'));
router.use('/admin', require('./adminRoute'));
router.use('/post', require('./postRoute'));
router.use('/', (req, res) => {
    return res.json(
        {"admin route": {
            "/admin/": {method:"POST",
            result:"login"},
            "/admin/forgot_password": 
            {method:"POST",
            result:"forgot password"},
            "/admin/change_password": 
            {method:"POST",
            result:"change password"}},
        "user route: user/": {
            "/listUserFirebase":
                {method:"GET",
                result:"get list user from firebase"},
            "/:id": 
                {method:"GET",
                result:"Find user by id"},
            "/:id": 
                {method:"GET",
                result:"Find user by id"},
        },
        "/post/": {
            "/postQuestion": {method:"POST",
            result:"post question"},
            "/listQuestion": {method:"GET",
            result:"get list Question"},
            "/:id": {method:"GET",
            result:"get Question by id"},
            "/:id/comment": {method:"GET",
            result:"get Comment by in post"},
            "/:id/comment": {method:"POST",
            result:"post Comment by in post"}},
        });
});

module.exports = router;
