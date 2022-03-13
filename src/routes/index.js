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
            "/register": 
                {method:"POST",
                result:"Mỗi lần có user mới trên firebase thì gọi api này để đẩy user đó vào database và trả về token"},
                body: `User_ID: "Chuỗi id user trên firebase" `,
            "/loginFb": 
                {method:"POST",
                result:"Mỗi lần đăng nhập sẽ kiểm tra id này có trong hệ thống hay không và trả về token",
            body: `User_ID: "Chuỗi id user trên firebase" `},
        },
        "/post/": {
            "/postQuestion": {method:"POST",
            result:"post question"},
            "/listQuestion": {method:"GET",
            result:"get list Question"},
            "/:id": {method:"GET",
            result:"update Question by id"},
            "/:id": {method:"PUT",
            result:"delete Question by id"},
            "/:id": {method:"DELETE",
            result:"get Question by id"},
            "/:id/comment": {method:"GET",
            result:"get Comment by in post"},
            "/:id/comment": {method:"POST",
            result:"post Comment by in post"},
            "/:id/like": {method:"GET",
            result:"get the number of likes of the post"},
            "/:id/like": {method:"POST",
            result:"like post <the user has liked it, it will return to dislike status>"}},
        });
});

module.exports = router;
