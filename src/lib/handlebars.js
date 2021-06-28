const {format} = require('timeago.js');

const {servername, version} = require('../keys');

const {config} = require('../keys');

const db = require('../database')

const helpers = {};

helpers.timeago = (timestamp) => {
    const year = timestamp.substring(6, 10);
    const month = timestamp.substring(3, 5);
    const day = timestamp.substring(0, 2);
    const hour = timestamp.substring(11, 19);
    const date = year + "-" + month + "-" + day + " " + hour;
    return format(date);
};
helpers.status = (status) => {
    if (status === "open") {
        return "Open"
    }
    if (status === "closed") {
        return "Expired"
    } else {
        return "Expired"
    }
}
helpers.servername = () => {
    return servername.name;
}

helpers.configured = () => {
    return config.configured;
}

helpers.hasServerLinked = (serverId) => {
    return serverId !== null;
}

helpers.decode = (encodedString) => {
    return Buffer.from(encodedString, 'base64').toString('ascii');
}

helpers.getServerById = async (serverId) => {
    const results = await db.query('SELECT server FROM sc_servers WHERE serverId LIKE ?', [serverId])
    return await results[0].serverId;
}

helpers.toLowerCase = (string) =>{
    return string.toLowerCase();
}

helpers.discord = () => {
    const discord = "https://discord.gg/fZAWztxQbm"
    return discord;
}

helpers.github = () => {
    const github = "https://github.com/BarraR3port"
    return github;
}

helpers.spigot = ()=>{
    const spigot = "https://www.spigotmc.org/resources/staff-core.82324"
    return spigot;
}

helpers.version = () =>{
    return version;
}

module.exports = helpers;
