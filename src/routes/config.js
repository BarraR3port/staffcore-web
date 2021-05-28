const express = require('express');
const app = require('../app');
const router = express.Router();
const { config } = require('../keys')

const db = require('../database')


router.get('/' ,(req, res) => {
    if ( !config.configured ){
        res.render('config/config');
    } else {
        res.redirect('/')
    }
})

router.post('/' ,(req, res) => {
    console.log(req.body)
    res.redirect('/profile')
   // config.configured = req.body;
})


module.exports = router;