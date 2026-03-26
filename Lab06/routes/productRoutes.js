const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/productController');

// Cấu hình nơi lưu ảnh tạm thời
const upload = multer({ dest: 'uploads/' });

router.get('/', controller.getAll);
router.get('/search', controller.getAll);

router.get('/add', controller.showAdd);
router.post('/add', upload.single('image'), controller.addProduct);

router.get('/edit/:id', controller.showEdit);
router.post('/edit/:id', upload.single('image'), controller.update); // Sửa lỗi thiếu upload ở đây

router.get('/delete/:id', controller.delete);
router.get('/details/:id', controller.showDetail); // Thêm dòng này

module.exports = router;

module.exports = router;