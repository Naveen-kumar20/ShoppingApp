require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const seedDB = require('./seed')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/User')
const Razorpay = require('razorpay');

const productRouter = require('./routes/products')
const reviewRouter = require('./routes/review')
const authRouter = require('./routes/auth')
const cartRouter = require('./routes/cart')
const wishLIstRouter = require('./routes/APIs/wishListApi')
const flash = require('connect-flash');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({ //middleware needed to use session.
    secret: 'thisissecretkey', //secret key just like signed key.
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //date.now() gives current time(started from 1st jan-1970) in milisecond, and this multiplicated number is 7days in miliseconds, means cookie will expire 7days after from current time.
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect(process.env.MONGO_CONNECT)
    .then(() => {
        console.log("DB CONNECTED SUCCESFULLY");
    })
    .catch((err) => {
        console.log("DB NOT CONNECTED");
        console.log(err);
    })


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})

// ===========================RAZOR-PAY======================================

var RazorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_DI,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//   creating order
app.post('/create-order', async (req, res) => {
    let { TotalAmount } = req.body;

    const options = {
        amount: parseInt(TotalAmount) * 100,
        currency: 'INR'
    }

    try {
        const orderOBJ = await RazorpayInstance.orders.create(options)
        res.status(200).json(orderOBJ); // Send the order details to the frontend, converting from js obj to json object.
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send('Unable to create order');
    }

})



// ===========================RAZOR-PAY END======================================






//entering initial data into database.
// seedDB();

app.use(productRouter);
app.use(reviewRouter);
app.use(authRouter);
app.use(cartRouter);
app.use(wishLIstRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`SERVER CONNECTED AT PORT: ${PORT}`);
})