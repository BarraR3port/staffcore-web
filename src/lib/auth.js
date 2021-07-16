const mysql = require('mysql');
const {promisify} = require('util');
const datab = require('../database')

async function isAdmin(username) {
    const admins = await datab.query('SELECT * FROM sc_web_admins WHERE username LIKE ?', [username])
    return admins.length > 0 ;
}
async function getServerId(server){
    const serversRaw = await datab.query('SELECT serverId FROM sc_servers WHERE server LIKE ?', [server]);
    return serversRaw[0].serverId;
}

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', `You must be logged in`);
        return res.redirect('/login');
    },
    async connectExternalDb(host, user, password, db, port, type) {
        const database = {
            host: host,
            user: user,
            password: password,
            database: db,
            port: port
        }
        mysql.createConnection({multipleStatements: true});
        const pool = mysql.createPool(database);
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
                return "error";
            }

            if (connection) connection.release();
        });

        pool.query = promisify(pool.query);
        try {
            switch (type) {

                /* --------------= BANS =-------------- */

                case 'get-bans':
                    const bans = await pool.query('SELECT * FROM sc_bans');
                    pool.end();
                    return bans;
                case 'get-bans-length':
                    const lengthBans = await pool.query('SELECT * FROM sc_bans');
                    pool.end();
                    return await lengthBans.length;
                case 'get-open-bans':
                    const openBans = await pool.query(`SELECT *
                                                       FROM sc_bans
                                                       WHERE Status LIKE 'open'`);
                    pool.end();
                    return await openBans.length;
                case 'get-closed-bans':
                    const closedBans = await pool.query(`SELECT *
                                                         FROM sc_bans
                                                         WHERE Status LIKE 'closed'`);
                    pool.end();
                    return await closedBans.length;

                /* --------------= REPORTS =-------------- */

                case 'get-reports':
                    const reports = await pool.query('SELECT * FROM sc_reports');
                    pool.end();
                    return reports;
                case 'get-reports-length':
                    const lengthReports = await pool.query('SELECT * FROM sc_reports');
                    pool.end();
                    return await lengthReports.length;
                case 'get-open-reports':
                    const openReports = await pool.query(`SELECT *
                                                          FROM sc_reports
                                                          WHERE Status LIKE 'open'`);
                    pool.end();
                    return await openReports.length;
                case 'get-closed-reports':
                    const closedReports = await pool.query(`SELECT *
                                                            FROM sc_reports
                                                            WHERE Status LIKE 'closed'`);
                    pool.end();
                    return await closedReports.length;

                /* --------------= WARNS =-------------- */

                case 'get-warns':
                    const warns = await pool.query('SELECT * FROM sc_warns');
                    pool.end();
                    return warns;
                case 'get-warns-length':
                    const lengthWarns = await pool.query('SELECT * FROM sc_warns');
                    pool.end();
                    return await lengthWarns.length;
                case 'get-open-warns':
                    const openWarns = await pool.query(`SELECT * FROM sc_warns WHERE Status LIKE 'open'`);
                    pool.end();
                    return await openWarns.length;
                case 'get-closed-warns':
                    const closedWarns = await pool.query(`SELECT * FROM sc_warns WHERE Status LIKE 'closed'`);
                    pool.end();
                    return await closedWarns.length;

                /* --------------= SERVER =-------------- */

                case 'get-server-info':
                    const servers = await datab.query('SELECT * FROM sc_servers');
                    pool.end();
                    return servers;
                case 'get-server-staff':
                    const staff = await datab.query('SELECT * FROM sc_servers_staff');
                    pool.end();
                    return staff;
                case 'get-players':
                    const players = await pool.query('SELECT Name FROM sc_alts ');
                    pool.end();
                    return players;
                case 'get-players-length':
                    const playersLength = await pool.query('SELECT Name FROM sc_alts ');
                    pool.end();
                    return await playersLength.length;
                default:
                    const def = await pool.query('SELECT * FROM sc_bans');
                    pool.end();
                    return def;
            }
        } catch (e) {
            return e;
        }

    },
    async isPublic(req, res, next) {
        if (await isAdmin( req.user.username ) ) {
            return next();
        }
        const server = req.params.server
        const username = req.user.username
        const serverId = req.user.serverId
        try {
            const result = await datab.query('SELECT isPublic FROM sc_servers_settings WHERE serverId LIKE ?', [serverId]);
            if (await result[0].isPublic) {
                return next();
            } else {
                const response = await datab.query('SELECT staff FROM sc_servers WHERE owner LIKE ? AND server LIKE ?', [username, server]);
                if (response.length > 0) {
                    const staff = response[0].staff.toString().split(',');
                    if (staff.contains('username')) {
                        return next();
                    } else {
                        req.flash('error', `You are not allowed to see the details of this server`);
                        return res.redirect('/');
                    }
                } else {
                    req.flash('error', `You are not part of the staff of this server`);
                    return res.redirect('/');
                }
            }
        } catch (e) {
            req.flash('error', `Contact with the dev, you don't have a ServerId`);
            return res.redirect('/');
        }

    },
    async isStaff(req, res, next) {
        if (await isAdmin( req.user.username ) ) {
            return next();
        }
        const server = req.params.server
        const username = req.user.username
        let serverId = getServerId( server);
        const result = await datab.query('SELECT isPublic FROM sc_servers_settings WHERE serverId LIKE ?', [serverId]);
        if (await result[0].isPublic) {
            return next();
        } else {
            const response = await datab.query('SELECT staff FROM sc_servers WHERE serverId LIKE ?', [serverId]);
            if (response.length > 0) {
                const staff = response[0].staff.toString().split(',');
                if (staff.includes(username)) {
                    const staffId = await datab.query('SELECT staffId FROM sc_users WHERE username LIKE ?', [username]);
                    if ( staffId[0].staffId === 1 || staffId[0].staffId === 2 ){
                        req.flash('error', `You are not allowed to edit the configuration of this server`);
                        return res.redirect('/');
                    } else if ( staffId[0].staffId === 3 ){
                        return next();
                    }else {
                        console.log("test");
                    }
                } else {
                    req.flash('error', `You are not allowed to see the details of this server`);
                    return res.redirect('/');
                }
            } else {
                req.flash('error', `You are not part of the staff of this server`);
                return res.redirect('/');
            }
        }

    },
    async getDataFromExtDb(host, user, password, db, port, type , id) {
        const database = {
            host: host,
            user: user,
            password: password,
            database: db,
            port: port
        }
        mysql.createConnection({multipleStatements: true});
        const pool = mysql.createPool(database);
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
                return "error";
            }

            if (connection) connection.release();
        });

        pool.query = promisify(pool.query);
        switch (type) {

            /* --------------= BANS =-------------- */

            case 'get-bans':
                const bans = await pool.query('SELECT * FROM sc_bans WHERE BanId = ?', [id]);
                pool.end();
                return bans;
            case 'delete-ban':
                await pool.query('DELETE FROM sc_bans WHERE BanId = ?', [id]);
                pool.end();
                return true;
            case 'edit-ban':
                await pool.query('UPDATE sc_bans SET ? WHERE BanId = ?', [id[0],id[1]]);
                pool.end();
                return true;
            case 'create-ban':
                await pool.query('INSERT INTO sc_bans SET ? ', [id[0]]);
                pool.end();
                return true;
            /* --------------= REPORTS =-------------- */

            case 'get-reports':
                const reports = await pool.query('SELECT * FROM sc_reports WHERE ReportId = ?', [id]);
                pool.end();
                return reports;
            case 'delete-report':
                await pool.query('DELETE FROM sc_reports WHERE ReportId = ?', [id]);
                pool.end();
                return true;
            case 'edit-report':
                await pool.query('UPDATE sc_reports SET ? WHERE ReportId = ?', [id[0],id[1]]);
                pool.end();
                return true;
            case 'create-report':
                await pool.query('INSERT INTO sc_reports SET ? ', [id[0]]);
                pool.end();
                return true;
            /* --------------= WARNS =-------------- */

            case 'get-warn':
                const warns = await pool.query('SELECT * FROM sc_warns WHERE WarnId = ?', [id]);
                pool.end();
                return warns;
            case 'delete-warn':
                await pool.query('DELETE FROM sc_warns WHERE WarnId = ?', [id]);
                pool.end();
                return true;
            case 'edit-warn':
                await pool.query('UPDATE sc_warns SET ? WHERE WarnId = ?', [id[0],id[1]]);
                pool.end();
                return true;
            case 'create-warn':
                await pool.query('INSERT INTO sc_warns SET ? ', [id[0]]);
                pool.end();
                return true;
        }
    }

}