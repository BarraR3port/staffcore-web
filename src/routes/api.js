const express = require('express');
const router = express.Router();
const got = require('got');
const {database, config} = require('../keys');
const {isConfigured, isLoggedIn} = require('../lib/auth')
const passport = require('passport');
const db = require('../database')
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
    const registeredPlayer = await db.query('SELECT username FROM `sc_users` WHERE username LIKE ?', [name]);
    return registeredPlayer.length !== 0;
}
async function isPasswordCorrect(name , pass) {
    const registeredPlayer = await db.query('SELECT password FROM `sc_users` WHERE username LIKE ?', [name]);
    console.log("pass: "+ registeredPlayer[0].password)
    const booleanPassword = await bcrypt.compare(pass,registeredPlayer[0].password).then((result)=>{
        console.log(result);
        return result;
    });
    return booleanPassword;
}

router.get('/', isConfigured, (req, res) => {
    res.redirect('/')
})

router.get('/:base64', async (req, res) => {
    const base64 = req.params.base64;
    let stringEncoded = decode3(decode2(decode(base64)));

    try {
        const database = JSON.parse(decode(stringEncoded));
        if (await isRegistered(decode(database.playername))) {
            try {
                const playerName = decode2(database.playername);
                const webPasswordDecoded = decode2(database.webPassword);
                if ( await isPasswordCorrect(playerName, webPasswordDecoded) ){
                    console.log("&aThe web and your server has successfully Linked")
                    res.send("&aThe web and your server has successfully Linked");
                } else {
                    console.log("&cThe Password is not correct!")
                    res.send("&cThe Password is not correct!");
                }
                // HERE IS WHERE I WANT TO COMPARE THE PASSWORD
                //await db.query(`UPDATE sc_users SET db = ? WHERE username = ?`, [database, playerName]);
            } catch (Exception) {
                console.log(Exception)
                res.send("&cSomething went wrong")
            }
            //await res.json(jsonString);
        } else {
            res.send("&cYou are not registered, or your Username is different than the Web");
        }
    } catch (SyntaxError) {
        res.send("What are you doing?")
    }
});


module.exports = router;