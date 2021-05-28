const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isConfigured } = require('../lib/auth')

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', passport.authenticate('local.register',{
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/login', (req,res)=>{
    res.render('auth/login');
})

router.post('/login', (req,res,next)=>{
    passport.authenticate('local.login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
})

router.get('/profile', isLoggedIn, (req, res) =>{
    res.render('profile');
    }
)

router.get('/logout',(req,res)=>{
    req.logOut()
    req.flash('success','Successfully logged out ')
    res.redirect('/login');
})

module.exports = router;