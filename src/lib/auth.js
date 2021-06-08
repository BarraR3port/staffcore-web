const {config} = require('../keys')
const mysql = require('mysql');
const {promisify} = require('util');

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
    isServerLinked(req, res, next) {
        return next();
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
            if (error) throw error;
            if (connection) connection.release();
            console.log('Database connected');
        });

        pool.query = promisify(pool.query);
        switch (type){
            case 'get-bans': return pool.query('SELECT * FROM sc_bans');
            case 'get-bans-count':
                let i;
                const result = await pool.query('SELECT * FROM sc_bans');
                return result.length;
        }

        if (type === 'get-bans'){
            return pool.query('SELECT * FROM sc_bans');
        }

    }

}