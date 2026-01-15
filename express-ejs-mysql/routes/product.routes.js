const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// Home
// router.get('/', async(req, res) => {
//     const [rows] = await db.query('SELECT * FROM products');
//     res.render('products', { products: rows });
// }); // products dau la ten file, pro thu 2 la ten trong file product.ejs

// Home + Search
router.get('/', async(req, res) => {
    const keyword = req.query.keyword || '';

    let sql = 'SELECT * FROM products';
    let params = [];

    if (keyword) {
        sql += ' WHERE name LIKE ?';
        params.push(`%${keyword}%`);
    }

    const [rows] = await db.query(sql, params);

    res.render('products', {
        products: rows,
        keyword: keyword
    });
});


// Add product
router.post('/add', async(req, res) => {
    const { name, price, quantity } = req.body;
    await db.query(
        'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)', [name, price, quantity]
    );
    res.redirect('/');
});

// Delete product
router.post('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.redirect('/');
});

// Show edit form
router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const [rows] = await db.query(
        'SELECT * FROM products WHERE id = ?', [id]
    );
    res.render('edit', { product: rows[0] });
});

// Update product
router.post('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    await db.query(
        'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]
    );

    res.redirect('/');
});

module.exports = router;