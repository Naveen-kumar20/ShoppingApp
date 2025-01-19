const {productSchema, reviewSchema} = require('./joiSchema');
const Product = require('./models/Products');

const productValidate = (req,res,next)=>{
    const {name, img, price, desc} = req.body;
    const {error} = productSchema.validate({name, img, price, desc}); //.validate method returns two things -> error and value.
    if(error)
        res.send('error')
    next();
}

const reviewValidate = (req,res,next)=>{
    const {rating, comment} = req.body;
    const {error} = reviewSchema.validate({rating, comment}); //.validate method returns two things -> error and value.
    if(error){
       return res.send('error')
    }
    next();
}

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error' , 'Please login first.')
        return res.redirect('/login')
    }
    next();
}

const isSeller = (req,res,next)=>{
    if(!req.user.role){
        // you don't have the permission to do that
        // console.log("don't have permission to do that");
        req.flash('error' , "don't have permission to do that")
        return res.redirect('/products')
    } else if(req.user.role !== 'seller'){
        // you don't have the permission to do that
        // console.log("don't have permission to do that");
        req.flash('error' , "don't have permission to do that")
       return res.redirect('/products')
    }
    next();
}

const isProductAuthor = async(req,res,next)=>{
    let {id} = req.params;
    let product = await Product.findById(id);
    if(!product.author.equals(req.user._id)){ //When compare two object IDs, we have to use equal(), we can't use '===' or '==', only equal() is allowed.
        // console.log("You are not authorised to do it.");
        req.flash('error' , 'You are not authorised to do it.')
        return res.redirect('/products')
    }
    next()
}


module.exports = {productValidate, reviewValidate, isLoggedIn, isSeller, isProductAuthor};