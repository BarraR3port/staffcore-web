const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MysqlStore = require('express-mysql-session')
const { database, config } = require('./keys');
const { isLoggedIn, isConfigured } = require('./lib/auth')
const passport = require('passport');
const db = require('./database')
const https = require('https');
const fs = require('fs');

// Initializations
const app = express();
require('./lib/passport');


// CREATE THE USERS TABLE
const createUsersDatabase = async () =>{
    await db.query(`CREATE TABLE IF NOT EXISTS users(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE KEY,
        mail VARCHAR(20) NOT NULL UNIQUE KEY,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'User')`
    );
};
createUsersDatabase()
// Settings
app.set('port', process.env.PORT || 443);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', 'hbs');


// Middlewares
app.use(session({
    secret: 'JHAKLJh83ha9hJKHAD7H',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables

function getDate(){
    const dNow = new Date();
    let month = ( dNow.getMonth() + 1);
    if ( month <= 9){
        month = "0"+month.toString();
    }
    let day = dNow.getDate();
    if ( day <= 9){
        day = "0"+day.toString();
    }
    let hours = dNow.getHours();
    if ( hours <= 9){
        hours = "0"+hours.toString();
    }
    let minutes = dNow.getMinutes();
    if ( minutes <= 9){
        minutes = "0"+minutes.toString();
    }
    let seconds = dNow.getSeconds();
    if ( seconds <= 9){
        seconds = "0"+seconds.toString();
    }
    return day + '-' + month + '-' + dNow.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds;
}

function convertDate(date){
    const day = date.substring(8,10);
    const month = date.substring(5,7);
    const year = date.substring(0,4);
    const hour = date.substring(11,19);
    return day + "-" + month + "-" + year + " " + hour;
}
async function getIp( banned ){
    const rows= await db.query(`SELECT Ips FROM sc_alts WHERE Name LIKE '${banned}'`)
    try{
        return rows[0].Ips;
    } catch (error){ }
}
module.exports = {getDate : getDate, convertDate: convertDate, getIp : getIp}
// Routes
app.use('/config', require('./routes/config'));
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/bans', isConfigured, require('./routes/bans'));
app.use('/reports', isConfigured, require('./routes/reports'));
app.use( isConfigured, (req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
})

// Public
app.use(express.static(path.join(__dirname,'public')));


const options = {
    key: fs.readFileSync(path.join(__dirname,'keys','prikey.pem')),
    cert: fs.readFileSync(path.join(__dirname,'keys','pubkey.pem'))
};

app.get('/', function(req, res) {
    res.render('index')
})
// Starting The Server

const secure = https.createServer(options, app);

secure.listen(app.get('port'), function() {
    console.log('localhost started on', app.get('port'))
})

//app.listen( app.get('port'), ()=>console.log('Server running at http://localhost:82/bans'))