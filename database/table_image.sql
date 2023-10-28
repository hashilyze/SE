USE sedb;

CREATE TABLE IF NOT EXISTS image(
    pid     INT             NOT NULL,                   # 게시물 번호
    mid     INT             NOT NULL AUTO_INCREMENT,    # 이미지 식별 번호
    url     VARCHAR(1000)   NOT NULL,                   # 이미지 이름

    PRIMARY KEY (mid, pid),
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);