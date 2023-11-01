USE sedb;

CREATE TABLE IF NOT EXISTS Basket(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES User(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES Post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);