const express = require('express');
const app = require('../app');
const router = express.Router();
const {isLoggedIn, connectExternalDb, isPublic, isAdmin} = require('../lib/auth');
const db = require('../database');

function decode(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}
/* --------------= BANS =-------------- */
async function getBans( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-bans');
}

async function getBansLength( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-bans-length');
}

async function getOpenBans( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-open-bans');
}

async function getClosedBans( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-closed-bans');
}

/* --------------= REPORTS =-------------- */
async function getReports( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-reports');
}

async function getReportsLength( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-reports-length');
}

async function getOpenReports( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-open-reports');
}

async function getClosedReports( database ){
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-closed-reports');
}


async function getServerName( serverId ){
    const response = await db.query('SELECT server FROM sc_servers WHERE serverId LIKE ?', [serverId]);
    return response[0].server
}

async function getServerInfo( database ){
    return await connectExternalDb(decode(database[0].host),decode(database[0].username), decode(database[0].password),decode(database[0].db),decode(database[0].port),'get-server-info');
}



router.get('/', isLoggedIn, async (req, res) => {
    let server = await getServerName(req.user.serverId)
    server = server.toLowerCase();
    res.redirect('/servers/'+server);
})


router.get('/:serv', isLoggedIn, isPublic, async (req, res) => {
    const profile = await db.query('SELECT * FROM sc_users WHERE username LIKE ?',[req.user.username]);
    const database = await db.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId])
    const rawServerSettings = await db.query('SELECT * FROM sc_servers_settings WHERE serverId LIKE ?', [profile[0].serverId])

    const rawServerInfo = await getServerInfo( database );

    /* --------------= BANS =-------------- */

    //const rawBans = await getBans( database );
    const bansLength = await getBansLength( database );
    const rawOpenBansLength  = await getOpenBans( database );
    const rawClosedBansLength  = await getClosedBans( database );

    /* --------------= REPORTS =-------------- */

    //const rawReports = await getReports( database );
    const reportsLength = await getReportsLength( database );
    const rawOpenReportsLength  = await getOpenReports( database );
    const rawClosedReportsLength  = await getClosedReports( database );


    const stringServerInfo = JSON.stringify(rawServerInfo[0])
    const serverInfo = JSON.parse(stringServerInfo)

    const stringGlobalInfo = JSON.stringify(profile[0])
    const globalInfo = JSON.parse(stringGlobalInfo)

    const stringServerSettings = JSON.stringify(rawServerSettings[0])
    const serverSettings = JSON.parse(stringServerSettings)

    const staffRaw = await db.query('SELECT role FROM sc_servers_staff WHERE staffId LIKE ?',[globalInfo.staffId]);
    globalInfo.staff = staffRaw[0].role;
    globalInfo.server = serverInfo.server


    /* --------------= BANS =-------------- */

    globalInfo.bansLength = bansLength;
    if (globalInfo.bansLength !== 0){
        globalInfo.bansLengthPercentage = (bansLength/serverSettings.maxBans)*100;
    } else {
        globalInfo.bansLengthPercentage = 0;
    }

    globalInfo.openBansLength = rawOpenBansLength;
    if (globalInfo.openBansLength !== 0){
        globalInfo.openBansLengthPercentage = (rawOpenBansLength/bansLength)*100;
    } else {
        globalInfo.openBansLengthPercentage = 0;
    }

    globalInfo.closedBansLength = rawClosedBansLength;
    if (globalInfo.closedBansLength !== 0){
        globalInfo.closedBansLengthPercentage = (rawClosedBansLength/bansLength)*100;
    } else {
        globalInfo.closedBansLengthPercentage = 0;
    }

    /* --------------= REPORTS =-------------- */


    globalInfo.reportsLength = reportsLength;
    if (globalInfo.reportsLength !== 0){
        globalInfo.reportsLengthPercentage = (reportsLength/serverSettings.maxReports)*100;
    } else {
        globalInfo.reportsLengthPercentage = 0;
    }

    globalInfo.openReportsLength = rawOpenReportsLength;
    if (globalInfo.openReportsLength !== 0){
        globalInfo.openReportsLengthPercentage = (rawOpenReportsLength/reportsLength)*100;
    } else {
        globalInfo.openReportsLengthPercentage = 0;
    }


    globalInfo.closedReportsLength = rawClosedReportsLength;
    if (globalInfo.closedReportsLength !== 0){
        globalInfo.closedReportsLengthPercentage = (rawClosedReportsLength/reportsLength)*100;
    } else {
        globalInfo.closedReportsLengthPercentage = 0;
    }
    console.log(globalInfo.closedReportsLengthPercentage)

    res.render('servers/server',{globalInfo,serverInfo,serverSettings});


})



module.exports = router;