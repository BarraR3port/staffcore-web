const express = require('express');
const router = express.Router();
const {version} = require('../keys');
const datab = require('../database')
const bcrypt = require('bcrypt');
const got = require('got');
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


async function isRegistered(name) {
    const registeredPlayer = await datab.query('SELECT username FROM `sc_users` WHERE username LIKE ?', [name]);
    return registeredPlayer.length !== 0;
}

async function isWebServerRegistered(server) {
    const registeredPlayer = await datab.query('SELECT server FROM sc_servers WHERE server LIKE ?', [server]);
    return registeredPlayer.length !== 0;
}

async function isPasswordCorrect(name, pass) {
    const registeredPlayer = await datab.query('SELECT password FROM `sc_users` WHERE username LIKE ?', [name]);
    const booleanPassword = await bcrypt.compare(pass, registeredPlayer[0].password).then((result) => {
        return result;
    });
    return booleanPassword;
}

async function addServer(database) {
    try {
        const {username, db, host, password, port, address} = database;
        let owner = decode2(database.owner);
        let server = decode2(database.server);
        let staff = owner
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
        await datab.query('UPDATE sc_users SET serverId = ?, staffId = ? WHERE username = ?', [serverId, 3, owner])

    } catch (Exception) {
        console.log(Exception)
    }
}

async function removeServer(database) {
    try {
        let owner = decode2(database.owner);
        const result = await datab.query('SELECT serverId FROM sc_users WHERE username LIKE ?', [owner]);
        const serverId = result[0].serverId;
        await datab.query('UPDATE sc_users SET serverId = ?, staffId = ? WHERE username = ?', [null, 1, owner])
        await datab.query('DELETE FROM sc_servers_settings WHERE serverId = ?', [serverId]);
        await datab.query('DELETE FROM sc_servers WHERE serverId = ?', [serverId]);
    } catch (Exception) {
        console.log(Exception)
    }
}


const isServerRegistered = async (server) => {
    const result = await datab.query('SELECT server FROM `sc_servers` WHERE server LIKE ?', [server]);
    return result.length !== 0;
}

const isServerUUIDRegistered = async (uuid) => {
    const result = await datab.query('SELECT UUID FROM `sc_web_stats` WHERE UUID LIKE ?', [uuid]);
    return result.length !== 0;
}

const isPlayerLinked = async (player) => {
    const result = await datab.query('SELECT serverId FROM `sc_users` WHERE username LIKE ?', [player]);
    return result[0].serverId !== null;
}

const createServerStats = async (data) => {
    await datab.query('INSERT INTO sc_web_stats SET ?', [data]);
}

const updateServerStats = async (updateType, UUID, ServerName, Version) => {
    await datab.query('UPDATE sc_web_stats SET ' + updateType + ' = (' + updateType + ' + 1), ServerName = ?, Version = ? WHERE UUID LIKE ?', [ServerName,Version,UUID]);
}


router.get('/', (req, res) => {
    res.redirect('/')
});

router.get('/version', (req, res) => {
    res.json({
        "latest": version
    })
})
router.get('/password', async (req, res) => {
    let pass = await bcrypt.hash('Brunoysamuel2453', 10)
    await res.json({
        "latest": pass
    })
})
router.get('/stats/:base64', async (req, res) => {
    const base64 = req.params.base64;
    let stringEncoded = decode2(decode2(decode2(base64)));
    try {
        const request = JSON.parse(stringEncoded);
        const type = request.type;
        const UUID = request.UUID;
        if (UUID !== "") {
            if (type === "createServerStats") {
                if (!await isServerUUIDRegistered(UUID)) {
                    try {
                        const data = {
                            UUID: request.UUID,
                            ServerName: request.ServerName,
                            Version: request.Version,
                            Bans: request.CurrentBans,
                            Reports: request.CurrentReports,
                            Warns: request.CurrentWarns,
                            Players: request.CurrentPlayers,
                            Frozen: request.CurrentFrozen,
                            Staff: request.CurrentStaff,
                            Vanish: request.CurrentVanished,
                            Wipes: request.CurrentWipes,
                            Mutes: request.CurrentMutes
                        }
                        try {
                            await createServerStats(data);
                            res.json({
                                "type": "success"
                            })
                        } catch (Exception) {
                            console.log(Exception)
                            res.json({
                                "type": "error",
                                "msg": "error_catch"
                            })
                        }
                    } catch (Exception) {
                        console.log(Exception)
                        res.json({
                            "type": "error",
                            "msg": "error_catch"
                        })
                    }
                } else {
                    res.json({
                        "type": "error",
                        "msg": "server_not_registered"
                    })
                }
            } else if (type === "updateServerStats") {
                try {
                    const updateType = request.updateType;
                    const ServerName = request.ServerName;
                    const Version = request.Version;
                    await updateServerStats(updateType, UUID, ServerName, Version)
                    res.json({
                        "type": "success"
                    })
                } catch (Exception) {
                    console.log(Exception)
                    res.json({
                        "type": "error",
                        "msg": "error_catch"
                    })
                }
            }
        } else {
            res.json({
                "type": "error",
                "msg": "server_not_registered"
            })
        }
    } catch (SyntaxError) {
        res.send("What are you doing?")
    }
});

