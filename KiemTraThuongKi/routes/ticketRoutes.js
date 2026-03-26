const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Client } = require("../config/aws");
const ticketController = require("../controllers/ticketController");

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET_NAME,
        key: (req, file, cb) => cb(null, Date.now().toString() + "-" + file.originalname)
    })
});

// Các Route chính
router.get("/", ticketController.getTickets);
router.get("/add", (req, res) => res.render("add"));
router.post("/add", upload.single("image"), ticketController.addTicket);

// Route cho Sửa và Xóa (Lưu ý tên hàm sau dấu chấm)
router.get("/edit/:id", ticketController.getEditPage);
router.post("/delete/:id", ticketController.deleteTicket);
router.get("/edit/:id", ticketController.getEditPage);
// Route xử lý nhấn nút "Cập nhật"
router.get("/edit/:id", ticketController.getEditPage);

router.post("/delete/:id", ticketController.deleteTicket);
module.exports = router;