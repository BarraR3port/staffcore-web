USE
staffcore;

INSERT INTO sc_alts(Name, Ips) VALUE ('Alfredo', '193.153.235.561');
INSERT INTO sc_alts(Name, Ips) VALUE ('Ignacio', '123.634.654.351');
INSERT INTO sc_alts(Name, Ips) VALUE ('Brinda', '233.234.745.153');
INSERT INTO sc_alts(Name, Ips) VALUE ('Bermudas', '123.34.355.641');

ALTER TABLE sc_users
    ADD FOREIGN KEY (serverId) REFERENCES sc_servers (serverId);


SELECT server
FROM `sc_servers`
WHERE server LIKE 'StaffCore';

SELECT serverId
FROM `sc_users`
WHERE username LIKE 'BarraR3port';

insert into sc_servers(owner, server, username, db, host, password, staff) VALUE ( 'awdawda',
                                                                                  'h523',
                                                                                  'sdb235',
                                                                                  'n3n523',
                                                                                  'asdaasdad',
                                                                                  'asdasdad',
                                                                                  'BarrgfaR3port,aweb23');



CREATE TABLE IF NOT EXISTS sc_servers_staff
(
    staffId
    INT
    NOT
    NULL
    AUTO_INCREMENT
    PRIMARY
    KEY,
    role
    VARCHAR
(
    20
) NOT NULL UNIQUE KEY);

INSERT INTO sc_servers_staff(role)
VALUES ('Admin');
INSERT INTO sc_servers_staff(role)
VALUES ('Mod');
INSERT INTO sc_servers_staff(role)
VALUES ('User');

CREATE TABLE IF NOT EXISTS sc_servers
(
    serverId
    INT
    NOT
    NULL
    AUTO_INCREMENT
    PRIMARY
    KEY,
    owner
    VARCHAR
(
    20
) NOT NULL UNIQUE KEY,
    server VARCHAR
(
    30
) NOT NULL UNIQUE KEY,
    address VARCHAR
(
    30
) NOT NULL UNIQUE KEY,
    username VARCHAR
(
    100
) NOT NULL,
    db VARCHAR
(
    100
) NOT NULL,
    host VARCHAR
(
    100
) NOT NULL,
    port VARCHAR
(
    30
) NOT NULL,
    password VARCHAR
(
    100
),
    staff VARCHAR
(
    200
));

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
) NOT NULL UNIQUE KEY,
    mail VARCHAR
(
    40
) NOT NULL UNIQUE KEY,
    password VARCHAR
(
    255
) NOT NULL,
    serverId INT,
    staffId INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_staff_id FOREIGN KEY
(
    staffId
) REFERENCES sc_servers_staff
(
    staffId
),
    CONSTRAINT fk_server_id FOREIGN KEY
(
    serverId
) REFERENCES sc_servers
(
    serverId
));

CREATE TABLE IF NOT EXISTS sc_servers_settings
(
    id
    INT
    NOT
    NULL
    AUTO_INCREMENT
    PRIMARY
    KEY,
    serverId
    INT,
    maxBans
    INT
    NOT
    NULL
    DEFAULT
    100,
    maxReports
    INT
    NOT
    NULL
    DEFAULT
    100,
    maxWarns
    INT
    NOT
    NULL
    DEFAULT
    100,
    maxPlayers
    INT
    NOT
    NULL
    DEFAULT
    1000,
    isPublic
    BOOLEAN
    NOT
    NULL
    DEFAULT
    TRUE,
    CONSTRAINT fk_server_id_settings FOREIGN KEY( serverId) REFERENCES sc_servers(serverId)
    );
INSERT INTO sc_servers_settings(public, serverId)
VALUES (public =?, serverId = ?)


CREATE TABLE sc_web_admins (
                     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                     username VARCHAR(30) NOT NULL
                     );
INSERT INTO sc_web_admins(username) VALUES ('BarraR3port');

SELECT username FROM sc_web_admins WHERE username LIKE ('BarraR3port');

