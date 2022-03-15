const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/tokenHander');
const bookController = require('../controllers/bookController');



const document = async (req, res) => {
    return res.json(
        {
            "admin route": {
                "/admin/": {
                    method: "POST",
                    result: "login"
                },
                "/admin/forgot_password":
                {
                    method: "POST",
                    result: "forgot password"
                },
                "/admin/change_password":
                {
                    method: "POST",
                    result: "change password"
                }
            },
            "user route: user/": {
                "/listUserFirebase":
                {
                    method: "GET",
                    result: "get list user from firebase"
                },
                "/:idFirebase":
                {
                    method: "GET",
                    result: "Find user by id"
                },
                "/:id":
                {
                    method: "GET",
                    result: "Find user by id"
                },
                "/register":
                {
                    method: "POST",
                    result: "Mỗi lần có user mới trên firebase thì gọi api này để đẩy user đó vào database và trả về token",
                    body: `User_ID: "Chuỗi id user trên firebase" `,
                },

                "/loginFirebase":
                {
                    method: "POST",
                    result: "Mỗi lần đăng nhập sẽ kiểm tra id này có trong hệ thống hay không và trả về token",
                    body: `User_ID: "Chuỗi id user trên firebase" `
                },
            },
            "book route": {
                "/book/": {
                    method: "GET",
                    result: "lấy danh sách của sách",
                    header: "Authorization: Bearer {token của admin}"
                },
                "/book/": {
                    method: "POST",
                    result: "Đăng sách",
                    header: "Authorization: Bearer {token của user}",
                    body: {
                        "bookname": "Cửa sổ tâm hồn",
                        "phone": "0799101759",
                        "content": "Em muốn bán sách này ai quan tâm không ạ",
                        "price": "100000",
                        "image": "http://300b5338.vws.vegacdn.vn/image/img.news/0/0/0/492.jpg?v=1&w=600&h=400&nocache=1"
                    }
                }
            },
            "/post/": {
                "/postQuestion": {
                    method: "POST",
                    result: "post question"
                },
                "/listQuestion": {
                    method: "GET",
                    result: "get list Question"
                },
                "/:id": {
                    method: "GET",
                    result: "update Question by id"
                },
                "/:id": {
                    method: "PUT",
                    result: "delete Question by id"
                },
                "/:id": {
                    method: "DELETE",
                    result: "get Question by id"
                },
                "/:id/comment": {
                    method: "GET",
                    result: "get Comment by in post"
                },
                "/:id/comment": {
                    method: "POST",
                    result: "post Comment by in post"
                },
                "/:id/like": {
                    method: "GET",
                    result: "get the number of likes of the post"
                },
                "/:id/like": {
                    method: "POST",
                    result: "like post <the user has liked it, it will return to dislike status>"
                },
                "/:id/comment/:idCmt/vote": {
                    method: "POST",
                    result: "Vote comment 0-5 sao",
                    body: ` const idComment = req.body.idComment;
                        const idUser = req.body.User_ID;
                        const star = req.body.star;`
                },
                "/:id/comment/:idCmt/vote": {
                    method: "DELETE",
                    result: "Xóa bình chọn",
                },
                "/:id/comment/:idCmt/getVote": {
                    method: "GET",
                    result: "Lấy danh sách bình chọn của comment đó sau đó lấy tổng số sao chia cho tổng lượng vote"
                },
                "/:id/comment/:idCmt/reply": {
                    method: "GET",
                    result: "Reply comment",
                    exUrl: "localhost:5000/api/post/622d97ee8cd856ec95ddf2e2/comment/622e44336ff3d35050dc1872/reply",
                },
                "/:id/comment/:idCmt/reply": {
                    method: "POST",
                    result: "Reply comment",
                    exUrl: "localhost:5000/api/post/622d97ee8cd856ec95ddf2e2/comment/622e44336ff3d35050dc1872/reply",
                    header: "Authorization: Bearer token",
                    body: `{"Content": "Quân Reply comment"}`
                }
            }

        });

}

router.get('/document', document);
module.exports = router;