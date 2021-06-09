const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MysqlStore = require('express-mysql-session')
const {database} = require('./keys');
const validator = require('express-validator');
const passport = require('passport');
const db = require('./database')
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

// Initializations
const app = express();
require('./lib/passport');


// CREATE THE USERS TABLE
async function createUsersDatabase ()  {
    // Create the Staff table

    await db.query(`CREATE TABLE IF NOT EXISTS sc_servers_staff(
        staffId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        role VARCHAR(20) NOT NULL UNIQUE KEY)`
    );
    await db.query(`INSERT IGNORE INTO sc_servers_staff(role) VALUES ('User')`);
    await db.query(`INSERT IGNORE INTO sc_servers_staff(role) VALUES ('Mod')`);
    await db.query(`INSERT IGNORE INTO sc_servers_staff(role) VALUES ('Admin')`);

    // Create the Servers Table
    await db.query(`CREATE TABLE IF NOT EXISTS sc_servers(
        serverId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner VARCHAR(20) NOT NULL UNIQUE KEY,
        server VARCHAR(30) NOT NULL UNIQUE KEY,
        address VARCHAR(30) NOT NULL UNIQUE KEY,
        username VARCHAR(100) NOT NULL,
        db VARCHAR(100) NOT NULL,
        host VARCHAR(100) NOT NULL,
        port VARCHAR(30) NOT NULL,
        password VARCHAR(100),
        staff VARCHAR(200))`
    );

    // Create the Users Table
    await db.query(`CREATE TABLE IF NOT EXISTS sc_users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR (20) NOT NULL UNIQUE KEY,
        mail VARCHAR(40) NOT NULL UNIQUE KEY,
        password VARCHAR(255) NOT NULL,
        serverId INT,
        staffId INT NOT NULL DEFAULT 1,
        FOREIGN KEY fk_staff_id(staffId) REFERENCES sc_servers_staff(staffId),
        FOREIGN KEY fk_server_id(serverId) REFERENCES sc_servers(serverId))`
    );

    await db.query( `CREATE TABLE IF NOT EXISTS sc_servers_settings(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        serverId INT NOT NULL,
        maxBans INT NOT NULL DEFAULT 100,
        maxReports INT NOT NULL DEFAULT 100,
        maxWarns INT NOT NULL DEFAULT 100,
        maxPlayers INT NOT NULL DEFAULT 1000,
        public BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT fk_server_id_settings FOREIGN KEY (serverId) REFERENCES sc_servers(serverId)
    )`);

}
createUsersDatabase()
// Settings
app.set('port', process.env.PORT || 82);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', 'hbs');

// Middlewares
app.use(session({
    secret: 'LKJAHDSLKjhasdkj19090JKAJSD',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());

// Global Variables

function getDate() {
    const dNow = new Date();
    let month = (dNow.getMonth() + 1);
    if (month <= 9) {
        month = "0" + month.toString();
    }
    let day = dNow.getDate();
    if (day <= 9) {
        day = "0" + day.toString();
    }
    let hours = dNow.getHours();
    if (hours <= 9) {
        hours = "0" + hours.toString();
    }
    let minutes = dNow.getMinutes();
    if (minutes <= 9) {
        minutes = "0" + minutes.toString();
    }
    let seconds = dNow.getSeconds();
    if (seconds <= 9) {
        seconds = "0" + seconds.toString();
    }
    return day + '-' + month + '-' + dNow.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds;
}

function convertDate(date) {
    const day = date.substring(8, 10);
    const month = date.substring(5, 7);
    const year = date.substring(0, 4);
    const hour = date.substring(11, 19);
    return day + "-" + month + "-" + year + " " + hour;
}

async function getIp(banned) {
    const rows = await db.query(`SELECT Ips
                                 FROM sc_alts
                                 WHERE Name LIKE '${banned}'`)
    try {
        return rows[0].Ips;
    } catch (error) {}
}

module.exports = {getDate: getDate, convertDate: convertDate, getIp: getIp}
// Routes
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
})
app.use('/config', require('./routes/config'));
app.use( require('./routes'));
app.use( require('./routes/autentication'));
app.use('/bans', require('./routes/bans'));
app.use('/api', require('./routes/api'));
app.use('/reports', require('./routes/reports'));
app.use('/servers', require('./routes/servers'));


// Public
app.use(express.static(path.join(__dirname, 'public')));


const options = {
    key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem'))
};

// Starting The Server
/*
const secure = https.createServer(options, app);

secure.listen(app.get('port'), function() {
    console.log('localhost started on', app.get('port'))
})

 */

app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
});