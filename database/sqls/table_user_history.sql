USE sedb;


CREATE TABLE IF NOT EXISTS user_view(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    log_time    TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_download(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    log_time    TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_like(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    log_time    TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_bookmark(
    uid         INT         NOT NULL,
    pid         INT         NOT NULL,
    log_time    TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (pid, uid),
    FOREIGN KEY (uid)   REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);
