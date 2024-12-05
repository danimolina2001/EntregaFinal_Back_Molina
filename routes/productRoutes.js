const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filters = {};

    if (query) {
        filters.$or = [
            { name: new RegExp(query, 'i') },
            { category: new RegExp(query, 'i') }
        ];
    }

    try {
        const totalProducts = await Product.countDocuments(filters);
        const products = await Product.find(filters)
            .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {})
            .limit(Number(limit))
            .skip((page - 1) * limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages: Math.ceil(totalProducts / limit),
            prevPage: page > 1 ? page - 1 : null,
            nextPage: (page * limit < totalProducts) ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: (page * limit < totalProducts),
            prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
            nextLink: (page * limit < totalProducts) ? `/api/products?page=${page + 1}&limit=${limit}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;