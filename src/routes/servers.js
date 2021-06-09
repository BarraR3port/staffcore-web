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
    const rawBans = await connectExternalDb( decode(database[0].host),decode(database[0].username), decode(database[0].password),decode(database[0].db),decode(database[0].port),'get-bans');
    const rawServerInfo = await connectExternalDb( decode(database[0].host),decode(database[0].username), decode(database[0].password),decode(database[0].db),decode(database[0].port),'get-server-info');

    //console.log(database)
    //console.log(externalDatabase)
    let bans = [];
    let bansInfo = [];
    for (let i = 0; i < rawBans.length; i++) {
        bans.push(rawBans[i]);
    }
    const stringServerInfo = JSON.stringify(rawServerInfo[0])
    const jsonServerInfo = JSON.parse(stringServerInfo)

    const stringGlobalInfo = JSON.stringify(profile[0])
    const globalInfo = JSON.parse(stringGlobalInfo)
    globalInfo.server = jsonServerInfo.server

    console.log(globalInfo)
    res.render('profile2',{globalInfo,bans,bansInfo});
})



module.exports = router;