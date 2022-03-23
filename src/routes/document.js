const express = require('express');
const router = express.Router();


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
            "tutor route": {
                "/tutor/register_tutor": {
                    function: "đăng ký tutor",
                    method: "POST",
                    body: "...",
                    header: `Authorization: Bearer {token của user}`
                },
                "/tutor/": {
                    function: "Lấy list tutor",
                    method: "GET",
                    body: "...",
                    header: `Authorization: Bearer {token của user}`
                }
                ,
                "/tutor/post": {
                    function: "Lấy list post tutor",
                    method: "GET",
                    body: "...",
                    header: `Authorization: Bearer {token của user}`
                }
            },
            "user route: user/": {
                "/":
                {
                    method: "GET",
                    result: "Find user by id"
                },
                "/listUserFirebase":
                {
                    method: "GET",
                    result: "get list user from firebase",
                    header: `Authorization: Bearer {token của admin}`
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
                
                "/notice":
                {
                    method: "GET",
                    result: "Lấy list thông báo của user dựa trên token",
                    header: `Authorization: Bearer {token của user}`
                },
                "/notice/read_all":
                {
                    method: "GET",
                    result: "Đánh dấu là đã đọc tất cả thông báo",
                    header: `Authorization: Bearer {token của user}`
                },

                "/notice/:id":
                {
                    method: "GET",
                    result: "Xem chi tiết thông báo và đánh dấu là đã đọc",
                    header: `Authorization: Bearer {token của user}`
                },
                
                "/notice/:id":
                {
                    method: "DELETE",
                    result: "Xóa thông báo dựa trên id thông báo",
                    header: `Authorization: Bearer {token của user}`
                },
                "'/notice/delete_all'":
                {
                    method: "DELETE",
                    result: "Xóa tất cả thông báo của user",
                    header: `Authorization: Bearer {token của user}`
                },
            },
            "book route": {
                "/book/": {
                    method: "GET",
                    result: "lấy danh sách của sách",
                    header: "Authorization: Bearer {token của user}}"
                },
                "/book/": {
                    method: "POST",
                    result: "Đăng sách",
                    header: "Authorization: Bearer {token của user}",
                    body:
                        {
                        category_id:{
                                type: "id",
                                ref: "BookCategory"
                            },
                        seller:{
                            type: String
                        },
                        phone: {
                            type: String
                        },
                        address:{
                            type: String
                        },
                        issuing_company: {
                            type: String
                        },
                        publishing_date:{
                            type: String
                        },
                        price: {
                            type: String,
                            required: [true,"Bạn chưa nhập giá của sách"]
                        },
                        isChecked:{
                            type: Boolean,
                            default: false
                        },
                        status: {
                            type: String,
                            default: "new"
                        },
                        image: {
                            type: String,
                            required: [true,"Bạn chưa cung cấp hình ảnh của sách"]
                        }}
                },
                "/book/:id": {
                    method: "GET",
                    result: "lấy dữ liệu của sách dựa vào id",
                    header: "Authorization: Bearer {token của admin}"
                },
                "/book/:id": {
                    method: "PUT",
                    result: "cập nhật dữ liệu của sách dựa vào id",
                    header: "Authorization: Bearer {token của admin}"
                },
                "/book/:id": {
                    method: "DELETE",
                    result: "xóa dữ liệu của sách dựa vào id",
                    header: "Authorization: Bearer {token của admin}"
                },
                "/book/createCategory": {
                    method: "POST",
                    result: "tạo category",
                    header: "Authorization: Bearer {token của admin}",
                    body: "{slideImg: ..., name: ...}"
                },
                "/book/getCategory": {
                    method: "GET",
                    result: "get list category",
                    header: "Authorization: Bearer {token user}"
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
                    body: `const idUser = req.body.User_ID;
                           const star = req.body.star;`
                },
                "/:id/comment/:idCmt/vote": {
                    method: "DELETE",
                    result: "Xóa bình chọn",
                },
                "/:id/comment/:idCmt/vote": {
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