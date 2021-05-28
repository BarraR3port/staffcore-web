const express = require('express');
const router = express.Router();
const { database, config } = require('../keys');

router.get('/', (req,res) =>{
    res.json({
        configured: config.configured,
        message: 'this is served in https'
    })
    res.render('index')
})


module.exports = router;