const express = require('express');
const router = express.Router();
const { database, config } = require('../keys');

router.get('/', (req,res) =>{
    res.render('index')
})


module.exports = router;