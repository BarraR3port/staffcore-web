const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn} = require('../lib/auth')
const db = require('../database')

async function hasServerLinked(user){
    const result = await db.query('SELECT serverId FROM sc_users WHERE username LIKE ?',[user])
    return result[0].serverId !== null;
}


router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', passport.authenticate('local.register', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true,
    successFlash: true
}));

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    })(req, res, next);
})

router.get('/profile', isLoggedIn, async (req, res) => {
    console.log(req.user.username);
    if ( await hasServerLinked( req.user.username ) ){
        const serverId = await db.query('SELECT serverId FROM sc_users WHERE username LIKE ?',[req.user.username])
        const server = await db.query('SELECT * FROM sc_servers WHERE serverId LIKE ?',[serverId[0].serverId])
        await res.render('profile', {server});
        return;
    }
    await res.render('profile');
    }
)

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success', 'Successfully logged out ')
    res.redirect('/login');
})

module.exports = router;