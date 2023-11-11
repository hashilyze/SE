CREATE TABLE IF NOT EXISTS User_View(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    logged_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS User_Like(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    logged_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS User_Download(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    logged_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);