INSERT INTO sc_servers(owner, server, address, username, db, host, port, password, staff)
 VALUES ('Bermudas','servertest','c3RhZmZjb3Jl','c3RhZmZjb3Jl','c3RhZmZjb3Jl','c3RhZmZjb3JlLmNsYmxncDNicWNtZS51cy1lYXN0LTIucmRzLmFtYXpvbmF3cy5jb20','MzMwNg','YnJ1bm95c2FtdWVsMjQ1Mw','Bermudas,Alfredo');

SELECT  * FROM sc_bans;
SELECT Name, BanId from sc_bans where BanId between 5 and 12 order by Name;

ALTER TABLE sc_servers_settings change maxBans maxBans varchar(40);
--
--
--
-- CREATE TABLE Inventario(IdInventario int PRIMARY KEY AUTO_INCREMENT, Realizo VARCHAR(30) NOT NULL);
-- CREATE TABLE Predios(IdPredio int NOT NULL AUTO_INCREMENT PRIMARY KEY , Predio varchar(50) NOT NULL, Zona varchar(30) NOT NULL, codigoinventario INT NOT NULL );
-- CREATE TABLE Contratos(IdContrato int NOT NULL AUTO_INCREMENT, Contrato varchar(12) NOT NULL, CodigoPredio int NOT NULL, PRIMARY KEY (IdContrato), CONSTRAINT fk_cod_Predido FOREIGN KEY( CodigoPredio ) REFERENCES Predios(IdPredio) );
-- CREATE TABLE Orden(idorden int NOT NULL AUTO_INCREMENT PRIMARY KEY, anoplanta int NOT NULL, superficie REAL NOT NULL, Bloque int NOT NULL, codigocontrato int NOT NULL, FOREIGN KEY (codigocontrato) REFERENCES Contratos(IdContrato) );
-- CREATE TABLE Sitios(IdSitio int NOT NULL AUTO_INCREMENT PRIMARY KEY,Sitio int NOT NULL, CodigoOrden int NOT NULL);
-- CREATE TABLE Arboles (IdArbol int NOT NULL AUTO_INCREMENT, Fuente varchar(10) NOT NULL, Especie varchar(20) NOT NULL, Edad REAL NOT NULL, NumArbol int NOT NULL, Diametro REAL NOT NULL, Altura REAL NOT NULL, CodigoSitio int NOT NULL, FechaPlan int NOT NULL , PRIMARY KEY (IdArbol), FOREIGN KEY (CodigoSitio) REFERENCES Sitios(IdSitio));
-- CREATE TABLE Usuarios(Clave VARCHAR(10) NOT NULL, Nombre VARCHAR(20) NOT NULL, ApellidoP VARCHAR(20), ApellidoM VARCHAR(20), Tipo VARCHAR(12));
-- CREATE TABLE Persona(idPersona INT PRIMARY KEY AUTO_INCREMENT NOT NULL, Nombres VARCHAR(45), ApePaterno VARCHAR(45), ApeMaterno VARCHAR(45), FechaNacimiento DATETIME, Email VARCHAR(45), Direccion VARCHAR(45), Telefono VARCHAR(45));
--
-- CREATE TABLE Perfil (idPerfil INT PRIMARY KEY AUTO_INCREMENT NOT NULL, Nombre VARCHAR(45), Descripcion VARCHAR(45));
--
-- RENAME TABLE Usuarios TO Usuario;
-- ALTER TABLE Usuario CHANGE Nombre NombreUsuario varchar(45) NOT NULL;
-- ALTER TABLE Usuario CHANGE Clave Contraseniha varchar(45) NOT NULL;
-- ALTER TABLE Usuario DROP COLUMN Tipo;
-- ALTER TABLE Usuario DROP COLUMN ApellidoP;
-- ALTER TABLE Usuario DROP COLUMN ApellidoM;
-- ALTER TABLE Usuario ADD Estado varchar(45) NOT NULL;
-- ALTER TABLE Usuario ADD IdUsuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT;
-- ALTER TABLE Usuario ADD IdPersona INT NOT NULL;
-- ALTER TABLE Usuario ADD FOREIGN KEY (IdPersona) REFERENCES Persona(idPersona);
-- ALTER TABLE Usuario ADD IdPerfil INT NOT NULL;
-- ALTER TABLE Usuario ADD FOREIGN KEY (IdPerfil) REFERENCES Perfil(IdPerfil);