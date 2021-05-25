const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
// Initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 82);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', 'hbs');

const db = require('./database')

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Global Variables
app.use((req,res,next) => {
    next();
})

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
    try{ return rows[0].Ips; } catch (error){ }
}
module.exports = {getDate : getDate, convertDate: convertDate, getIp : getIp}
// Routes
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/bans', require('./routes/bans'));

// Public
app.use(express.static(path.join(__dirname,'public')));





// Starting The Server
app.listen( app.get('port'), ()=>console.log('Server running at http://localhost:82/bans'))