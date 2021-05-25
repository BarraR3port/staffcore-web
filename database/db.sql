USE staffcore;

CREATE TABLE players(
    id INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    pass VARCHAR(255) NOT NULL
);
ALTER TABLE players
    ADD PRIMARY KEY (id);

ALTER TABLE players
    MODIFY id  INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE players
    ADD FOREIGN KEY (nickname) REFERENCES sc_alts(Name);
INSERT INTO sc_alts(Name, Ips) VALUE ('Alfredo', '193.153.235.561');
INSERT INTO sc_alts(Name, Ips) VALUE ('Ignacio', '123.634.654.351');
INSERT INTO sc_alts(Name, Ips) VALUE ('Brinda', '233.234.745.153');
INSERT INTO sc_alts(Name, Ips) VALUE ('Bermudas', '123.34.355.641');
