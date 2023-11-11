CREATE TABLE IF NOT EXISTS Post(
    # header
    pid         INT         NOT NULL AUTO_INCREMENT,    # 식별 번호
    title       VARCHAR(60) NOT NULL,                   # 제목
    writer      INT         NOT NULL,                   # 작성자
    category    INT         NOT NULL,                   # 카테고리
    format      INT         NOT NULL,                   # 형식
    # contents
    description TEXT        NOT NULL,                   # 내용
    price       INT         NOT NULL,                   # 가격
    # meta
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),     # 등록일
    views       INT         NOT NULL DEFAULT 0,         # 조회수
    likes       INT         NOT NULL DEFAULT 0,         # 추천수
    downloads   INT         NOT NULL DEFAULT 0,         # 다운로드수
    # constraints
    PRIMARY KEY (pid),
    FOREIGN KEY (writer)    REFERENCES User(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category)  REFERENCES Category(cid) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (format)    REFERENCES Format(fid) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Post_Image(
    pid      INT             NOT NULL,                   # 게시물 번호
    img_id   INT             NOT NULL,                   # 이미지 번호
    name     VARCHAR(1000)   NOT NULL,                   # 이미지 이름
    
    PRIMARY KEY (pid, img_id),
    FOREIGN KEY (pid)   REFERENCES Post(pid) ON DELETE CASCADE ON UPDATE CASCADE
);