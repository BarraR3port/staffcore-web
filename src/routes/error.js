const express = require('express');
const router = express.Router();
const { version } = require('../keys');
'use strict';

router.get('/bad-config', (req, res) => {
    res.render('error/badconfig');
});


module.exports = router;