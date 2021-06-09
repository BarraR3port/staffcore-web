const mysql = require('mysql');
const {promisify} = require('util');
const db = require('../database')

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', `You must be logged in`);
        return res.redirect('/login');
    },
    isConfigured(req, res, next) {
        if (config.configured) {
            return next();
        }
        return res.redirect('/config');
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
            console.log('Database connected');
        });

        pool.query = promisify(pool.query);
        switch (type){
            case 'get-bans': return pool.query('SELECT * FROM sc_bans');
            case 'get-bans-length':
                const result = await pool.query('SELECT * FROM sc_bans');
                return result.length;
            case 'get-server-info': return pool.query('SELECT * FROM sc_servers');
            case 'get-server-staff': return pool.query('SELECT * FROM sc_servers_staff');
            default: return pool.query('SELECT * FROM sc_bans');
        }

    },
    isPublic(req, res, next) {
        const serverId = req.user.serverId;
        const result = db.query('SELECT public FROM sc_servers_settings WHERE serverId LIKE ?',[serverId])
        if (result[0].public){
            return next();
        }
        req.flash('error', `You are not allowed to see the details of this server`);
        return res.redirect('/');

    }

}