router.get('/head/:username', async (req, res) => {
    let username = req.params.username;

    let responseId = await got.get('https://api.mojang.com/users/profiles/minecraft/' + username, {responseType: 'json'})
        .then(res => {
            return JSON.parse(res.body);
        })
        .catch(err => {
            console.log('Error: ', err.message);
            res.json({"type": "error"})
        });
    let responseFinal = await got.get('https://sessionserver.mojang.com/session/minecraft/profile/' + responseId.id, {responseType: 'json'})
        .then(res => {
            return JSON.parse(res.body);
        })
        .catch(err => {
            console.log('Error: ', err.message);
            res.json({"type": "error"})
        });
    let value = responseFinal.properties[0].value;
    await res.json({"type": "success", "value": value})
})


router.get('/:base64', async (req, res) => {
    const base64 = req.params.base64;
    let stringEncoded = decode2(decode2(decode(base64)));
    try {
        const database = JSON.parse(decode(stringEncoded));
        const type = decode2(database.type);
        if (type === "link") {
            if (await isRegistered(decode(database.owner))) {
                try {
                    const playerName = decode2(database.owner);
                    const webPasswordDecoded = decode2(database.webPasswordEncoded);
                    const serverDecoded = decode2(database.server);
                    if (await isPasswordCorrect(playerName, webPasswordDecoded)) {
                        if (!await isServerRegistered(serverDecoded)) {
                            if (!await isPlayerLinked(playerName)) {
                                await addServer(database);
                                res.json({
                                    "type": "success",
                                    "msg": "link_success"
                                })
                            } else {
                                res.json({
                                    "type": "error",
                                    "msg": "error_already_registered"
                                })
                            }
                        } else {
                            res.json({
                                "type": "error",
                                "msg": "error_already_registered_by_other"
                            })
                        }
                    } else {
                        res.json({
                            "type": "error",
                            "msg": "error_incorrect_password"
                        })
                    }
                } catch (Exception) {
                    console.log(Exception)
                    res.json({
                        "type": "error",
                        "msg": "error_catch"
                    })
                }
            } else {
                res.json({
                    "type": "error",
                    "msg": "error_incorrect_username"
                })
            }
        } else if (type === "unlink") {
            if (await isRegistered(decode(database.owner))) {
                try {
                    const playerName = decode2(database.owner);
                    const webPasswordDecoded = decode2(database.webPasswordEncoded);
                    const serverDecoded = decode2(database.server);
                    if (await isPasswordCorrect(playerName, webPasswordDecoded)) {
                        if (await isServerRegistered(serverDecoded)) {
                            if (await isPlayerLinked(playerName)) {
                                await removeServer(database);
                                res.json({
                                    "type": "success",
                                    "msg": "unlink_success"
                                })
                            } else {
                                res.json({
                                    "type": "error",
                                    "msg": "error_already_registered"
                                })
                            }
                        } else {
                            res.json({
                                "type": "error",
                                "msg": "error_already_registered_by_other"
                            })
                        }
                    } else {
                        res.json({
                            "type": "error",
                            "msg": "error_incorrect_password"
                        })
                    }
                } catch (Exception) {
                    console.log(Exception)
                    res.json({
                        "type": "error",
                        "msg": "error_catch"
                    })
                }
            } else {
                res.json({
                    "type": "error",
                    "msg": "error_incorrect_username"
                })
            }
        } else if (type === "islinked") {
            await res.json({
                "is_Registered": await isWebServerRegistered(decode2(database.server))
            });
        }
    } catch (SyntaxError) {
        res.send("What are you doing?")
    }
});


module.exports = router;