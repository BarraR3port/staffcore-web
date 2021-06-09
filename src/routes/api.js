const express = require('express');
const router = express.Router();
const got = require('got');
const {database, config} = require('../keys');
const passport = require('passport');
const datab = require('../database')
const bcrypt = require('bcrypt');
'use strict';

function encode(str) {
    let buff = new Buffer.alloc(str);
    return buff.toString('base64');
}

function decode(str) {
    return Buffer.from(str, 'base64');
}

function decode2(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}

function decode3(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}

async function isRegistered(name) {
    const registeredPlayer = await datab.query('SELECT username FROM `sc_users` WHERE username LIKE ?', [name]);
    return registeredPlayer.length !== 0;
}
async function isPasswordCorrect(name , pass) {
    const registeredPlayer = await datab.query('SELECT password FROM `sc_users` WHERE username LIKE ?', [name]);
    const booleanPassword = await bcrypt.compare(pass,registeredPlayer[0].password).then((result)=>{
        return result;
    });
    return booleanPassword;
}
async function addServer(database){
    try{
        const { username, db, host, password, port, address } = database;
        let owner = decode2(database.owner);
        let server = decode2(database.server);
        let staff = {
            owner
        }
        const insert = {
            owner,
            server,
            address,
            username,
            db,
            host,
            port,
            password,
            staff
        };
        await datab.query('INSERT INTO sc_servers SET ?', [insert]);
        const result = await datab.query('SELECT serverId FROM sc_servers WHERE server LIKE ?', [server]);
        const serverId = result[0].serverId;
        let maxBans = 100, maxReports = 100, maxWarns = 100, maxPlayers = 1000, isPublic = false;
        const serverSettings = {
            serverId,
            maxBans,
            maxReports,
            maxWarns,
            maxPlayers,
            isPublic
        }
        await datab.query('INSERT INTO sc_servers_settings SET ?', [serverSettings]);
        await datab.query('UPDATE sc_users SET serverId = ?, staffId = ? WHERE username = ?', [serverId,3,owner])

    } catch (Exception){
        console.log(Exception)
    }
}
async function removeServer(database){
    try{
        let owner = decode2(database.owner);
        const result = await datab.query('SELECT serverId FROM sc_users WHERE username LIKE ?', [owner]);
        const serverId = result[0].serverId;
        await datab.query('UPDATE sc_users SET serverId = ?, staffId = ? WHERE username = ?', [null,1,owner])
        await datab.query('DELETE FROM sc_servers WHERE serverId = ?', [serverId]);
    } catch (Exception){
        console.log(Exception)
    }
}


const isServerRegistered = async ( server ) =>{
    const result = await datab.query('SELECT server FROM `sc_servers` WHERE server LIKE ?', [server]);
    return result.length !== 0;
}

const isPlayerLinked = async ( player )=>{
    const result = await datab.query('SELECT serverId FROM `sc_users` WHERE username LIKE ?', [player]);
    return result[0].serverId !== null;
}


router.get('/', (req, res) => {
    res.redirect('/')
})

router.get('/:base64', async (req, res) => {
    const base64 = req.params.base64;
    let stringEncoded = decode3(decode2(decode(base64)));
    try {
        const database = JSON.parse(decode(stringEncoded));
        const type = decode2(database.type);
        if ( type === "link"){
            if (await isRegistered(decode(database.owner))) {
                try {
                    const playerName = decode2(database.owner);
                    const webPasswordDecoded = decode2(database.webPasswordEncoded);
                    const serverDecoded = decode2(database.server);
                    if ( await isPasswordCorrect(playerName, webPasswordDecoded) ){
                        if ( !await isServerRegistered(serverDecoded) ){
                            if ( !await isPlayerLinked( playerName ) ){
                                await addServer(database);
                                res.send("&aThe web and your server has successfully Linked")
                            } else {
                                res.send("&cYou have already registered another server");
                            }
                        } else {
                            res.send("&cThis server is already registered by another Player");
                        }
                    } else {
                        res.send("&cThe Password is not correct!");
                    }
                } catch (Exception) {
                    console.log(Exception)
                    res.send("&cSomething went wrong")
                }
            } else {
                res.send("&cYou are not registered, or your Username is different than the Web");
            }
        } else if ( type === "unlink"){
            if (await isRegistered(decode(database.owner))) {
                try {
                    const playerName = decode2(database.owner);
                    const webPasswordDecoded = decode2(database.webPasswordEncoded);
                    const serverDecoded = decode2(database.server);
                    if ( await isPasswordCorrect(playerName, webPasswordDecoded) ){
                        if ( await isServerRegistered(serverDecoded) ){
                            if ( await isPlayerLinked( playerName ) ){
                                await removeServer(database);
                                res.send("&aThe web and your server has successfully Un Linked")
                            } else {
                                res.send("&cThat server does not correspond to you");
                            }
                        } else {
                            res.send("&cThis server is registered by another Player");
                        }
                    } else {
                        res.send("&cThe Password is not correct!");
                    }
                } catch (Exception) {
                    console.log(Exception)
                    res.send("&cSomething went wrong")
                }
            } else {
                res.send("&cYou are not registered, or your Username is different than the Web");
            }
        }
    } catch (SyntaxError) {
        console.log(SyntaxError)
        res.send("What are you doing?")
    }
});


module.exports = router;