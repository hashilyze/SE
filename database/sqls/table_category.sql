CREATE TABLE IF NOT EXISTS Category(
    cid     INT             NOT NULL AUTO_INCREMENT,    # 식별 번호
    name    VARCHAR(60)     NOT NULL UNIQUE,            # 이름 (대체키)
    PRIMARY KEY(cid)
);