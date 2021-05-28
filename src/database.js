const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((error, connection) => {
    if (error){
    }
    if ( connection ) connection.release();
    console.log('Database connected');
});

pool.query = promisify(pool.query);

module.exports = pool;

