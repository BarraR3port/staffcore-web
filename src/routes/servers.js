const express = require('express');
const app = require('../app');
const router = express.Router();
const {isLoggedIn, connectExternalDb, isPublic} = require('../lib/auth');
const db = require('../database');

function decode(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}

async function getBans( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-bans');
}
async function getBansLength( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-bans-length');
}
async function getServerName( serverId ){
    const response = await db.query('SELECT server FROM sc_servers WHERE serverId LIKE ?', [serverId]);
    return response[0].server
}
router.get('/', isLoggedIn, async (req, res) => {
    let server = await getServerName(req.user.serverId)
    server = server.toLowerCase();
    res.redirect('/servers/'+server);
})


router.get('/:serv', isLoggedIn, isPublic, async (req, res) => {
    const profile = await db.query('SELECT * FROM sc_users WHERE username LIKE ?',[req.user.username]);
    const database = await db.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId])
    const rawBans = await getBans( database );
    const bansLength = await getBansLength( database );
    const rawServerInfo = await connectExternalDb( decode(database[0].host),decode(database[0].username), decode(database[0].password),decode(database[0].db),decode(database[0].port),'get-server-info');
    const stringServerInfo = JSON.stringify(rawServerInfo[0])
    const serverInfo = JSON.parse(stringServerInfo)

    const stringGlobalInfo = JSON.stringify(profile[0])
    const globalInfo = JSON.parse(stringGlobalInfo)

    const staffRaw = await db.query('SELECT role FROM sc_servers_staff WHERE staffId LIKE ?',[globalInfo.staffId]);
    globalInfo.staff = staffRaw[0].role;

    let bans = [];
    let bansInfo = [];
    for (let i = 0; i < rawBans.length; i++) {
        bans.push(rawBans[i]);
    }
    await console.log(rawBans)
    await console.log(bansLength)
    globalInfo.server = serverInfo.server
    globalInfo.bansLength = bansLength;
    res.render('profile2',{globalInfo,bans,serverInfo});


})



module.exports = router;