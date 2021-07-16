const express = require('express');
const router = express.Router();
const { version } = require('../keys');
'use strict';

router.get('/alts-migration', (req, res) => {
    res.render('news/alts-migration');
});


module.exports = router;