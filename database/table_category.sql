USE sedb;

CREATE TABLE IF NOT EXISTS category(
    cid     INT             NOT NULL AUTO_INCREMENT,    # 식별 번호
    name    VARCHAR(60)     NOT NULL UNIQUE,            # 카테고리 이름
    PRIMARY KEY(cid)
);