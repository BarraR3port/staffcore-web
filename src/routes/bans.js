const express = require('express');
const app = require('../app');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth')
const db = require('../database')

router.get('/create', isLoggedIn, (req, res) => {
    res.render('bans/create');
})
router.post('/create', isLoggedIn, async (req, res) => {
    const {Name, Baner, Reason, expdate, Ip_Banned} = req.body;
    const date = app.getDate();
    const ExpDate = app.convertDate(expdate);
    const Status = "open";
    await app.getIp(Name).then(Ip => {
        const info = {
            Name,
            Baner,
            Reason,
            date,
            ExpDate,
            Ip,
            Ip_Banned,
            Status
        };
        db.query(`INSERT INTO sc_bans SET ? `, [info]);
        req.flash('success', 'Ban Created Correctly')
        res.redirect('/bans');
    });
})
router.get('/', isLoggedIn, async (res, req) => {
    const bans = await db.query('SELECT * FROM `sc_bans` ORDER BY `BanId`');
    req.render('bans/bans', {bans});
})


router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM sc_bans WHERE BanId = ?', [id]);
    req.flash('success', 'Ban Deleted Correctly')
    res.redirect('/bans')
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const bans = await db.query('SELECT * FROM `sc_bans` WHERE BanId = ?', [id]);
    res.render('bans/edit', {bans: bans[0]})
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const {Name, Baner, Reason, expdate, Ip_Banned} = req.body;
    const ExpDate = app.convertDate(expdate);
    const info = {
        Name,
        Baner,
        Reason,
        ExpDate,
        Ip_Banned
    };
    await db.query(`UPDATE sc_bans SET ? WHERE BanId = ?`, [info, id]);
    req.flash('success', 'Ban Edited Correctly')
    res.redirect('/bans');


})


router.get('/new', isLoggedIn, (req, res) => {
    res.render('bans/bans');
})

module.exports = router;