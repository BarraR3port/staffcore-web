USE
staffcore;

CREATE TABLE IF NOT EXISTS sc_users (
                                        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                        username VARCHAR (20) NOT NULL UNIQUE KEY,
                                        mail VARCHAR(40) NOT NULL UNIQUE KEY,
                                        password VARCHAR(255) NOT NULL,
                                        linked BOOLEAN DEFAULT FALSE,
                                        serverId INT,
                                        role VARCHAR(20) NOT NULL DEFAULT 'User');
CREATE TABLE IF NOT EXISTS sc_servers(
                                         serverId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         owner VARCHAR(20) NOT NULL,
                                         server VARCHAR(30) NOT NULL,
                                         username VARCHAR(100) NOT NULL,
                                         db VARCHAR(100) NOT NULL,
                                         host VARCHAR(100) NOT NULL,
                                         password VARCHAR(100),
                                         staff VARCHAR(200),
                                         FOREIGN KEY (owner) REFERENCES sc_users (username));

INSERT INTO sc_alts(Name, Ips) VALUE ('Alfredo', '193.153.235.561');
INSERT INTO sc_alts(Name, Ips) VALUE ('Ignacio', '123.634.654.351');
INSERT INTO sc_alts(Name, Ips) VALUE ('Brinda', '233.234.745.153');
INSERT INTO sc_alts(Name, Ips) VALUE ('Bermudas', '123.34.355.641');

ALTER TABLE sc_users ADD FOREIGN KEY (serverId) REFERENCES sc_servers(serverId)


SELECT server FROM `sc_servers` WHERE server LIKE 'StaffCore';

SELECT serverId FROM `sc_users` WHERE username LIKE 'BarraR3port';

insert into sc_servers(owner, server, username, db, host, password, staff) VALUE ( 'awdawda',
                                                                                  'h523',
                                                                                  'sdb235',
                                                                                  'n3n523',
                                                                                  'asdaasdad',
                                                                                  'asdasdad',
                                                                                  'BarrgfaR3port,aweb23');