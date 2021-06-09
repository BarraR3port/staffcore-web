USE
staffcore;

INSERT INTO sc_alts(Name, Ips) VALUE ('Alfredo', '193.153.235.561');
INSERT INTO sc_alts(Name, Ips) VALUE ('Ignacio', '123.634.654.351');
INSERT INTO sc_alts(Name, Ips) VALUE ('Brinda', '233.234.745.153');
INSERT INTO sc_alts(Name, Ips) VALUE ('Bermudas', '123.34.355.641');

ALTER TABLE sc_users ADD FOREIGN KEY (serverId) REFERENCES sc_servers(serverId);


SELECT server FROM `sc_servers` WHERE server LIKE 'StaffCore';

SELECT serverId FROM `sc_users` WHERE username LIKE 'BarraR3port';

insert into sc_servers(owner, server, username, db, host, password, staff) VALUE ( 'awdawda',
                                                                                  'h523',
                                                                                  'sdb235',
                                                                                  'n3n523',
                                                                                  'asdaasdad',
                                                                                  'asdasdad',
                                                                                  'BarrgfaR3port,aweb23');





CREATE TABLE IF NOT EXISTS sc_servers_staff(
                                               staffId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                               role VARCHAR(20) NOT NULL UNIQUE KEY);

INSERT INTO sc_servers_staff(role) VALUES ('Admin');
INSERT INTO sc_servers_staff(role) VALUES ('Mod');
INSERT INTO sc_servers_staff(role) VALUES ('User');

CREATE TABLE IF NOT EXISTS sc_servers(
                                         serverId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         owner VARCHAR(20) NOT NULL UNIQUE KEY,
                                         server VARCHAR(30) NOT NULL UNIQUE KEY,
                                         address VARCHAR(30) NOT NULL UNIQUE KEY,
                                         username VARCHAR(100) NOT NULL,
                                         db VARCHAR(100) NOT NULL,
                                         host VARCHAR(100) NOT NULL,
                                         port VARCHAR(30) NOT NULL,
                                         password VARCHAR(100),
                                         staff VARCHAR(200));

CREATE TABLE IF NOT EXISTS sc_users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR (20) NOT NULL UNIQUE KEY,
    mail VARCHAR(40) NOT NULL UNIQUE KEY,
    password VARCHAR(255) NOT NULL,
    serverId INT,
    staffId INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_staff_id FOREIGN KEY (staffId) REFERENCES sc_servers_staff(staffId),
    CONSTRAINT fk_server_id FOREIGN KEY (serverId) REFERENCES sc_servers(serverId));

CREATE TABLE IF NOT EXISTS sc_servers_settings(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    serverId INT,
    maxBans INT NOT NULL DEFAULT 100,
    maxReports INT NOT NULL DEFAULT 100,
    maxWarns INT NOT NULL DEFAULT 100,
    maxPlayers INT NOT NULL DEFAULT 1000,
    public BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_server_id_settings FOREIGN KEY (serverId) REFERENCES sc_servers(serverId)
);



