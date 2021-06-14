const express = require('express');
const app = require('../app');
const router = express.Router();
const {isLoggedIn, connectExternalDb, isPublic, getDataFromExtDb, isStaff } = require('../lib/auth');
const datab = require('../database');

function decode(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}

/* --------------= BANS =-------------- */

async function getBans(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-bans');
}

async function getBansLength(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-bans-length');
}

async function getOpenBans(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-open-bans');
}

async function getClosedBans(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-closed-bans');
}

async function deleteBan(database, id) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'delete-ban', id);
}

async function editBan(database, values) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'edit-ban', values);
}

async function getBansById(database,id) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-bans', id);
}

async function createBan(database, values) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'create-ban', values);
}

/* --------------= REPORTS =-------------- */

async function getReports(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-reports');
}

async function getReportsLength(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-reports-length');
}

async function getOpenReports(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-open-reports');
}

async function getClosedReports(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-closed-reports');
}

async function deleteReport(database, id) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'delete-report', id);
}

async function editReport(database, values) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'edit-report', values);
}

async function getReportsById(database,id) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-reports', id);
}

async function createReport(database, values) {
    return await getDataFromExtDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'create-report', values);
}

/* --------------= WARNS =-------------- */

async function getWarns(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-warns');
}

async function getWarnsLength(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-warns-length');
}

async function getOpenWarns(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-open-warns');
}

async function getClosedWarns(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-closed-warns');
}

/* --------------= SERVER =-------------- */

async function getServerName(serverId) {
    const response = await datab.query('SELECT server FROM sc_servers WHERE serverId LIKE ?', [serverId]);
    return response[0].server
}

async function getServerInfo(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-server-info');
}

async function getPlayers(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-players');
}

async function getPlayersLength(database) {
    return await connectExternalDb(decode(database[0].host), decode(database[0].username), decode(database[0].password), decode(database[0].db), decode(database[0].port), 'get-players-length');
}

function encode( str ) {
    let buff = new Buffer( str,'ascii');
    return buff.toString('base64');
}

async function getServers(){
    const servers = [];
    const serversRaw = await datab.query('SELECT server FROM sc_servers');
    for (let i = 0; i < serversRaw.length; i ++){
        servers.push(serversRaw[i].server.toLowerCase());
    }
    return servers;
}

async function getServerId(server){
    const serversRaw = await datab.query('SELECT serverId FROM sc_servers WHERE server LIKE ?', [server]);
    return serversRaw[0].serverId;
}

router.get('/', isLoggedIn, async (req, res) => {
    let server = await getServerName(req.user.serverId)
    server = server.toLowerCase();
    res.redirect('/servers/' + server);
})


