const express = require('express');
const router = express.Router();
const { version } = require('../keys');
const datab = require('../database')
'use strict';

router.get('/', async (req, res) => {
    const stats = await datab.query('SELECT COUNT(ServerName) AS Server, SUM(DISTINCT Bans) AS Bans, SUM(DISTINCT Reports) AS Reports, SUM(DISTINCT Warns) AS Warns, SUM(DISTINCT Wipes) AS Wipes, SUM(DISTINCT Players) AS Players, SUM(DISTINCT Mutes) AS Mutes, SUM(DISTINCT Frozen) AS Frozen, SUM(DISTINCT Staff) AS Staff, SUM(DISTINCT Vanish) AS Vanish FROM sc_web_stats;')
    res.render('stats/stats', {stats});
});


module.exports = router;