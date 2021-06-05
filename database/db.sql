USE
staffcore;

CREATE TABLE sc_users
(
    id       INT          NOT NULL AUTO_INCREMENT,
    username VARCHAR(20)  NOT NULL,
    mail     VARCHAR(20)  NOT NULL,
    pass     VARCHAR(255) NOT NULL,
    role     VARCHAR(20)  NOT NULL DEFAULT 'User',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sc_users
(
    id
    INT
    NOT
    NULL
    AUTO_INCREMENT
    PRIMARY
    KEY,
    username
    VARCHAR
(
    20
) NOT NULL, mail VARCHAR
(
    20
) NOT NULL, password VARCHAR
(
    255
) NOT NULL, role VARCHAR
(
    20
) DEFAULT 'User');

INSERT INTO sc_alts(Name, Ips) VALUE ('Alfredo', '193.153.235.561');
INSERT INTO sc_alts(Name, Ips) VALUE ('Ignacio', '123.634.654.351');
INSERT INTO sc_alts(Name, Ips) VALUE ('Brinda', '233.234.745.153');
INSERT INTO sc_alts(Name, Ips) VALUE ('Bermudas', '123.34.355.641');
