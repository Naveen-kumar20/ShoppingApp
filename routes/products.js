const express = require('express')
const router = express.Router() //mini instance or mini server.
const Product = require('../models/Products')
const Review = require('../models/Review')
const { productValidate, isLoggedIn, isSeller, isProductAuthor } = require('../middleware')

router.get('/', (req, res) => {
    res.redirect('/products')
})


//to show all the products.
router.get('/products', isLoggedIn, async (req, res) => {
    try {
        let fetchedProducts = await Product.find({})
        res.render('products/index', { fetchedProducts })
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})

//show form to add new product.
router.get('/product/new', isLoggedIn, (req, res) => {
    try {
        res.render('products/new')
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})

//actually adding the product.
router.post('/products', productValidate, isLoggedIn, isSeller, async (req, res) => {
    try {
        let { name, img, price, desc } = req.body;
        await Product.create({ name, img, price, desc, author: req.user._id });
        req.flash('success', 'Product added successfully')
        res.redirect('/products')
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})
//showing the info of product, when click on view.
router.get('/products/:id', isLoggedIn, async (req, res) => {
    try {
        let { id } = req.params;
        let foundProduct = await Product.findById(id).populate('reviews')
        res.render('products/show', { foundProduct })
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})
//showing form to edit product.
router.get('/products/:id/edit', isLoggedIn, async (req, res) => {
    try {
        let { id } = req.params;
        let foundProduct = await Product.findById(id)
        res.render('products/edit', { foundProduct })
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})
//actually saving the edited details.
router.patch('/products/:id', productValidate, isLoggedIn, async (req, res) => {
    try {
        let { id } = req.params;
        let { name, price, img, desc } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, img, desc })
        req.flash('success', 'Product edited successfully')
        res.redirect(`/products/${id}`)
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})
//to delete product.
router.delete('/products/:id', isLoggedIn, isProductAuthor, async (req, res) => {
    try {
        let { id } = req.params;
        let product = await Product.findById(id);
        for (let id of product.reviews)
            await Review.findByIdAndDelete(id)

        await Product.findByIdAndDelete(id);
        req.flash('success', 'Product deleted successfully')
        res.redirect('/products')
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
})

module.exports = router;