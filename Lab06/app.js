const express = require('express');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use('/', productRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});