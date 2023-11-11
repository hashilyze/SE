CREATE TABLE IF NOT EXISTS User(
    uid         INT             NOT NULL AUTO_INCREMENT,    # 식별번호
    role        INT             NOT NULL DEFAULT 0,         # 권한  (0: 사용자, 1: 관리자)
    login_id    VARCHAR(60)     NOT NULL UNIQUE,            # 회원 아이디 (대체키)
    password    VARCHAR(60)     NOT NULL,                   # 회원 비밀번호
    name        VARCHAR(60)     NOT NULL,                   # 이름
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),     # 가입일
    PRIMARY KEY (uid)
);