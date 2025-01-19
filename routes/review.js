const express = require('express')
const router = express.Router() //mini instance or mini server.
const Product = require('../models/Products')
const Review = require('../models/Review')
const {reviewValidate} = require('../middleware')


async function updateAvgRatingAfterAddingReview(productId){
    const product = await Product.findById(productId).populate('reviews')
    if(product.reviews.length > 0){
        const starRatingSum = product.reviews.reduce((sum, review)=> sum + review.rating ,0)
        const calcultedAvgRating = Number((starRatingSum / product.reviews.length).toFixed(1)); //toFixed is used to make sum having 1 decimal only and it convert number to string. like 3.333333333 to 3.3
        product.avgRating = calcultedAvgRating;
    }else{
        product.avgRating = 0;
    }

    await product.save();
 }




router.post('/products/:id/review', reviewValidate, async(req,res)=>{
    try{
        let {rating, comment} = req.body;
        let {id} = req.params;
        const product = await Product.findById(id)
        let review = new Review({rating, comment})
        
        product.reviews.push(review)
        
        await review.save()
        await product.save()

        await updateAvgRatingAfterAddingReview(id)
        res.redirect(`/products/${id}`)
    }
    catch(e){
        res.status(500).render('error', {err: e.message})
    }

})


module.exports = router;