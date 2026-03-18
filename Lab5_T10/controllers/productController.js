const Product = require('../models/productModel');
const { s3 } = require('../config/aws');
const fs = require('fs');

// 1. Lấy danh sách & Tìm kiếm
exports.getAll = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.render('products/list', { products });
    } catch (err) {
        console.error(" CHI TIẾT LỖI AWS ");
        console.error(err); // Xem lỗi ở Terminal (màn hình đen)
        res.status(500).send("Lỗi cụ thể: " + err.message);
    }
};


// 2. Hiển thị form thêm
exports.showAdd = (req, res) => {
    res.render('products/add');
};

// 3. Xử lý thêm sản phẩm
exports.addProduct = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.send("⚠️ Chưa chọn ảnh");

        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `products/${Date.now()}-${file.originalname}`,
            Body: fs.createReadStream(file.path),
            ContentType: file.mimetype
        };

        const s3Data = await s3.upload(s3Params).promise();

        const newProduct = {
            ID: req.body.ID,
            name: req.body.name,
            price: parseFloat(req.body.price),
            quantity: parseInt(req.body.quantity),
            image: s3Data.Location
        };

        await Product.create(newProduct);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi thêm sản phẩm");
    }
};

// 4. Hiển thị form sửa
exports.showEdit = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.send("Không tìm thấy sản phẩm");
        res.render('products/edit', { product });
    } catch (err) {
        res.status(500).send("Lỗi lấy thông tin");
    }
};

// 5. Cập nhật sản phẩm
exports.update = async (req, res) => {
    try {
        const file = req.file;
        let imageUrl = req.body.oldImage;

        if (file) {
            const s3Params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `products/${Date.now()}-${file.originalname}`,
                Body: fs.createReadStream(file.path),
                ContentType: file.mimetype
            };
            const s3Data = await s3.upload(s3Params).promise();
            imageUrl = s3Data.Location;
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }

        const updatedProduct = {
            ID: req.body.ID,
            name: req.body.name,
            price: parseFloat(req.body.price),
            quantity: parseInt(req.body.quantity),
            image: imageUrl
        };

        await Product.update(updatedProduct);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Lỗi cập nhật");
    }
};

// 6. Xóa sản phẩm
exports.delete = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Lỗi xóa");
    }
};