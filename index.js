// index.js
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { engine } = require('express-handlebars'); 

const app = express();

connectDB();

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views'); // Establecer la carpeta de vistas

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para renderizar la vista de productos
app.get('/products', async (req, res) => {
    const { limit = 10, page = 1 } = req.query;

    try {
        const totalProducts = await Product.countDocuments();
        const products = await Product.find()
            .limit(Number(limit))
            .skip((page - 1) * limit);

        res.render('index', { products, totalProducts, limit, page });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving products');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});