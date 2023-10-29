USE sedb;

CREATE TABLE IF NOT EXISTS post(
    pid         INT         NOT NULL AUTO_INCREMENT,    # 식별 번호
    title       VARCHAR(60) NOT NULL,                   # 제목
    writer      INT         NOT NULL,                   # 작성자
    category    INT         NOT NULL,                   # 카테고리
    content     TEXT        NOT NULL,                   # 내용
    reg_date    TIMESTAMP   NOT NULL DEFAULT NOW(),     # 등록일

    views       INT         NOT NULL DEFAULT 0,         # 조회수
    likes       INT         NOT NULL DEFAULT 0,         # 추천수
    downloads   INT         NOT NULL DEFAULT 0,         # 다운로드수
    
    PRIMARY KEY (pid),
    FOREIGN KEY (writer)    REFERENCES user(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category)  REFERENCES category(cid) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS image(
    pid     INT             NOT NULL,                   # 게시물 번호
    mid     INT             NOT NULL,                   # 이미지 식별 번호
    url     VARCHAR(1000)   NOT NULL,                   # 이미지 이름

    PRIMARY KEY (mid, pid),
    FOREIGN KEY (pid)   REFERENCES post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);