router.get('/:server', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server) ){
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId])
        const rawServerSettings = await datab.query('SELECT * FROM sc_servers_settings WHERE serverId LIKE ?', [profile[0].serverId])

        const rawServerInfo = await getServerInfo(database);

        /* --------------= BANS =-------------- */

        //const rawBans = await getBans( database );
        const bansLength = await getBansLength(database);
        const rawOpenBansLength = await getOpenBans(database);
        const rawClosedBansLength = await getClosedBans(database);

        /* --------------= REPORTS =-------------- */

        //const rawReports = await getReports( database );
        const reportsLength = await getReportsLength(database);
        const rawOpenReportsLength = await getOpenReports(database);
        const rawClosedReportsLength = await getClosedReports(database);

        /* --------------= WARNS =-------------- */

        const warnsLength = await getWarnsLength(database);
        const rawOpenWarnsLength = await getOpenWarns(database);
        const rawClosedWarnsLength = await getClosedWarns(database);


        const stringServerInfo = JSON.stringify(rawServerInfo[0])
        const serverInfo = JSON.parse(stringServerInfo)

        const stringGlobalInfo = JSON.stringify(profile[0])
        const globalInfo = JSON.parse(stringGlobalInfo)

        const stringServerSettings = JSON.stringify(rawServerSettings[0])
        const serverSettings = JSON.parse(stringServerSettings)

        const staffRaw = await datab.query('SELECT role FROM sc_servers_staff WHERE staffId LIKE ?', [globalInfo.staffId]);
        globalInfo.staff = staffRaw[0].role;
        globalInfo.server = serverInfo.server

        /* --------------= BANS =-------------- */

        globalInfo.bansLength = bansLength;
        if (globalInfo.bansLength !== 0) {
            globalInfo.bansLengthPercentage = ( (bansLength / serverSettings.maxBans) * 100)| 0;
        } else {
            globalInfo.bansLengthPercentage = 0;
        }

        globalInfo.openBansLength = rawOpenBansLength;
        if (globalInfo.openBansLength !== 0) {
            globalInfo.openBansLengthPercentage = ( (rawOpenBansLength / bansLength) * 100)| 0;
        } else {
            globalInfo.openBansLengthPercentage = 0;
        }

        globalInfo.closedBansLength = rawClosedBansLength;
        if (globalInfo.closedBansLength !== 0) {
            globalInfo.closedBansLengthPercentage = ( (rawClosedBansLength / bansLength) * 100)| 0;
        } else {
            globalInfo.closedBansLengthPercentage = 0;
        }

        /* --------------= REPORTS =-------------- */

        globalInfo.reportsLength = reportsLength;
        if (globalInfo.reportsLength !== 0) {
            globalInfo.reportsLengthPercentage = ( (reportsLength / serverSettings.maxReports) * 100)| 0;
        } else {
            globalInfo.reportsLengthPercentage = 0;
        }

        globalInfo.openReportsLength = rawOpenReportsLength;
        if (globalInfo.openReportsLength !== 0) {
            globalInfo.openReportsLengthPercentage = ( (rawOpenReportsLength / reportsLength) * 100 )| 0;
        } else {
            globalInfo.openReportsLengthPercentage = 0;
        }

        globalInfo.closedReportsLength = rawClosedReportsLength;
        if (globalInfo.closedReportsLength !== 0) {
            globalInfo.closedReportsLengthPercentage = ( (rawClosedReportsLength / reportsLength) * 100 )| 0;
        } else {
            globalInfo.closedReportsLengthPercentage = 0;
        }

        /* --------------= WARNS =-------------- */

        globalInfo.warnsLength = warnsLength;
        if (globalInfo.warnsLength !== 0) {
            globalInfo.warnsLengthPercentage = ( (warnsLength / serverSettings.maxWarns) * 100 )| 0;
        } else {
            globalInfo.warnsLengthPercentage = 0;
        }

        globalInfo.openWarnsLength = rawOpenWarnsLength;
        if (globalInfo.openWarnsLength !== 0) {
            globalInfo.openWarnsLengthPercentage = ( (rawOpenWarnsLength / warnsLength) * 100 )| 0;
        } else {
            globalInfo.openWarnsLengthPercentage = 0;
        }

        globalInfo.closedWarnsLength = rawClosedWarnsLength;
        if (globalInfo.closedWarnsLength !== 0) {
            globalInfo.closedWarnsLengthPercentage = ( (rawClosedWarnsLength / warnsLength) * 100 )| 0;
        } else {
            globalInfo.closedWarnsLengthPercentage = 0;
        }

        /* --------------= SERVER =-------------- */
        //globalInfo.players = await getPlayers(database);
        globalInfo.playersLength = await getPlayersLength(database);


        res.render('servers/server', {globalInfo, serverInfo, serverSettings});
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})


