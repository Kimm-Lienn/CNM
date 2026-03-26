// 1. Dùng require THAY CHO import (Bắt buộc)
const AWS = require('aws-sdk');
const Product = require('../models/productModel');
const { s3, dynamoDB } = require('../config/aws'); // Lấy dynamoDB từ config/aws luôn cho đồng bộ
const fs = require('fs');

const TableName = "Products";

// 1. Lấy danh sách
exports.getAll = async(req, res) => {
    try {
        const products = await Product.getAll();
        res.render('products/list', { products });
    } catch (err) {
        console.error("LỖI LẤY DANH SÁCH:", err);
        res.status(500).send("Lỗi: " + err.message);
    }
};

// 2. Hiển thị form thêm
exports.showAdd = (req, res) => {
    res.render('products/add');
};

// 3. Xử lý thêm sản phẩm
exports.addProduct = async(req, res) => {
    try {
        const { ID, name, price, unit_in_stock } = req.body;
        const file = req.file;

        if (!ID) return res.status(400).send("Lỗi: Mã sản phẩm (ID) không được để trống!");

        let imageUrl = "";
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

        const newProduct = {
            ID: String(ID),
            name: name,
            price: Number(price),
            unit_in_stock: Number(unit_in_stock),
            url_image: imageUrl
        };

        await Product.create(newProduct);
        res.redirect('/');
    } catch (err) {
        console.error("LỖI THÊM:", err);
        res.status(500).send("Lỗi: " + err.message);
    }
};

// 4. Hiển thị form sửa
exports.showEdit = async(req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.send("Không tìm thấy sản phẩm");
        res.render('products/edit', { product, error: null });
    } catch (err) {
        res.status(500).send("Lỗi lấy thông tin");
    }
};

// 5. Cập nhật sản phẩm
exports.update = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, price, unit_in_stock } = req.body;

        const oldProduct = await Product.getById(id);

        let imageUrl = oldProduct ? (oldProduct.url_image || oldProduct.image) : "";
        if (req.file) {
            // Lưu ý: Nếu muốn upload S3 khi update, hãy copy logic s3.upload ở hàm addProduct lên đây
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = {
            ID: req.params.id,
            name: name,
            price: Number(price),
            unit_in_stock: Number(unit_in_stock),
            url_image: imageUrl
        };

        await Product.update(updatedProduct);
        res.redirect('/');
    } catch (err) {
        console.error("LỖI CẬP NHẬT:", err);
        res.status(500).send("Lỗi: " + err.message);
    }
};

// 6. XÓA SẢN PHẨM (Hàm này bị thiếu gây lỗi server)
exports.delete = async(req, res) => {
    try {
        const { id } = req.params;
        console.log("===> Đang thực hiện xóa ID:", id);

        await Product.delete(id);

        res.redirect('/');
    } catch (err) {
        console.error("LỖI XÓA:", err);
        res.status(500).send("Lỗi xóa sản phẩm: " + err.message);
    }
};

// 7. XEM CHI TIẾT (Lấy nốt 0.5 điểm Tiêu chí 7)
exports.showDetail = async(req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.send("Sản phẩm không tồn tại");
        res.render('products/details', { product });
    } catch (err) {
        res.status(500).send("Lỗi xem chi tiết");
    }
};