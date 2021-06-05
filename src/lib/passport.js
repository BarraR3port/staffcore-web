const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database')
const helpers = require('../lib/helpers');

passport.use('local.register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const {mail} = req.body;
    const newUser = {
        username,
        password,
        mail
    };
    newUser.password = await helpers.encryptPassword(password);
    try {
        const result = await db.query('INSERT INTO sc_users SET ? ', [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser);
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            done(null, false, req.flash('error', 'The user is already registered.'));
        }
    }
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {
    const rows = await db.query('SELECT * FROM sc_users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.comparePassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('error', 'Incorrect password! Please try again.'));
        }
    } else {
        done(null, false, req.flash('error', `The Username doesn't exist`));
    }

}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    await db.query('SELECT * FROM sc_users WHERE id = ?', [id], (err, rows) => {
        if (err !== null) {
            done(null, rows[0]);
        } else {
            done(err, rows[0]);
        }
    });
});