router.get('/:server/settings', isLoggedIn, isPublic, isStaff, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server) ){
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId])
        const rawServerSettings = await datab.query('SELECT * FROM sc_servers_settings WHERE serverId LIKE ?', [profile[0].serverId])

        const rawServerInfo = await getServerInfo(database);

        const stringServerInfo = JSON.stringify(rawServerInfo[0])
        const serverInfo = JSON.parse(stringServerInfo)

        const stringGlobalInfo = JSON.stringify(profile[0])
        const globalInfo = JSON.parse(stringGlobalInfo)

        const stringServerSettings = JSON.stringify(rawServerSettings[0])
        const serverSettings = JSON.parse(stringServerSettings)

        const staffRaw = await datab.query('SELECT role FROM sc_servers_staff WHERE staffId LIKE ?', [globalInfo.staffId]);
        globalInfo.staff = staffRaw[0].role;
        globalInfo.server = serverInfo.server
        serverSettings.isPublic = !!serverSettings.isPublic;
        res.render('servers/settings', {globalInfo, serverInfo, serverSettings});
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})

router.post('/:server/settings', isLoggedIn, isPublic, isStaff, async (req, res) => {
    const servers = await getServers();
    const serverRaw = req.params.server.toLowerCase( );
    if ( await servers.includes( serverRaw ) === true ){
        let {owner, server, staff, maxBans, maxReports, maxWarns, maxPlayers, isPublic} = req.body;
        let address = encode(req.body.address);
        let username = encode(req.body.username);
        let db = encode(req.body.db);
        let host = encode(req.body.host);
        let port = encode(req.body.port);
        let password = encode(req.body.password);
        const serverId = await getServerId(server);
        const saveServer = {
            owner,
            server,
            address,
            username,
            db,
            host,
            port,
            password,
            staff
        }
        const saveServerSettingsExport = {
            maxBans,
            maxReports,
            maxWarns,
            maxPlayers,
            isPublic
        }
        console.log(saveServer);
        console.log(saveServerSettingsExport);
        datab.query(`UPDATE sc_servers SET ? WHERE serverId = ? `, [saveServer, serverId]);
        datab.query(`UPDATE sc_servers_settings SET ? WHERE serverId = ? `, [saveServerSettingsExport, serverId]);
        res.redirect('/servers/' + serverRaw );
    }  else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})

/* --------------= BANS =-------------- */

router.get('/:server/bans', isLoggedIn, isPublic, async (req, res, next) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId])
        const bans = await getBans(database);
        const server = req.params.server;
        for (let i = 0; i< bans.length; i ++){
            bans[i].server = req.params.server.toLowerCase( );
        }
        res.render('bans/bans', {bans,server});
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})

router.get('/:server/bans/delete/:id', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const id = req.params.id;
        const server = req.params.server;
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
        if ( await deleteBan(database,id) ){
            req.flash('success', 'Ban Deleted Correctly')
            res.redirect('/servers/'+server+'/bans')
        } else {
            req.flash('error', `Ban couldn't be Deleted Correctly`)
            res.redirect('/servers/'+server+'/bans/')
        }
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
});

router.get('/:server/bans/edit/:id', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const id = req.params.id;
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
        const bans = await getBansById(database, id);
        bans[0].server = req.params.server.toLowerCase( );
        res.render('bans/edit', {bans: bans[0]})
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
});

router.post('/:server/bans/edit/:id', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const server = req.params.server;
        try {
            const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
            const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
            const id = req.params.id;
            const {Name, Baner, Reason, expdate, Ip_Banned} = req.body;
            const ExpDate = app.convertDate(expdate);
            const info = {
                Name,
                Baner,
                Reason,
                ExpDate,
                Ip_Banned
            };
            const values = [info,id];
            await editBan(database,values)
            req.flash('success', 'Ban Edited Correctly')
            res.redirect('/servers/'+server+'/bans');

        } catch (error){
            req.flash('error', `Ban couldn't be Edited Correctly`)
            res.redirect('/servers/'+server+'/bans/')

        }
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }

})
router.get('/:server/bans/create', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    const server = req.params.server;
    const username = req.user.username;
    if (servers.includes(req.params.server.toLowerCase())) {
        res.render('bans/create', {server, username});
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})

