const express = require('express');
const app = require('../app');
const router = express.Router();
const {isLoggedIn, connectExternalDb} = require('../lib/auth');
const db = require('../database');

function decode(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}


router.get('/', isLoggedIn, async (req, res) => {

    const profile = await db.query('SELECT * FROM sc_users WHERE username LIKE ?',[req.user.username]);
    const database = await db.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId])
    const externalDatabase = await connectExternalDb( decode(database[0].host),decode(database[0].username), decode(database[0].password),decode(database[0].db),decode(database[0].port),'get-bans-count');
    console.log(profile)
    console.log(externalDatabase)
    const response = {
        profile,
        externalDatabase
    }
    res.render('profile2',{response});
})



module.exports = router;