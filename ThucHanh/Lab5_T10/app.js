const express = require('express');
const app = express();
const routes = require('./routes/productRoutes');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

app.listen(3000, () => {
    console.log("Server chạy tại http://localhost:3000");
});