router.post('/:server/bans/create', isLoggedIn, isPublic, async (req, res) => {
    const server = req.params.server;
    const servers = await getServers();
    if (servers.includes(req.params.server.toLowerCase())) {
        try {
            const {Name, Baner, Reason, expdate, Ip_Banned} = req.body;
            const date = app.getDate();
            const ExpDate = app.convertDate(expdate);
            const Status = "open";
            await app.getIp(Name).then(async Ip => {
                const info = {
                    Name,
                    Baner,
                    Reason,
                    date,
                    ExpDate,
                    Ip,
                    Ip_Banned,
                    Status
                };
                const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
                const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
                const values = [info];
                await createBan(database, values)
                req.flash('success', 'Ban Created Correctly')
                res.redirect('/servers/' + server + '/bans');
            });
        } catch (e) {
            req.flash('error', 'Could not create the Report')
            res.redirect('/servers/' + server +'/bans/create');
        }
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})

/* --------------= REPORTS =-------------- */

router.get('/:server/reports', isLoggedIn, isPublic, async (req, res, next) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId])
        const reports = await getReports(database);
        for (let i = 0; i< reports.length; i ++){
            reports[i].server = req.params.server.toLowerCase( );
        }
        res.render('reports/reports', {reports});
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})

router.get('/:server/reports/delete/:id', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const id = req.params.id;
        const server = req.params.server;
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
        if ( await deleteReport(database,id) ){
            req.flash('success', 'Report Deleted Correctly')
            res.redirect('/servers/'+server+'/reports')
        } else {
            req.flash('error', `Report couldn't be Deleted Correctly`)
            res.redirect('/servers/'+server+'/reports/')
        }
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
});

router.get('/:server/reports/edit/:id', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const id = req.params.id;
        const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
        const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
        const reports = await getReportsById(database, id);
        reports[0].server = req.params.server.toLowerCase( );
        res.render('reports/edit', {reports: reports[0]})
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
});

router.post('/:server/reports/edit/:id', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if ( servers.includes(req.params.server.toLowerCase( ) ) ){
        const server = req.params.server;
        try {
            const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
            const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
            const id = req.params.id;
            const {Name, Reporter, Reason} = req.body;
            const info = {
                Name,
                Reporter,
                Reason
            };
            const values = [info,id];
            await editReport(database,values)
            req.flash('success', 'Report Edited Correctly')
            res.redirect('/servers/'+server+'/reports');

        } catch (error){
            req.flash('error', `Report couldn't be Edited Correctly`)
            res.redirect('/servers/'+server+'/reports')

        }
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }

})

router.get('/:server/reports/create', isLoggedIn, isPublic, async (req, res) => {
    const servers = await getServers();
    if (servers.includes(req.params.server.toLowerCase())) {
        res.render('reports/create');
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})
router.post('/:server/reports/create', isLoggedIn, isPublic, async (req, res) => {
    const server = req.params.server;
    const servers = await getServers();
    if (servers.includes(req.params.server.toLowerCase())) {
        try {
            const {Name, Reporter, Reason} = req.body;
            const date = app.getDate();
            const Status = "open";
            await app.getIp(Name).then(async Ip => {
                const info = {
                    Name,
                    Reporter,
                    Reason,
                    date,
                    Status
                };
                const profile = await datab.query('SELECT * FROM sc_users WHERE username LIKE ?', [req.user.username]);
                const database = await datab.query('SELECT * FROM sc_servers WHERE serverId LIKE ?', [profile[0].serverId]);
                const values = [info];
                await createReport(database, values)
                req.flash('success', 'Report Created Correctly')
                res.redirect('/servers/' + server + '/reports');
            });
        } catch (e) {
            req.flash('error', 'Could not create the Report')
            res.redirect('/servers/' + server +'/reports/create');
        }
    } else {
        req.flash('error', `This server is not registered`);
        return res.redirect('/');
    }
})

module.exports = router;