const express = require('express');
const router = express.Router();
const { database, config } = require('../keys');
const { isConfigured } = require('../lib/auth')
router.get('/', isConfigured ,(req,res) =>{
    res.render('index')
})


module.exports = router;