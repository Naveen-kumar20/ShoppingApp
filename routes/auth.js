const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();


//to show the form for signup/register.
router.get('/register', (req,res)=>{
    res.render('auth/signup')
})

//actually want to register user into my DB.
router.post('/register', async(req,res)=>{
    let {username, email, password, role} = req.body;
    const user = new User({username, email, role}); //make a new user object.
    const newUser = await User.register(user, password); //saving new user in DB
    // res.redirect('/login')
    req.login(newUser, function(err){
        if(err){return next(err)}
        res.redirect('/products')
    })
})

//to show the form for LOGIN.
router.get('/login', (req,res)=>{
    res.render('auth/login')
})
//actually login via DB
router.post('/login',
    passport.authenticate('local', { 
        failureRedirect: '/login' 
    }),
    (req,res)=>{
        res.redirect('/products')
    })

//logout a user.
router.get('/logout', async(req,res)=>{

    req.logout(()=>{// removing the user object
        req.session.destroy()//removing the session from the server.
        res.clearCookie('connect.sid')//removing the cookie from the browser.
        res.redirect('/login')
    }); 
    
})





module.exports = router