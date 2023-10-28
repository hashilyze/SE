USE sedb;

CREATE TABLE IF NOT EXISTS post(
    pid         INT         NOT NULL AUTO_INCREMENT,    # 식별 번호
    title       VARCHAR(60) NOT NULL,                   # 제목
    writer      INT         NOT NULL,                   # 작성자
    category    INT         NOT NULL,                   # 카테고리
    content     TEXT        NOT NULL,                   # 내용
    reg_date    TIMESTAMP   NOT NULL,                   # 등록일
    udt_date    TIMESTAMP   DEFAULT NULL,               # 최종 수정일
    PRIMARY KEY (pid),
    FOREIGN KEY (writer)    REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category)  REFERENCES category(cid) ON DELETE RESTRICT ON UPDATE CASCADE
);