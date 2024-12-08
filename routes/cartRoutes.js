// routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/carts/:cid - Obtener todos los productos del carrito
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.productId');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST /api/carts - Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart();
        await newCart.save();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        // Filtrar el producto a eliminar
        cart.products = cart.products.filter(item => item.productId.toString() !== req.params.pid);
        await cart.save();
        
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /api/carts/:cid - Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body; // Esperamos un arreglo de productos con { productId, quantity }
        
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, { products }, { new: true });
        if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de un producto específico
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body; // Esperamos que la cantidad venga en el cuerpo de la solicitud
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        const productIndex = cart.products.findIndex(item => item.productId.toString() === req.params.pid);
        
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json({ status: 'success', payload: cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const result = await Cart.findByIdAndDelete(req.params.cid);
        if (!result) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        
        res.json({ status: 'success', message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;