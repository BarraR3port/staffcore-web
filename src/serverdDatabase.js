const mysql = require('mysql');
const {promisify} = require('util');
async function connectExternalDb(host, user, password, db, type){
    const database = {
        host: host,
        user: user,
        password: password,
        database: db
    }
    mysql.createConnection({multipleStatements: true});
    const pool = mysql.createPool(database);

    pool.getConnection((error, connection) => {
        if (error) {
            console.log('Could not connect to the database due to:' + error);
        }
        if (connection) connection.release();
        console.log('Database connected');
    });

    pool.query = promisify(pool.query);
    module.exports = pool;
}
module.exports = connectExternalDb;


