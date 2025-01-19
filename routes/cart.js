const express = require('express');
const router = express.Router()
const { isLoggedIn } = require('../middleware');
const Product = require('../models/Products');
const User = require('../models/User');

//To see the cart. Connected from below render, will invoke by  below route only.
router.get('/user/cart', isLoggedIn, async(req,res)=>{
    let user = await User.findById(req.user._id).populate('cart');
    let TotalAmount = user.cart.reduce((sum, item)=> sum + item.price ,0)
    let key_id = process.env.RAZORPAY_KEY_DI;
    res.render('cart/cart', {user, TotalAmount, key_id})
})

//Actually adding the product to the cart.
router.post('/user/:productId/add', isLoggedIn, async(req,res)=>{
  let {productId} = req.params;
  let userId = req.user._id;
  let product = await Product.findById(productId)
  let user = await User.findById(userId)
  user.cart.push(product)
  await user.save()
  res.redirect('/user/cart')
  
})

//deleting items from cart.
router.delete('/user/:productId/delete',isLoggedIn , async(req,res)=>{
  let {productId} =  req.params;
  let userId = req.user._id;
  await User.findByIdAndUpdate(userId, {$pull:{cart : productId}});
  
  res.redirect('/user/cart')
})



module.exports = router;