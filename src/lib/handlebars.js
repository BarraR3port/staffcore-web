const { format } = require('timeago.js');

const helpers = { };

helpers.timeago = (timestamp) =>{
    const year = timestamp.substring(6,10);
    const month = timestamp.substring(3,5);
    const day = timestamp.substring(0,2);
    const hour = timestamp.substring(11,19);
    const date = year + "-" + month + "-" + day + " " + hour;
    return format(date);
};
helpers.status = (status) =>{
    if ( status === "open"){
        return "Open"
    }
    if ( status === "closed"){
        return "Expired"
    }
}


module.exports = helpers;
