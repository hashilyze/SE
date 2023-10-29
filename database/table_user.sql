USE sedb;

CREATE TABLE IF NOT EXISTS user(
    uid         INT             NOT NULL AUTO_INCREMENT,    # 식별번호
    id          VARCHAR(60)     NOT NULL UNIQUE,            # 회원 아이디
    password    VARCHAR(60)     NOT NULL,                   # 회원 비밀번호
    name        VARCHAR(60)     NOT NULL,                   # 이름
    PRIMARY KEY (uid)
);