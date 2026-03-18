const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Hãy chắc chắn tên các hàm ở sau controller. trùng khớp với exports ở Controller
router.get('/', controller.getAll);
router.get('/add', controller.showAdd);
router.post('/add', upload.single('image'), controller.addProduct);

router.get('/edit/:id', controller.showEdit);
router.post('/edit/:id', upload.single('image'), controller.update);

router.get('/delete/:id', controller.delete);

// Nếu dùng search riêng, hãy dùng lại getAll (vì getAll đã có logic lọc keyword)
router.get('/search', controller.getAll); 

module.exports = router;