const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn} = require('../lib/auth');
const db = require('../database');
const bcrypt = require('bcrypt');

async function hasServerLinked(user) {
    const result = await db.query('SELECT serverId FROM sc_users WHERE username LIKE ?', [user])
    return result[0].serverId !== null;
}

function encode( str ) {
    let buff = new Buffer( str,'ascii');
    return buff.toString('base64');
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
        if ( await hasServerLinked(req.user.username ) ) {
            const serverId = await db.query('SELECT serverId FROM sc_users WHERE username LIKE ?', [req.user.username])
            const server = await db.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [serverId[0].serverId])
            await res.render('profile/profile', {server});
            return;
        }
        await res.render('profile/profile');
    }
)

router.get('/profile/edit', isLoggedIn, async (req, res) => {
        if ( await hasServerLinked(req.user.username ) ) {
            const serverId = await db.query('SELECT serverId FROM sc_users WHERE username LIKE ?', [req.user.username])
            const server = await db.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [serverId[0].serverId])
            await res.render('profile/editProfile', {server});
            return;
        }
        await res.render('profile/editProfile');
    }
)

router.post('/profile/edit', async (req, res, next) => {
    try{
        const saltRounds = 10;
        let passwordRaw = req.body.password;
        let userId = req.user.id;
        if ( passwordRaw === "" ){
            let data = {
                username: req.body.username,
                mail: req.body.email,
            }
            db.query(`UPDATE sc_users SET ? WHERE id = ?`, [data, userId]);
        } else {
            await bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(passwordRaw, salt, function (err, hash) {
                    let data = {
                        username: req.body.username,
                        mail: req.body.email,
                        password: hash
                    }
                    db.query(`UPDATE sc_users SET ? WHERE id = ?`, [data, userId]);
                });
            });
        }

        req.flash('success', `Profile updated successfully`);
    } catch (e) {
        req.flash('error', `Couldn't update your Profile`);
    }
    res.redirect('/profile' );
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success', 'Successfully logged out ')
    res.redirect('/login');
})

module.exports = router;