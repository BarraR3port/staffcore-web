const mysql = require('mysql');
const {promisify} = require('util');
const db = require('../database')

async function isAdmin( userId ){
    //TODO CREATE THE ADMIN STUFF

    return true;
}

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', `You must be logged in`);
        return res.redirect('/login');
    },
    async connectExternalDb(host, user, password, db, port, type){
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
                throw error;
            }
            if (connection) connection.release();
        });

        pool.query = promisify(pool.query);
        switch (type){
            case 'get-bans': return pool.query('SELECT * FROM sc_bans');
            case 'get-bans-length':
                const lengthBans = await pool.query('SELECT * FROM sc_bans');
                return await lengthBans.length;
            case 'get-open-bans':
                const openBans = await pool.query(`SELECT * FROM sc_bans WHERE Status LIKE 'open'`);
                return await openBans.length;
            case 'get-closed-bans':
                const  closedBans = await pool.query(`SELECT * FROM sc_bans WHERE Status LIKE 'closed'`);
                return await closedBans.length;
            case 'get-reports': return pool.query('SELECT * FROM sc_reports');
            case 'get-reports-length':
                const lengthReports = await pool.query('SELECT * FROM sc_reports');
                return await lengthReports.length;
            case 'get-open-reports':
                const openReports = await pool.query(`SELECT * FROM sc_reports WHERE Status LIKE 'open'`);
                return await openReports.length;
            case 'get-closed-reports':
                const closedReports = await pool.query(`SELECT * FROM sc_reports WHERE Status LIKE 'closed'`);
                return await closedReports.length;
            case 'get-server-info': return pool.query('SELECT * FROM sc_servers');
            case 'get-server-staff': return pool.query('SELECT * FROM sc_servers_staff');
            default: return pool.query('SELECT * FROM sc_bans');
        }

    },
    async isPublic(req, res, next) {
        if (await isAdmin( 123 ) ){
            return next();
        }
        const serverId = req.user.serverId
        const result = await db.query('SELECT isPublic FROM sc_servers_settings WHERE serverId LIKE ?',[serverId])
        if (await result[0].isPublic){
            return next();
        }
        req.flash('error', `You are not allowed to see the details of this server`);
        return res.redirect('/');

    },
    async isStaff(req,res,next){
        const server = req.params.serv
        const username = req.user.username
        const response = await db.query('SELECT staff FROM sc_servers WHERE owner LIKE ? AND server LIKE ?',[username,server])
        if (response.length > 0){
            const staff = response[0].staff.toString().split(',');
            for (let i = 0; i < staff.length;i++){
                console.log(staff[i])
            }
            return next();
        } else {
            req.flash('error', `You are not part of the staff of this server`);
            return res.redirect('/');
        }
    }

}